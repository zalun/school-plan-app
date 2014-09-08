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

Open ```index.html``` and remove everything from ```<body>``` element.  Copy the desired school plan(s) into separate elemets. I've chosen ```<table>```.  Change styling in ```css/index.css```. There is no JavaScript used in this stage.

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

All plans need to be wrapped inside ```<brick-deck>``` and every plan inside ```<brick-card>```.

To make it visible there is a need to set the height of ```html``` and ```body``` elements. Certainly the place to set this parameter is the ```css/index.css``` file.

    html, body {height: 100%}

If you'd test the application the first card should be visible while the other remain hidden.  Because we need to somehow switch the cards JavaScript will be added to the app.

	<script type="text/javascript" src="cordova.js"></script>
	<script type="text/javascript" src="js/index.js"></script>

```index.js``` has a definition of an ```app``` variable. App is running after calling ```app.initialize()```. It's a good idea to call this when ```window``` is loaded:

```js
    window.onload = function() { 
        app.initialize(); 
    }

## Stage 3

### Improvement

1. Add a bar with the name of currently displayed plan

### Realization

Use Brick's ```brick-tabbar```. 
