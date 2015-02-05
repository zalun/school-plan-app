var app = {
    plans: [],
    planGroup: null,
    flipbox: null,
    hashtags: null,
    plansURL: null,
    dayOfWeek: null,
    oldHashtags: [],


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
        var i, j;
        
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
        
        // search for errors
        if (!plan || plan.error || !plan.week) {
            return;
        }

        // create card
        card = document.createElement('brick-card');
        card.setAttribute('id', hashtag);
        deck.appendChild(card); 

        //create tab
        tab = document.createElement('brick-tabbar-tab');
        tab.setAttribute('target', hashtag);
        tab.setAttribute('id', 'tab-' + hashtag);
        // store selectedTab - it is used to provide selecting the last
        // loaded tab by default (if none of plans has ``active`` parameter
        tab.addEventListener('select', function(event) {
            app.selectedTab = event.target;
        });
        tab.appendChild(document.createTextNode(plan.title));
        tabbar.appendChild(tab);
        // Switching from one tab to another is done automatically
        // We just need to link it backwards - change tab if
        // card is changed without touching the tabbar elements
        card.tabElement = tab;
        card.addEventListener('show', function() {
            this.tabElement.select();
        });

        // create plan table
        var table = document.createElement('table');

        // transpone array (tables are created per hour instead
        // of per day as data is stored)
        var numberOfDays = plan.week.length;
        var daysInHours = [];
        // delete non existing days
        var cleanPlan = [];
        for (i = 0; i < numberOfDays; i++) {
            if (plan.week[i].length > 0) {
                cleanPlan.push(plan.week[i]);
            }
        }
        for (i = 0; i < cleanPlan.length; i++) {
            for (j = 0; j < cleanPlan[i].length; j++) {
                if (!daysInHours[j]) {
                    daysInHours[j] = [];
                }
                daysInHours[j][i] = cleanPlan[i][j];
            }
        }


        // create content of the card
        var th, tr, td;
        for (i = 0; i < daysInHours.length; i++) {
            tr = table.insertRow(-1);
            td = tr.insertCell(-1);
            td.appendChild(document.createTextNode(i + 1));
            // we use cleanPlan.length here as we want all hours to
            // be rendered in all days
            for (j = 0; j < cleanPlan.length; j++) {
                td = tr.insertCell(-1);
                if (daysInHours[i][j]) {
                    td.appendChild(document.createTextNode(daysInHours[i][j]));
                }
            }
        }
        // create table header
        var thead = table.createTHead();
        tr = thead.insertRow();
        var th_empty = document.createElement('th');
        tr.appendChild(th_empty);
        var planDayNumber, weekDayNumber;
        for (i = 1; i < numberOfDays + 1; i++) {
            // add th only if week isn't empty
            // 0 - Monday, 6 - Sunday
            planDayNumber = i - 1;
            // 0 - Sunday, 6 - Saturday
            weekDayNumber = i % 7;
            if (plan.week[planDayNumber].length > 0) {
                th = document.createElement('th');
                th.appendChild(document.createTextNode(app.dayOfWeek.value[weekDayNumber]));
                tr.appendChild(th);
            }
        }
        card.appendChild(table);
        
        // select the active tab
        if (plan.active || !app.selectedTab) {
            selectTab(tab);
        }
    },

    removeUI: function(hashtag) {
        // delete card and tab
        var card = document.getElementById(hashtag);
        if (card) {
            card.remove();
        }
        var tab = document.getElementById('tab-' + hashtag);
        if (tab) {
            if (app.selectedTab == tab) {
                app.selectedTab = null;
            }
            tab.remove();
        }
    },

    /*
     * loadPlan:
     * load a plan identified by a hashtag
     * on success draw the UI
     */
    loadPlan: function(hashtag) {
        if (!hashtag) {
            return;
        }
        var request = new XMLHttpRequest({
            mozAnon: true,
            mozSystem: true});
        request.onload = function() {
            if (this.status !== 200) {
                console.log('DEBUG: Failed to get ``' 
                            + app.plansURL + '/plan/' + hashtag, this.status);
                window.alert('ERROR: ' + this.responseText);
                app.removeUI(hashtag);
                return;
            }
            var plan;
            try {
                planString = this.responseText;
                plan = JSON.parse(planString);
            } catch(e) {
                console.log('DEBUG: Unable to parse the JSON file');
                window.alert('ERROR: Unable to parse the JSON file');
                app.removeUI(hashtag);
                return;
            }
            // store plan in localStorage
            localStorage.setItem(hashtag, planString);
            app.drawUI(plan, hashtag);
        };
        request.onerror = function(error) {
            console.log('DEBUG: Failed to get ``' 
                        + app.plansURL + '/plan/' + hashtag, error);
            window.alert('ERROR: Failed to get ' + app.plansURL + '/plan/' + hashtag);
            app.removeUI(hashtag);
        };
        request.open("get", app.plansURL + '/plan/' + hashtag, true);
        request.send();
    },

    /*
     * reloadPlans:
     * get list of the plans for given URL (stored in plansURL)
     */
    reloadPlans: function() {
        var i;
        for (i = 0; i < app.oldHashtags.length; i++) {
            localStorage.removeItem(app.oldHashtags[i]);
            app.removeUI(app.oldHashtags[i]);
        }
        if (!app.isConfigured()) {
            // do not try to load plans if not configured
            return;
        }
        for (i = 0; i < app.hashtags.length; i++) {
            app.oldHashtags[i] = app.hashtags[i];
            // get each plan at a time
            // WARNING: order of the plans is a subject of race condition
            app.loadPlan(app.hashtags[i]);
        }
        app.flipbox.toggle();
    },

    setup: function() {
        app.flipbox = document.querySelector('brick-flipbox');
        var settingsButton = document.getElementById('settings-button');
        var settingsOffButton = document.getElementById('settings-off-button');
        settingsButton.addEventListener('click', app.toggleSettings);
        settingsOffButton.addEventListener('click', app.toggleSettings);

        var reloadButton = document.getElementById('reload-button');
        reloadButton.addEventListener('touchstart', app.reloadPlans, false);

        // server value
        var serverInput = document.getElementById('server-input');
        // check if already set
        app.plansURL = localStorage.getItem('plansURL');
        if (app.plansURL) {
            serverInput.value = app.plansURL;    
        }
        // setting server from input
        serverInput.addEventListener('blur', function() {
            app.plansURL = serverInput.value;
            localStorage.setItem('plansURL', app.plansURL);
        });

        // read hashtags from localStorage
        var hashtagsString = localStorage.getItem('hashtags') || '[]';
        var hashtagInput;
        app.hashtags = JSON.parse(hashtagsString);
        // set hashtags in the settings
        for (i = 0; i < app.hashtags.length; i++) {
            app.oldHashtags[i] = app.hashtags[i];
            hashtagInput = document.getElementById('input-plan-' + (i + 1));
            if (app.hashtags[i]) {
                hashtagInput.value = app.hashtags[i];
            }
        }
        // setting hashtags from input
        function setHashtags(evt) {
            if (evt.target.value) {
                app.hashtags[evt.target.hashtagIndex] = evt.target.value;
            } else {
                app.hashtags[evt.target.hashtagIndex] = null;
            }

            localStorage.setItem('hashtags', JSON.stringify(app.hashtags));
        }
        // XXX hardcoded maximum number of plans == 3
        for (i = 1; i < 4; i++) {
            hashtagInput = document.getElementById('input-plan-' + i);
            hashtagInput.addEventListener('blur', setHashtags);
            hashtagInput.hashtagIndex = i - 1;
        }
        // flip to settings if not configured yet
        if (!app.isConfigured()) {
            app.flipbox.toggle();
        }

    },

    toggleSettings: function() {
        app.flipbox.toggle();
    },

    isConfigured: function() {
        var isConfigured = false;
        if (app.plansURL && app.hashtags && app.hashtags.length > 0) {
            for (i = 0; i < app.hashtags.length; i++) {
                if (app.hashtags[i]) {
                    isConfigured = true;
                }
            }
        }

        return isConfigured;
    },

    onDeviceReady: function() {
        // SETTINGS
        var i;

        app.setup();

        // load plans from storage or server
        navigator.globalization.getDateNames(function(dayOfWeekResponded){
            app.dayOfWeek = dayOfWeekResponded;
            if (app.isConfigured()) {
                // load plans from storage
                for (var i=0; i < app.hashtags.length; i++) {
                    var planString = localStorage.getItem(app.hashtags[i]);
                    if (planString === null) {
                        // something went wrong - let's try to load
                        // plans from server
                        app.loadPlan(app.hashtags[i]);
                    } else {
                        var plan = JSON.parse(planString);
                        app.drawUI(plan, app.hashtags[i]);
                    }
                }
            }
        }, function() {}, {type: 'narrow', item: 'days'});

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
