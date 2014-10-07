# Creating a mobile app from a simple HTML site
This article is a simple tutorial designed to teach you some fundamental skills for creating cross platform web applications. You will build a sample School Plan app, which will provide a dynamic "app-like" experience across many different platforms and work offline. It will use Apache Cordova and Mozilla's Brick web components.

## The story behind the app

I've got two kids and I'm always forgetting their school plan, as are they. Certainly I could [copy the HTML to JSFiddle and load the plan as a Firefox app](https://hacks.mozilla.org/2013/08/using-jsfiddle-to-prototype-firefox-os-apps/) Unfortunately this would not load offline, and currently will not work on iOS. Instead I would like to create an app that could be used by everyone in our family, regardless of the device they choose to use.

## We will build

A mobile application which will:

1. Display school plan(s). 
2. Work offline
3. Work on many platforms

## Prerequisites

* You should understand the basics of HTML, CSS and JavaScript before getting started.
* Please also read the [instructions](https://github.com/zalun/school-plan-app/blob/master/README.md) on how to load any stage in this tutorial.
* The <a href="http://cordova.apache.org/docs/en/edge/index.html">Cordova documentation</a> would also be a good thing to read, although we'll explain the bits you need to know below.
* You could also read up on [Mozilla Brick](http://brick.mozilla.io/) to find out what they do.

## Preparation
Before building up the sample app, you need to prepare your environment.

###Installing Cordova

I've decided to use [Apache Cordova](http://cordova.apache.org/) for this project as it's currently the best free tool for delivering HTML apps to many different platforms. You can build up your app using web technologies and then get Cordova to automatically port the app over the different native platforms. Let's get it installed first.

1. First <a href="https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager">install NodeJS</a>: Cordova is a NodeJS package.
2. Next, install Cordova globally using the ```npm``` package manager. On my systems (Ubuntu or OSX), you may need to have root access:

    <pre>npm install -g cordova</pre>

3. Install the <a href="https://www.mozilla.org/en-US/firefox/new/">latest version of Firefox</a> (CHRIS - WHY IS THIS SO IMPORTANT?).

###Installing Brick

[Mozilla Brick](http://brick.mozilla.io/) is a tool built for app developers. It's a set of ready-to-use web components that allow you to build up and use common UI components very quickly.

1. To install Brick we will need to use the Bower package manager. Install this, again using ```npm```:

    npm install -g bower


2. You can install Brick for your current project using ```bower install mozbrick/brick```, but don't don't do this right now — you need to put this inside your project, not just anywhere.

##Getting the sample HTML

Now you should [download the school plan HTML]() (CHRIS - THIS LINK IS CURRENTLY EMPTY, AS I COULDN'T FIND THE SCHOOL PLAN HTML ANYWHERE. WHERE IS IT?) — copy this code to an HTML file and put it in a safe place for now.

## Stage 1: Setting up the basic HTML project
In this part of the tutorial we will set up the basic project, and display the school plans in plain HTML. See the [stage 1 code on Github](https://github.com/zalun/school-plan-app/tree/master/stage1) if you want to see what the code should look like at the end of this section. 

1. Start by setting up a plain Cordova project. On your command line, go to the directory in which you want to create your app project, and enter the following command:
    
    <pre>cordova create school-plan com.example.schoolplan SchoolPlan</pre>
This will create a ```school-plan``` directory containing some files.

2. Inside ```school-plan```, open ```www/index.html``` in your text editor and remove everything from inside the ```<body>``` element.

3. Copy the school plan HTML you saved earlier into separate elements. I've chosen ```<table>```.

4. Change the styling contained within ```css/index.css``` if you wish, to make the tables look how you want (CHRIS - THESE LAST TWO INSTRUCTIONS ARE A BIT VAGUE - YOU SHOULD PROVIDE EXACT HTML AND CSS LISTINGS FOR THE READER TO USE, SO THEY DON'T NEED TO THINK).

5. To test the app quickly and easily, add the ```firefoxos``` platform as a cordova target and prepare the application by entering the following two commands:<pre>cordova platform add firefoxos
cordova prepare</pre>
The last step is needed every time you want to check the changes.

6. Open the <a href="about:app-manager">App Manager</a> in the Firefox browser. (CHRIS - ANY REASON WHY YOU HAVEN'T TOLD THEM TO GET AURORA/NIGHTLY, AND USE WEBIDE?) Press the [Add Packaged App] button and navigate to the prepared firefoxos app directory, which should be available in ```school-plan/platforms/firefoxos/www```.

7. Press the [Start Simulator] button and you will see the app running in a Firefox OS simulator. You can inspect, debug and profile it using the App Manager — read [Using the App Manager](https://developer.mozilla.org/en/Firefox_OS/Using_the_App_Manager) for more details. ![App Manager buttons
](./images/app-manager-1.png)


8. Now let's export the app as a native Android APK so we can see it working on that platform. Add the platform and get Cordova to build the apk file, with the following two commands:<pre>cordova platform add android
cordova platform build android</pre>

9. The apk is build in ```school-plan/platforms/android/ant-build/SchoolPlan-debug.apk``` — test this by...(CHRIS - WHAT'S THE BEST WAY TO DO THIS?)


![Stage1 Result Screenshot
](./images/stage1-result.gif)

## Stage 2
In Stage 2 of our app implementation, we will look at using Brick to improve the user experience of our app. Instead of having to potentially scroll through a lot of lesson plans to find the one you want, we'll implement a Brick custom element that allows us to display different plans in the same place.

You can see the [finished Stage 2 code](https://github.com/zalun/school-plan-app/tree/master/stage2) on Github.

1. First, run the following command to install the entire Brick codebase into the ```app/bower_components``` directory.<pre>bower install mozbrick/brick</pre>

2. We will only be using the ```brick-deck``` component from Brick.  This provides a "deck of cards" type interface that displays one ```brick-card``` while hiding the others. To make use of it, add the following code to the ```<head>``` of  your ```index.html``` file, to import its HTML and JavaScript:

```
  <script src="app/bower_components/brick/dist/platform/platform.js"></script>
  <link rel="import" href="app/bower_components/brick-deck/dist/brick-deck.html"></pre>
```

3. Next, all the plans need to be wrapped inside a ```<brick-deck>``` custom element, and every individual plan should be wrapped inside a ```<brick-card>``` custom element — the structure should end up similar to this:

```
<brick-deck id="plan-group">
  <brick-card>
    <table>
      <!-- school plan 1 -->
    </table>
  </brick-card>
  <brick-card>
    <table>
      <!-- school plan 2 -->
    </table>
  </brick-card>
</brick-deck>
```

4. The ```brick-deck``` component requires that you set the height of the ```html``` and ```body``` elements to 100%. Add the following to the ```css/index.css``` file:

```
html, body {height: 100%}
```

5. When you run the application, the first card should be visible while the others remain hidden. To handle this we'll now add some JavaScript to the mix. First, add some ```<link>``` elements to link the necessary JavaScript files to the HTML: 

```
	<script type="text/javascript" src="cordova.js"></script>
	<script type="text/javascript" src="js/index.js"></script>
```

6. ```cordova.js``` contains useful general Cordova-specific helper functions, while index.js will contain our app's specific JavaScript. ```index.js``` already contains a definition of an ```app``` variable. The app is running after ```app.initialize()``` is called. It's a good idea to call this when ```window``` is loaded, so add the following:

```
    window.onload = function() { 
        app.initialize(); 
    }
```

7. Cordova adds few events; one of which — ```deviceready``` — is fired after all Cordova code is loaded and initiated. Let's put the main app action code inside this event's callback - ```app.onDeviceReady```. (CHRIS - SHOW THE EXACT CODE THAT NEEDS TO BE ADDED?)

8. Brick adds a few functions and attributes to all its elements. In this case ```loop``` and ```nextCard``` are added to the ```<brick-deck>``` element. As it includes an ```id="plan-group"``` attribute, the appropriate way to get this element from the DOM is ```document.getElementById```. We want the cards to switch when the ```touchstart``` event is fired; at this point ```nextCard``` will be called from the callback ```app.nextPlan```. (CHRIS - SO DOES ANY CODE NEED TO BE ADDED AT THIS POINT? YOU SEEM TO SAY A LOAD OF THINGS, BUT THEN DON'T GIVE A PARTICULAR INSTRUCTION.)

 
![Stage2 Result Animation
](./images/stage2-result.gif)

## Stage 3

In this section of the tutorial, we'll add a menu bar with the name of the currently displayed plan, to provide an exra usability enhancment. See the [finished Stage 3 code](https://github.com/zalun/school-plan-app/tree/master/stage3) on GitHub.


1. To implement the menu bar, we will use Brick's [```brick-tabbar```](http://brick.mozilla.io/v2.0/docs/brick-tabbar) component. We first need to import the component. Add the following lines to the ```<head>``` of your HTML:

```
	<script src="app/bower_components/brick/dist/platform/platform.js"></script>
	<link rel="import" href="app/bower_components/brick-deck/dist/brick-deck.html">
	<link rel="import" href="app/bower_components/brick-tabbar/dist/brick-tabbar.html">
```

2. Next, add an id to all the cards and include them as the values of target attributes on ```brick-tabbar-tab``` elements like so:

```
	<brick-tabbar id="plan-group-menu" selected-index="0">
		<brick-tabbar-tab target="tosia">Tosia</brick-tabbar-tab>
		<brick-tabbar-tab target="magda">Magda</brick-tabbar-tab>
	</brick-tabbar>
	<brick-deck id="plan-group" selected-index="0">
	  <brick-card selected id="tosia">
      ...
```

3. The app got simpler. No JavaScript is needed so you can safely remove it from the ```index.html``` (CHRIS - WHAT JAVASCRIPT EXACTLY? YOU MEAN THE LINK TO INDEX.JS?). Deck's ```nextCard``` method is called by Brick behind the scenes using tab's ```reveal``` event. The cards will change when the tabbar element is touched.


![Stage2 Result Animation
](./images/stage3-result.gif)

## Stage 4

To further improve the user experience on touch devices, we'll now add functionality to allow you to swipe left/right to navigate betweeen cards. See the [finished stage 4 code](https://github.com/zalun/school-plan-app/tree/master/stage4) on GitHub.

Javascript needs to be used again. (CHRIS - RATHER THAN ASKING THE READER TO ADD THESE IN AGAIN, WE SHOULDN'T ASK THEM TO REMOVE THE SCRIPT ELEMENTS EARLIER - INSTEAD, WE SHOULD ASK THEM TO REMOVE THE CODE INSIDE INDEX.JS THAT THEY DON'T NEED AFTER THE STAGE 3 ADDITIONS, AND THEN HERE WE CAN CUT OUT THIS FIRST STEP)

```
	<script type="text/javascript" src="cordova.js"></script>
	<script type="text/javascript" src="js/index.js"></script>
```

1. Switching cards is done by the ```tabbar``` component. To keep ```tabbar``` in sync with the current ```card``` you need to link them. This is done by listening to the ```show``` event of each ```card```. (CHRIS - WHERE DO WE ADD THIS?)

```
	tab.targetElement.addEventListener('show', function() {
		this.tabElement.select();
	});
```

2. Because of the race condition (```planGroupMenu.tabs``` might not exist when the app is initialized) [polling](http://en.wikipedia.org/wiki/Polling_%28computer_science%29) is used to wait until the right moment before trying to switch (CHRIS - AGAIN, SAY WHERE TO ADD THIS):

```
	function assignTabs() {
		if (!app.planGroupMenu.tabs) {
			return window.setTimeout(assignTabs, 100);
        } 
        // proceed
```

3. Detecting one finger swipe is pretty easy in a Firefox OS app. Two callbacks are needed to listen to the ```touchstart``` and ```touchend``` events and calculate the delta on the ```pageX``` parameter. Unfortunately Android and iOS do not fire the ```touchend``` event if the finger has moved. The obvious move would be to listen to the ```touchmove``` event, but that is fired only once as it's intercepted by the ```scroll``` event. The best way forward is to call ```preventDefault()``` in the ```touchmove``` callback. That way ```scroll``` is switched off, and the functionality can work as expected: (CHRIS - AGAIN, WHERE TO ADD THIS STUFF?)

```
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
		// do not listen if more than one finger touches the screen
		if (touches.length == 1) {
			touchStart(touches[0].pageX);
		}
	});

	app.planGroup.addEventListener('touchmove', function(evt) {
	    // stop scroll event intercepting touchmove
		evt.preventDefault(); 
		touchEnd(evt.changedTouches[0].pageX);
	});
```

You can add as many plans as you like — just make sure that their titles fit on the screen in the tabbar. Actions will be assigned automatically.

![Stage1 Result Screenshot
](./images/stage4-result.gif)