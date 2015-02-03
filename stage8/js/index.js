var plansURL = "http://192.168.0.4:8080";
var dayOfWeek;

var app = {
    plans: [],
    planGroup: null,
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    /*
     * drawUI:
     * create a card, tabbar and table for a plan
     */
    drawUI: function(plan, hashtag) {
        var deck = document.getElementById('plan-group');
        var tabbar = document.getElementById('plan-group-menu');
        var tab;
        
        // there is a possibility of race condition (Brick not fully loaded), 
        // a simple hack is to use polling.
        function selectTab(activeTab) {
            function selectActiveTab() {
                if (!activeTab.targetElement) {
                    return window.setTimeout(selectActiveTab, 100);
                }
                deck.showCard(activeTab.targetElement);
            }
            selectActiveTab();
        }
        
        var card = document.getElementById(hashtag);
        // check if we're reloading 
        var reloading = !!card;
        if (!reloading) {
            // create card
            card = document.createElement('brick-card');
            card.setAttribute('id', hashtag);
            deck.appendChild(card); 

            //create tab
            tab = document.createElement('brick-tabbar-tab');
            tab.setAttribute('target', hashtag);
            tab.setAttribute('id', 'tab-' + hashtag);
            tab.appendChild(document.createTextNode(plan.title));
            tabbar.appendChild(tab);
            // Switching from one tab to another is done automatically
            // We just need to link it backwards - change tab if
            // card is changed without touching the tabbar elements
            card.tabElement = tab;
            card.addEventListener('show', function() {
                this.tabElement.select();
            });
        } else {
            tab = document.getElementById('tab-' + hashtag);
            // change the tab name
            tab.firstChild.nodeValue = plan.title;
            // delete table
            var children = card.children;
            for (var i = 0; i < children.length; i++) {
                if (children[i].tagName === 'TABLE') {
                    children[i].remove();
                }
            }
        }

        // create plan table
        var table = document.createElement('table');

        // transpone array (tables are created per hour instead
        // of per day as data is written)
        var numberOfDays = plan.week.length;
        var daysInHours = [];
        // delete non existing days

        var j;
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


        // create content of the card
        for (j = 0; j < daysInHours.length; j++) {
            var tr = table.insertRow(-1);
            var td = tr.insertCell(-1);
            td.appendChild(document.createTextNode(j + 1));
            // we use cleanPlan.length here as we want all hours to
            // be rendered in all days
            for (var k = 0; k < cleanPlan.length; k++) {
                var td = tr.insertCell(-1);
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
        for (var j = 1; j < numberOfDays + 1; j++) {
            // add th only if week isn't empty
            // 0 - Monday, 6 - Sunday
            var planDayNumber = j - 1;
            // 0 - Sunday, 6 - Saturday
            var weekDayNumber = j % 7;
            if (plan.week[planDayNumber].length > 0) {
                var th = document.createElement('th');
                th.appendChild(document.createTextNode(dayOfWeek.value[weekDayNumber]));
                tr.appendChild(th);
            }
        }
        card.appendChild(table);
        
        // select the active tab
        if (!reloading && plan.active) {
            selectTab(tab);
        }
    },

    /*
     * loadPlan:
     * load a plan identified by a hashtag
     * on success draw the UI
     */
    loadPlan: function(hashtag) {
        var request = new XMLHttpRequest({
            mozAnon: true,
            mozSystem: true});
        request.onload = function() {
            var plan;
            try {
                plan = JSON.parse(this.responseText);
            } catch(e) {
                console.log('DEBUG: Unable to parse the JSON file');
            }
            // store plan in localStorage
            localStorage.setItem(hashtag, this.responseText);
            console.log('creating UI from plan loaded via http'); 
            app.drawUI(plan, hashtag);
        };
        request.onerror = function(error) {
            console.log('DEBUG: Failed to get ``' 
                        + plansURL + '/plan/' + hashtag, error);
        };
        request.open("get", plansURL + '/plan/' + hashtag, true);
        request.send();
    },

    /*
     * reloadPlans:
     * get list of the plans for given URL (stored in plansURL)
     */
    reloadPlans: function() {
        var request = new XMLHttpRequest({
            mozAnon: true,
            mozSystem: true});
        request.onload = function() {
            var hashtags = JSON.parse(this.responseText);
            // remove all existing plans from the phone memory
            var oldHashtags = localStorage.getItem('hashtags');
            for (var i=0; i < oldHashtags.length; i++) {
                localStorage.removeItem(oldHashtags[i]);
            }
            localStorage.setItem('hashtags', this.responseText);
            for (var i=0; i < hashtags.length; i++) {
                // get each plan at a time
                // WARNING: order of the plans is a subject of race condition app.loadPlan(hashtags[i]);
                app.loadPlan(hashtags[i]);
            }
        };
        request.onerror = function(error) {
            console.log('DEBUG: Failed to get' + plansURL + '/keys', error);
        };
        request.open('get', plansURL + '/keys', true);
        request.send();
    },

    onDeviceReady: function() {
        navigator.globalization.getDateNames(function(dayOfWeekResponded){
            dayOfWeek = dayOfWeekResponded;
            // check if keys are present in localStorage
            var hashtags = localStorage.getItem('hashtags');
            if (hashtags === null) {
                // no hashtags are stored - we need to load plans from 
                // the server
                app.reloadPlans();
            } else {
                // load plans from storage
                hashtags = JSON.parse(hashtags);
                for (var i=0; i < hashtags.length; i++) {
                    var planString = localStorage.getItem(hashtags[i]);
                    if (planString === null) {
                        app.loadPlan(hashtags[i]);
                    } else {
                        console.log('creating UI from plan in storage'); 
                        var plan = JSON.parse(planString);
                        app.drawUI(plan, hashtags[i]);
                    }
                }
            }
        }, function() {}, {type: 'narrow', item: 'days'});

        var reloadButton = document.getElementById('reload-button');
        reloadButton.addEventListener('touchstart', app.reloadPlans, false);

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
            if (touches.length === 1) {
                // happens only for one finger touch
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
};

window.onload = function() {
  app.initialize();
};
