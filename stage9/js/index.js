// User type
function User(userid) {
    this.id = userid;
    this.plans = [];
}

/* method: User::getPlans()
 * loads data assigned to user and calls User::displayPlans()
 */
User.prototype.getPlans = function(callback) {
    var self = this;
    var url = app.plansServer + '/plans/' + this.id;
    var request = new XMLHttpRequest({
        mozAnon: true,
        mozSystem: true});
    request.onload = function() {
        console.log('DEBUG: plans loaded from server');
        self.initiatePlans(this.responseText);
        localStorage.setItem('plans', this.responseText);
        self.displayPlans();
        if (callback) {
            callback();
        }
    };
    request.onerror = function(error) {
        console.log('DEBUG: Failed to get plans from ``' + url + '``', error);
    };
    request.open("get", url, true);
    request.send();
};

/* method: User::reloadPlans()
 * removes all existing plans UI and calls User::getPlans()
 */
User.prototype.reloadPlans = function() {
    // remove UI from plans
    for (var i = 0; i < this.plans.length; i++) {
        this.plans[i].removeUI();
    }
    // clean this.plans
    this.plans = [];
    // clean phone's storage
    localStorage.setItem('plans', '[]');
    // load plans from server
    this.getPlans(app.toggleSettings);
};

/* method: User::initiatePlans()
 * parses plans from JSON representation and initiates a new Plan for
 * each of them
 */
User.prototype.initiatePlans = function(plansString) {
    var plans = JSON.parse(plansString);
    for (var i = 0; i < plans.length; i++) {
        this.plans.push(new Plan(plans[i]));
    }
}

/* method: User::loadPlans()
 * loads plans from either localStorage or using User::getPlans
 */
User.prototype.loadPlans = function() {
    var plans = localStorage.getItem('plans');
    if (plans === null) {
        return this.getPlans();
    }
    console.log('DEBUG: plans loaded from device');
    this.initiatePlans(plans);
    this.displayPlans();
};

/* method: User::displayPlans()
 * loads local names of days and calls Plan::createUI for each plan
 */
User.prototype.displayPlans = function() {
    var self = this;
    navigator.globalization.getDateNames(function(dayOfWeek){
        var deck = document.getElementById('plan-group');
        var tabbar = document.getElementById('plan-group-menu');
        for (var i = 0; i < self.plans.length; i++) {
            self.plans[i].createUI(deck, tabbar, dayOfWeek);
        }
    }, function() {}, {type: 'narrow', item: 'days'});
};

// Plan type 
function Plan(plan) {
    this.schedule = plan.week;
    this.title = plan.title;
    this.id = plan.id;
    this.active = plan.active;
    this.tab = null;
    this.card = null;
    this.table = null;
};

/* method Plan::selectTab()
 * switches the active tab of <brick-tabbar>
 * uses polling as brick might not be fully loaded yet
 */
Plan.prototype.selectTab = function(deck) {
    var self = this;
    function selectActiveTab() {
        if (!self.tab.targetElement) {
            return window.setTimeout(selectActiveTab, 100);
        }
        deck.showCard(self.tab.targetElement);
    }
    selectActiveTab();
};

/* method Plan::createUI()
 * creates <brick-card> and <brick-tab> elements, then renders plan into
 * the <table> element
 */
Plan.prototype.createUI = function(deck, tabbar, dayOfWeek) {
    // create card
    this.card = document.createElement('brick-card');
    this.card.setAttribute('id', this.id);
    deck.appendChild(this.card);

    //create tab
    this.tab = document.createElement('brick-tabbar-tab');
    this.tab.setAttribute('target', this.id);
    this.tab.appendChild(document.createTextNode(this.title));
    tabbar.appendChild(this.tab);

    // link card and tab DOM Elements
    this.card.tabElement = this.tab;
    this.card.addEventListener('show', function() {
        this.tabElement.select();
    });

    // create plan table
    this.table = document.createElement('table');

    // hide not used days
    var numberOfDays = this.schedule.length;
    var cleanPlan = [];
    for (var j = 0; j < numberOfDays; j++) {
        if (this.schedule[j].length > 0) {
            cleanPlan.push(this.schedule[j]);
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
        var tr = this.table.insertRow(-1);
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
    var thead = this.table.createTHead();
    var tr = thead.insertRow();
    var th_empty = document.createElement('th');
    tr.appendChild(th_empty);
    var weekDayNumber;
    for (var j = 0; j < numberOfDays; j++) {
        var weekDayNumber = (j + 1) % 7;
        if (this.schedule[j].length > 0) {
            var th = document.createElement('th');
            th.appendChild(document.createTextNode(dayOfWeek.value[weekDayNumber]));
            tr.appendChild(th);
        }
    }
    this.card.appendChild(this.table);

    // select current plan if active
    if (this.active) {
        this.selectTab(deck);
    }
};

Plan.prototype.removeUI = function() {
    this.card.remove();
    this.tab.remove();
};

var app = {
    plans: [],
    planGroup: null,
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.plansServer = localStorage.getItem('plansServer');
        app.userID = localStorage.getItem('userID');
        app.activateFingerSwipe();
        app.assignButtons();

        console.log(app.userID);
        if (app.plansServer && app.userID) {
            app.user = new User(app.userID);
            app.user.loadPlans();
        } else {
            app.toggleSettings();
        }
    },

    activateFingerSwipe: function() {
        // Switching from one tab to another is done automatically
        // We just need to link it backwards - change menu if slides
        // changed without touching the menu
        app.planGroupMenu = document.getElementById('plan-group-menu');
        
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

    toggleSettings: function() {
        app.flipbox.toggle();
    },

    assignButtons: function(){
        app.flipbox = document.querySelector('brick-flipbox');
        var settingsButton = document.getElementById('settings-button');
        var settingsOffButton = document.getElementById('settings-off-button');
        settingsButton.addEventListener('click', app.toggleSettings);
        settingsOffButton.addEventListener('click', app.toggleSettings);

        var reloadButton = document.getElementById('reload-button');
        reloadButton.addEventListener('touchend', function() {
            app.user.reloadPlans();
        }, false);

        var serverInput = document.getElementById('input-server');
        if (app.plansServer) {
            serverInput.value = app.plansServer;    
        }
        serverInput.addEventListener('blur', function() {
            app.plansServer = serverInput.value || null;
            localStorage.setItem('plansServer', app.plansServer);
        });

        var userInput = document.getElementById('input-user');
        if (app.userID) {
            userInput.value = app.userID;    
        }
        userInput.addEventListener('blur', function() {
            app.userID = userInput.value || null;
            if (app.userID) {
                if (app.user) {
                    app.user.id = app.userID;
                } else {
                    app.user = new User(app.userID);
                }
                localStorage.setItem('userID', app.userID);
            }
        });

        document.getElementById('form-settings').addEventListener('submit', function(e) {
            e.preventDefault();
        }, false)
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

