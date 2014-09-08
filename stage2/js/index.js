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
        app.planGroup = document.getElementById('plan-group');
        app.planGroup.loop = true;
        app.planGroup.addEventListener('touchstart', app.nextPlan);
    },
    nextPlan: function() {
        app.planGroup.nextCard();
    }
}

window.onload = function() {
  app.initialize();
}
