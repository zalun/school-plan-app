var app = {
    planGroup: null,
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    renderData: function() {
        // this.responseText is the file content
        var plans = [];
        try {
            plans = JSON.parse(this.responseText);
        } catch(e) {
            console.log('DEBUG: Unable to parse the JSON file');
        }
        app.createUI(plans);
    },
    createUI: function(plans) {
        var deck = document.getElementById('plan-group');
        var tabbar = document.getElementById('plan-group-menu');
        // using day of the week in current language
        navigator.globalization.getDateNames(function(dayOfWeek){
            for (var i = 0; i < plans.length; i++) {
                var plan = plans[i];
                // create plan table
                var table = document.createElement('table');
                // create table header
                var thead = document.createElement('thead');
                var th_empty = document.createElement('th');
                thead.appendChild(th_empty);
                for (var j = 0; j < plan.week.length; j++) {
                    if (plan.week[j]) {
                      var th = document.createElement('th');
                      th.appendChild(document.createTextNode(dayOfWeek.value[j]));
                      thead.appendChild(th);
                    }
                }
                table.appendChild(thead);
                // create table body
                var tbody = document.createElement('tbody');
                // transpone table (tables are created per hour instead
                // of per day as data is written)
                var daysInHours = [];
                for (var j = 0; j < plan.week.length; j++) {
                    for (var k = 0; k < plan.week[j].length; k++) {
                        if (!daysInHours[k]) {
                            daysInHours[k] = [];
                        }
                        daysInHours[k][j] = plan.week[j][k];
                    }
                }
                for (var j = 0; j < daysInHours.length; j++) {
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    tr.appendChild(td);
                    td.appendChild(document.createTextNode(j + 1));
                    for (var k = 0; k < daysInHours[j].length; k++) {
                        var td = document.createElement('td');
                        if (daysInHours[j][k]) {
                            td.appendChild(document.createTextNode(daysInHours[j][k]));
                        }
                        tr.appendChild(td);
                    }
                    tbody.appendChild(tr);
                }
                table.appendChild(tbody);

                // create card and deck
                var card = document.createElement('brick-card');
                card.setAttribute('id', plan.id);
                card.appendChild(table);
                deck.appendChild(card); 
                var tab = document.createElement('brick-tabbar-tab');
                tab.setAttribute('target', plan.id);
                tab.appendChild(document.createTextNode(plan.title));
                tabbar.appendChild(tab);

                // select the active tab
                if (plan.active) {
                    var activeTab = tab;
                    window.setTimeout(function() {activeTab.select()}, 0);
                }

                // Switching from one tab to another is done automatically
                // We just need to link it backwards - change tab if
                // card changed without touching the tabbar elements
                card.tabElement = tab;
                card.addEventListener('show', function() {
                    this.tabElement.select();
                });
            }
        }, function() {}, {type: 'narrow', item: 'days'});
    },
    onDeviceReady: function() {
        // Load plans from JSON
        // Get access to data/plans.json file
        var request = new XMLHttpRequest();
        request.onload = app.renderData;
        request.onerror = function(error) {
            console.log('DEBUG: Failed to get ``app_data/plans.json`` file', error);
        };
        request.open("get", "app_data/plans.json", true);
        request.send();

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
                // only one finger swipe is important for us
                touchStart(touches[0].pageX);
            }
        });

        app.planGroup.addEventListener('touchmove', function(evt) {
            // switched off scrolling on webkit
            evt.preventDefault(); 
            touchEnd(evt.changedTouches[0].pageX);
        });
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
