// User type
function User(userid) {
    this.id = userid;
    this.plans = [];
}

User.prototype.getPlans = function() {
    var self = this;
    var request = new XMLHttpRequest({
        mozAnon: true,
        mozSystem: true});
    request.onload = function() {
        var plans = JSON.parse(this.responseText);
        for (var i = 0; i < plans.length; i++) {
            self.plans.push(new Plan(plans[i]));
        }
        self.displayPlans();
    };
    request.onerror = function(error) {
        console.log('DEBUG: Failed to get plans from ``' + app.getPlansURL + '``', error);
    };
    request.open("get", app.getPlansURL + this.id, true);
    request.send();
};

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
}

var app = {
    plans: [],
    planGroup: null,
    getPlansURL: "http://127.0.0.1:8080/plans/",
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.user = new User('johndoe');
        app.user.getPlans();
        app.user.displayPlans();

        app.activateFingerSwipe();
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
