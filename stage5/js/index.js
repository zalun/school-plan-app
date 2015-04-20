var app = {
    planGroup: null,
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        var request = new XMLHttpRequest();
        request.onload = app.renderData;
        request.open("get", "app_data/plans.json", true);
        request.send();

        // Switching from one tab to another is done automatically
        // We just need to link it backwards - change menu if slides
        // changed without touching the menu

        app.planGroupMenu = document.getElementById('plan-group-menu');
        // There is a need to wait until Polyfill upgrades process
        
        
        // Implementing one finger swipe to change deck card
        
        app.planGroup = document.getElementById('plan-group');

        var startX = null;
        var slideThreshold = 100;

        function touchStart(sX) {
            startX = sX;
        }

        function touchEnd(endX) {
            var deltaX;
            if (startX) {
                deltaX = endX - startX;
                if (Math.abs(deltaX) > slideThreshold) {
                    startX = null;
                    if (deltaX > 0) {
                        app.previousPlan();
                    } else {
                        app.nextPlan();
                    }
                }
            }
        }

        app.planGroup.addEventListener('touchstart', function(evt) {
            var touches = evt.changedTouches;
            if (touches.length == 1) {
                // runs only for one finger touch
                touchStart(touches[0].pageX);
            }
        });

        app.planGroup.addEventListener('touchmove', function(evt) {
            // switched off scrolling on webkit
            evt.preventDefault(); 
            touchEnd(evt.changedTouches[0].pageX);
        });
    },

    renderData: function() {
        var plans = JSON.parse(this.responseText);
        app.createUI(plans);
    },
    createUI: function(plans) {
      function selectTab(deck, activeTab) {
          function selectActiveTab() {
              if (!activeTab.targetElement) {
                  return window.setTimeout(selectActiveTab, 100);
              }
              deck.showCard(activeTab.targetElement);
          }
          selectActiveTab();
      }
      var deck = document.getElementById('plan-group');
      var tabbar = document.getElementById('plan-group-menu');
      navigator.globalization.getDateNames(function(dayOfWeek){
        for (var i = 0; i < plans.length; i++) {
            var plan = plans[i];

            // create card
            var card = document.createElement('brick-card');
            card.setAttribute('id', plan.id);
            deck.appendChild(card);

            //create tab
            var tab = document.createElement('brick-tabbar-tab');
            tab.setAttribute('target', plan.id);
            tab.appendChild(document.createTextNode(plan.title));
            tabbar.appendChild(tab);

            // link card to tab
            card.tabElement = tab;
            card.addEventListener('show', function() {
                this.tabElement.select();
            });

            // create plan table
            var table = document.createElement('table');

            // hide not used days
            var numberOfDays = plan.week.length;
            var cleanPlan = [];
            for (var j = 0; j < numberOfDays; j++) {
                if (plan.week[j].length > 0) {
                    cleanPlan.push(plan.week[j]);
                }
            }

            // rotate the table
            var daysInHours = [];
            for (j = 0; j < cleanPlan.length; j++) {
                for (var k = 0; k < cleanPlan[j].length; k++) {
                    if (!daysInHours[k]) {
                        daysInHours[k] = [];
                    }
                    daysInHours[k][j] = cleanPlan[j][k];
                }
            }

            // create plan's DOM Elements
            for (var j = 0; j < daysInHours.length; j++) {
                var tr = table.insertRow(-1);
                var td = tr.insertCell(-1);
                td.appendChild(document.createTextNode(j + 1));
                for (var k = 0; k < cleanPlan.length; k++) {
                    var td = tr.insertCell(-1);
                    if (daysInHours[j][k]) {
                        td.appendChild(document.createTextNode(daysInHours[j][k]));
                    }
                }
            }            

            // create plan's header
            var thead = table.createTHead();
            var tr = thead.insertRow();
            var th_empty = document.createElement('th');
            tr.appendChild(th_empty);
            var weekDayNumber;
            for (var j = 0; j < numberOfDays; j++) {
                var weekDayNumber = (j + 1) % 7;
                if (plan.week[j].length > 0) {
                    var th = document.createElement('th');
                    th.appendChild(document.createTextNode(dayOfWeek.value[weekDayNumber]));
                    tr.appendChild(th);
                }
            }
            card.appendChild(table);

            // select current plan if active
            if (plan.active) {
                selectTab(deck, tab);
            }
        }
      }, function() {}, {type: 'narrow', item: 'days'});
    },
    previousPlan: function() {
        app.planGroup.previousCard();
    },
    nextPlan: function() {
        app.planGroup.nextCard();
    }
}

window.onload = function() {
  app.initialize();
}

