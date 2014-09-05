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
        // var logElement = document.getElementById('debug');
        // function log(message) {
        //     logElement.appendChild(document.createTextNode(message));
        // }

        // Switching from one tab to another is done automatically
        // We just need to link it backwards - change menu if slides
        // changed without touching the menu

        app.planGroupMenu = document.getElementById('plan-group-menu');
        console.log(app.planGroupMenu);
        for (var i=0; i < app.planGroupMenu.tabs.length; i++) {
            var tab = app.planGroupMenu.tabs[i];
            tab.target.addEventListener('show', function() {
                tab.select();
            });
        }
        

        // Implementing one finger swipe to change deck card
        
        app.planGroup = document.getElementById('plan-group');
        app.planGroup.loop = true;

        var startX = null;
        var slideThreshold = 100;
        function touchStart(sX) {
            startX = sX;
        }

        function touchEnd(endX) {
            var deltaX;
            deltaX = endX - startX;
            if (Math.abs(deltaX) > slideThreshold) {
                if (deltaX > 0) {
                    app.nextPlan();
                } else {
                    app.previousPlan();
                }
                startX = endX;
            }
        }

        app.planGroup.addEventListener('touchstart', function(evt) {
          console.log('touchstart');
            var touches = evt.changedTouches;
            if (touches.length == 1) {
                touchStart(touches[0].pageX);
            }
        });

        app.planGroup.addEventListener('touchmove', function(evt) {
          console.log('touchmove');
            // switched off scrolling on webkit
            evt.preventDefault(); 
            touchEnd(evt.changedTouches[0].pageX);
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
