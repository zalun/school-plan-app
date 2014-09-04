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
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        var startX = null;
        var slideThreshold = 100;
        app.planGroup = document.getElementById('plan-group');
        app.planGroup.loop = true;
        app.planGroup.addEventListener('touchstart', function(evt) {
            var touches = evt.changedTouches;
            if (touches.length == 1) {
                startX = touches[0].pageX;
            }
        });
        app.planGroup.addEventListener('touchend', function(evt) {
            var endX;
            var moveX;
            if (startX) {
                endX = evt.changedTouches[0].pageX;
                moveX = endX - startX;
                if (Math.abs(moveX) > slideThreshold) {
                    if (moveX > 0) {
                        app.nextPlan();
                    } else {
                        app.previousPlan();
                    }
                }
            }
            startX = null;
        });
    },
    previousPlan: function() {
        console.log('previous');
        app.planGroup.previousCard();
    },
    nextPlan: function() {
        console.log('next');
        app.planGroup.nextCard();
    }
}

window.onload = function() {
  app.initialize();
}
