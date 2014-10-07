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
        // using day of the week in current language
        navigator.globalization.getDateNames(function(dayOfWeek){
            navigator.globalization.getFirstDayOfWeek(function(firstDay){
                app.drawUI(plans, dayOfWeek, firstDay);
            });
        }, function() {}, {type: 'narrow', item: 'days'});
    },
    drawUI: function(plans, dayOfWeek, firstDay) {
        var deck = document.getElementById('plan-group');
        var tabbar = document.getElementById('plan-group-menu');
        // calculate the shift based on first day
        var dayShift = (1 - firstDay.value) % 7;
        
        // there is a possibility of race condition, a simple hack is 
        // to use polling.
        function selectTab(activeTab) {
            function selectActiveTab() {
                if (!activeTab.targetElement) {
                    return window.setTimeout(selectActiveTab, 100);
                }
                deck.showCard(activeTab.targetElement);
            }
            selectActiveTab();
        }

        for (var i = 0; i < plans.length; i++) {
            var plan = plans[i];

            //create tab
            var tab = document.createElement('brick-tabbar-tab');
            tab.setAttribute('target', plan.id);
            tab.appendChild(document.createTextNode(plan.title));
            tabbar.appendChild(tab);

            // create card
            var card = document.createElement('brick-card');
            card.setAttribute('id', plan.id);
            deck.appendChild(card); 

            // create plan table
            var table = document.createElement('table');

            // transpone table (tables are created per hour instead
            // of per day as data is written)
            var numberOfDays = plan.week.length;
            var daysInHours = [];
            // delete non existing days

            var cleanPlan = [];
            for (j = 0; j < numberOfDays; j++) {
                if (plan.week[j].length > 0) {
                    cleanPlan.push(plan.week[j]);
                }
            }
            for (j = 0; j < cleanPlan.length; j++) {
                for (var k = 0; k < cleanPlan[j].length; k++) {
                    if (!daysInHours[k]) {
                        daysInHours[k] = [];
                    }
                    daysInHours[k][j] = cleanPlan[j][k];
                }
            }

            // Switching from one tab to another is done automatically
            // We just need to link it backwards - change tab if
            // card is changed without touching the tabbar elements
            card.tabElement = tab;
            card.addEventListener('show', function() {
                this.tabElement.select();
            });

            // create content of the card
            for (var j = 0; j < daysInHours.length; j++) {
                var tr = table.insertRow(-1);
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(j + 1));
                // we use cleanPlan.length here as we want all hours to
                // be rendered in all days
                for (var k = 0; k < cleanPlan.length; k++) {
                    var td = tr.insertCell();
                    if (daysInHours[j][k]) {
                        td.appendChild(document.createTextNode(daysInHours[j][k]));
                    }
                }
            }
            // create table header
            var thead = table.createTHead();
            var tr = thead.insertRow();
            var th_empty = document.createElement('th');
            tr.appendChild(th_empty);
            for (var j = 0; j < numberOfDays; j++) {
                // add th only if week isn't empty
                if (plan.week[j].length > 0) {
                    var th = document.createElement('th');
                    th.appendChild(document.createTextNode(dayOfWeek.value[j + dayShift]));
                    tr.appendChild(th);
                }
            }
            card.appendChild(table);
            
            // select the active tab
            if (plan.active) {
                selectTab(tab);
            }
        }
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
