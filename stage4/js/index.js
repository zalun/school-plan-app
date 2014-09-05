document.onElementReady = function onElementReady(el, callback) {
  if (el instanceof HTMLUnknownElement) {
    return setTimeout(onElementReady, 100, el, callback);
  }
  callback.call(el);
};
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
        // Switching from one tab to another is done automatically
        // We just need to link it backwards - change menu if slides
        // changed without touching the menu

        app.planGroupMenu = document.getElementById('plan-group-menu');
        // TODO: use the right hack
        // https://github.com/WebReflection/document-register-element/issues/5#issuecomment-52433355
        document.onElementReady(app.planGroupMenu, function() {
            for (var i=0; i < app.planGroupMenu.tabs.length; i++) {
                var tab = app.planGroupMenu.tabs[i];
                tab.targetElement.tabElement = tab;
                tab.targetElement.addEventListener('show', function() {
                    this.tabElement.select();
                });
            }
        });
        
        // Implementing one finger swipe to change deck card
        
        app.planGroup = document.getElementById('plan-group');
        // app.planGroup.loop = true;

        var startX = null;
        var slideThreshold = 100;
        function touchStart(sX) {
            startX = sX;
        }

        function touchEnd(endX) {
            if (startX) {
                var deltaX;
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
