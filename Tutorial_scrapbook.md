We will write an app from a simple HTML site.

## Story

I've got two kids and I'm always forgetting their school plan. Certainly I could
copy the HTML to JSFiddle and load the plan as a website - 
https://hacks.mozilla.org/2013/08/using-jsfiddle-to-prototype-firefox-os-apps/ 
Unfortunately this will not load offline and (for now) will not work on iOS.

## Requirements

1. Display multiple school plans. 
2. Work offline
3. Platform agnostic

## Note

Please read https://github.com/zalun/school-plan-app/blob/master/README.md
for instructions how to load any stage.

For detailed Cordova instructions please read  http://cordova.apache.org/docs/en/edge/index.html

## Stage1

Start with plain Cordova project
    
    cordova create school-plan com.example.schoolplan SchoolPlan

Open ```index.html``` and remove everything from ```<body>``` element.
