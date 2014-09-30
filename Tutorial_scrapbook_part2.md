# Make a simple app work for others too.

This is a continuation of a previous tutorial. 

## Story

I've got two kids with a different school plans. We're using iOS and Android devices to follow them. Others have seen the benefits and would like to have such apps as well.

## Target

A mobile application which will:

(*Copied from previous chapter*)

1. Display school plan(s). 
2. Work offline
3. Work on many platforms

(*New goal*)

4. Download school plans from a server

## Prerequisites

* Creating apps using Cordova.
* Mozilla Brick

> Please read <A href="https://github.com/zalun/school-plan-app/blob/master/README.md">instructions</a> how to load any stage in this tutorial.

## Preparation

I assume Cordova and Bower are installed and working

## Stage 5

> I call it a stage 5 because it really is a continuation.

### Improvements

* Modify the school plan app to work with data instead of the plain HTML

### Realization

Remove old data from ```www/index.html``` leaving only the minimal structure. Certainly this also could be created using JavaScript, but I think it's better to have some HTML.

```html
<brick-tabbar id="plan-group-menu">
</brick-tabbar>
<brick-deck id="plan-group">
</brick-deck>
```

To prepare for data being pulled from another system there is a need to have a way to read them. Most common data structure used in JavaScript project is JSON.

For now it's OK to distribute the school plan together with the app, It's gonna be much easier to modify it for others as well, as editing data file is simple.

I've placed the data in ```www/data/plans.json``` file. It contains an ```Array``` of plans. Plan is an ```Object``` containing ```title```, ```id``` optional ```active``` field and ```weeek```, an actual plan which is an ```Array``` of ```String```s. 

```js
[
    {
      "title": "Name of the plan",
      "id": "id-of-the-plan",
      "active": 1,  // should the plan be the active one?
      "week": [
        [
          "first hour",
          "second hour",
          "third",
		  // ... and so on
        [],  // no activities on Wednesday
        ], [
          "",
          "",
          "starting on third",
          "fourth"
        ]
    }
]
```


Now there is a need to read this JSON file from the app's directory. 

> Previously I planned to use Cordova's <a href="http://plugins.cordova.io/#/package/org.apache.cordova.file">FileSystem plugin</a>, but it only made the code more complicated.

As both cards and tabs do not exist at the moment of loading the JavaScript file I've removed from ```www/js/index.js``` part where these were linked together.

I'm using a standard ```XMLHttpRequest```

```js     
var request = new XMLHttpRequest();
request.onload = app.renderData;
request.open("get", "app_data/plans.json", true);
request.send();
```

Where ```app.renderData``` parses the JSON and sends data to ```app.createUI``` so UI will be created on its basis.

```js
renderData: function() {
    var plans = [];
    try {
        plans = JSON.parse(this.responseText);
    } catch(e) {}
    app.createUI(plans);
},
```

To create the UI we will need weekday names. The best option is to use Cordova's <a href="https://github.com/apache/cordova-plugin-globalization/blob/master/doc/index.md">Globalization plugin</a>.

    cordova plugin add org.apache.cordova.globalization
    
Week days are retrieved using ```navigator.globalization.getDateNames```:
    
```js
createUI: function(plans) {
    var deck = document.getElementById('plan-group');
    var tabbar = document.getElementById('plan-group-menu');        
    navigator.globalization.getDateNames(function(dayOfWeek){
    // render UI
    }, function() {}, {type: 'narrow', item: 'days'});
```
If you'd like to use full day names, just change ```type: 'narrow'``` to ```type: 'wide'```.


Creating ```table``` and ```thead``` elements. (The empty ```th``` is needed for the numbers):

```js
for (var i = 0; i < plans.length; i++) {
    var plan = plans[i];
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var th_empty = document.createElement('th');
    thead.appendChild(th_empty);
    for (var j = 0; j < plan.week.length; j++) {
        if (plan.week[j]) {
            var th = document.createElement('th');
            th.appendChild(document.createTextNode(dayOfWeek.value[j]));
            thead.appendChild(th);
        }
    }
    table.appendChild(thead);
    // ...
```

Now we're reaching to an issue - we're representing the plan per day and then per hour. Unfortunately tables in HTML are created row by row which means the array needs to be rotated

```js
var daysInHours = [];
for (var j = 0; j < plan.week.length; j++) {
    for (var k = 0; k < plan.week[j].length; k++) {
        if (!daysInHours[k]) {
            daysInHours[k] = [];
        }
        daysInHours[k][j] = plan.week[j][k];
    }
}
```

Now daysInHours array can be easily used to render the plan into HTML table:

```js
for (var j = 0; j < daysInHours.length; j++) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    tr.appendChild(td);
    td.appendChild(document.createTextNode(j + 1));
    for (var k = 0; k < daysInHours[j].length; k++) {
        var td = document.createElement('td');
        if (daysInHours[j][k]) {
            td.appendChild(document.createTextNode(daysInHours[j][k]));
        }
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
}
```

At the end the table needs to placed inside ```brick-card``` element:

```js
var card = document.createElement('brick-card');
card.setAttribute('id', plan.id);
card.appendChild(table);
deck.appendChild(card); 
```

```brick-tabbar-tab``` has to display the names of the plans:

```js
var tab = document.createElement('brick-tabbar-tab');
tab.setAttribute('target', plan.id);
tab.appendChild(document.createTextNode(plan.title));
tabbar.appendChild(tab);
```

The right tab needs to be selected:

```js
if (plan.active) {
    var activeTab = tab;
    window.setTimeout(function() {activeTab.select()}, 0);
}
```

And lastly - switching cards needs to link back to the right tabs:

```js
card.tabElement = tab;
card.addEventListener('show', function() {
    this.tabElement.select();
});
```

The result is almost the same as from Stage4. The only difference being short weekday names.

![Stage5 Result Screenshot
](./images/stage5-result.gif)

