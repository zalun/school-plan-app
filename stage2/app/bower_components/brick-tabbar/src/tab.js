(function () {

  function _onTapbarTabClick(tabEl) {
    if (tabEl.parentNode.nodeName.toLowerCase() === 'brick-tabbar') {
      var targetEvent = tabEl.targetEvent;
      var target = tabEl.targetElement;
      if (target) {
        target.dispatchEvent(new CustomEvent(targetEvent, {'bubbles': true}));
      }
    }
  }

  var BrickTabbarTabElementPrototype = Object.create(HTMLElement.prototype);

  BrickTabbarTabElementPrototype.attachedCallback = function() {
    this.addEventListener('click', function(e) {
      var tabEl = e.currentTarget;
      _onTapbarTabClick(tabEl);
    });
    this.addEventListener('select', function(e) {
      var tabEl = e.currentTarget;
      _onTapbarTabClick(tabEl);
    });
  };

  BrickTabbarTabElementPrototype.select = function() {
    this.dispatchEvent(new CustomEvent('select', {
      'bubbles': true
    }));
  };

  Object.defineProperties(BrickTabbarTabElementPrototype, {
    'target': {
      get: function() {
        return this.getAttribute('target');
      },
      set: function(newVal) {
        this.setAttribute('target', newVal);
      }
    },
    'targetEvent': {
      get: function() {
        if (this.hasAttribute('target-event')) {
          return this.getAttribute('target-event');
        } else if (this.parentNode.nodeName.toLowerCase() === 'brick-tabbar') {
          return this.parentNode.targetEvent;
        } else {
          throw 'tabbar-tab is missing event to fire';
        }
      },
      set: function(newVal) {
        this.setAttribute('target-event', newVal);
      }
    },
    'targetElement': {
      get: function() {
        return this.overrideElement ||  document.getElementById(this.target);
      },
      set: function(newVal) {
        this.overrideElement = newVal;
        this.removeAttribute('target');
      }
    }
  });

  if (!window.BrickTabbarTabElement) {
    window.BrickTabbarTabElement = document.registerElement('brick-tabbar-tab', {
      prototype: BrickTabbarTabElementPrototype
    });
  }

})();
