We will write an app from a simple HTML site.

## Story

I've got two kids and I'm always forgetting their school plan. Certainly I could copy the HTML to JSFiddle and load the plan as a website - https://hacks.mozilla.org/2013/08/using-jsfiddle-to-prototype-firefox-os-apps/ Unfortunately this will not load offline and (for now) will not work on iOS.

## Requirements

1. Display multiple school plans. 
2. Work offline
3. Platform agnostic

## Note

Please read https://github.com/zalun/school-plan-app/blob/master/README.md for instructions how to load any stage.

For detailed Cordova instructions please read  http://cordova.apache.org/docs/en/edge/index.html

## Stage 1

### Requirement

1. Display the school plans in plain HTML

### Realization

Start with plain Cordova project
    
    cordova create school-plan com.example.schoolplan SchoolPlan

Open ```index.html``` from ```school-plan``` directory and remove everything from ```<body>``` element.  Copy the desired school plan(s) into separate elemets. I've chosen ```<table>```.  Change styling in ```css/index.css```. There is no JavaScript used in this stage.

To test the app add a ```firefoxos``` platform and prepare the application. The last step is needed every time you want to check the changes.

    cordova platform add firefoxos
    cordova prepare

You may find the prepared app in ```school-plan/platforms/firefoxos/www```. Open the ```about:app-manager``` in Firefox browser. [Add Packaged App] and navigate to the prepared app directory. [Start Simulator] and you will see the app performing. You can inspect, debug and profile.

To export the app to Android add the platform and let Cordova build apk file

    cordova platform add android
    cordova platform build android

The file is in ```school-plan/platforms/android/ant-build/SchoolPlan-debug.apk```

## Stage 2

### Improvements

1. UX - display one school plan at a time

### Realization

Use Brick http://mozbrick.github.io/. Especially the ```brick-deck``` tag.  This will allow to display one ```brick-card``` while hiding other. Following command will install entire Brick into the ```app/bower_components``` directory.

    bower install mozbrick/brick 

The documentation http://mozbrick.github.io/docs/brick-deck.html provides the info how to switch the deck on. Be careful as it says to add ```src/brick-deck.html```, where in fact ```dist/brick-deck.html``` is needed. Following needs to be added to the ```<head>``` setcion in ```index.html``` file:

```html
	<script src="app/bower_components/brick/dist/platform/platform.js"></script>
	<link rel="import" href="app/bower_components/brick-deck/dist/brick-deck.html">
```

All plans need to be wrapped inside ```<brick-deck>``` and every plan inside ```<brick-card>```.

To make it visible there is a need to set the height of ```html``` and ```body``` elements. Certainly the place to set this parameter is the ```css/index.css``` file.

```css
    html, body {height: 100%}
```

If you'd test the application the first card should be visible while the other remain hidden.  Because we need to switch the cards JavaScript will be added to the app.

```html
	<script type="text/javascript" src="cordova.js"></script>
	<script type="text/javascript" src="js/index.js"></script>
```

```index.js``` has a definition of an ```app``` variable. App is running after calling ```app.initialize()```. It's a good idea to call this when ```window``` is loaded:

```js
    window.onload = function() { 
        app.initialize(); 
    }
```

Cordova adds few events. One of which being the ```deviceready``` fired after all Cordova is loaded and initiated. Let's put action code inside this event's callback - ```app.onDeviceReady```.

Brick adds a few functions and attributes to all its elements. In this case ```loop``` and ```nextCard``` is added to deck element. As it is here created with ```<brick-deck id="plan-group">``` tag, the appropriate way to get this element from the DOM is ```document.getElementById```. We want the cards will switch on ```touchstart``` event, ```nextCard``` will be called from the callback ```app.nextPlan```. 

## Stage 3

### Improvement

1. Add a menu bar with the name of currently displayed plan

### Realization

Use Brick's ```brick-tabbar```. http://mozbrick.github.io/docs/brick-tabbar.html

To do so you need to import the ```brick-tabbar``` component. Brick part of the ```<head>``` will look as follows:

```html
	<script src="app/bower_components/brick/dist/platform/platform.js"></script>
	<link rel="import" href="app/bower_components/brick-deck/dist/brick-deck.html">
	<link rel="import" href="app/bower_components/brick-tabbar/dist/brick-tabbar.html">
```

Add an id to all cards and mention it as target attribute of ```brick-tabbar-tab``` tag.

```html
	<brick-tabbar id="plan-group-menu" selected-index="0">
		<brick-tabbar-tab target="tosia">Tosia</brick-tabbar-tab>
		<brick-tabbar-tab target="magda">Magda</brick-tabbar-tab>
	</brick-tabbar>
	<brick-deck id="plan-group" selected-index="0">
	  <brick-card selected id="tosia">
      ...
```

The app got simplier. No JavaScript is needed. ```nextCard``` is called by Brick behind the scene using tab's ```reveal``` event. The cards will change when tabbar element is touched.

## Stage 4

### Improvement

1. Slide left/right to navigate betweeen cards

### Realization

Javascript needs to be used again.

```html
	<script type="text/javascript" src="cordova.js"></script>
	<script type="text/javascript" src="js/index.js"></script>
```

Switching ```deck``` ```card``` is done by ```tabbar``` component. To keep ```tabbar``` in sync with current ```card``` you need to link them. It is done by listening to the ```show``` event of each ```card```.

```js
	tab.targetElement.addEventListener('show', function() {
		this.tabElement.select();
	});
```

Because of the race condition (```planGroupMenu.tabs``` might not exist when app is initialized) polling is used to wait until the right moment.

```js
	function assignTabs() {
		if (!app.planGroupMenu.tabs) {
			return window.setTimeout(assignTabs, 100);
        } 
        // proceed
```

Detecting one finger swipe is pretty easy for Firefox OS. Two callbacks to to listen to the ```touchstart``` and ```touchend``` events and calculating the delta on the ```pageX``` parameter. Unfortunately Android and iOS do not fire the ```touchend``` event if finger has moved. The obvious move would be to listen to ```touchmove``` event, but that one is fired only once as it's intercepted by ```scroll``` event. Hence ```preventDefault()``` is called in ```touchmove``` callback. That way ```scroll``` is switched off.

```js
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
			touchStart(touches[0].pageX);
		}
	});

	app.planGroup.addEventListener('touchmove', function(evt) {
		evt.preventDefault(); 
		touchEnd(evt.changedTouches[0].pageX);
	});
```

As for the moment displaying the plans is done - you may add more of the plans as long as it fits on the screen. There will be no need to change JavaScript.
