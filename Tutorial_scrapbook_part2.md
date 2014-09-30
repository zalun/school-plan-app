# Make a simple app work for others too.

This is a continuation of a previous tutorial. 

## Story

I've got two kids with a different school plans. We're using iOS and Android devices to follow them. Others have seen the benefits and would like to have such apps as well.

## Target

A mobile application which will:

1. Display school plan(s). 
2. Work offline
3. Work on many platforms
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

To prepare for data being pulled from another system there is a need to have a way to read them. Most common data structure used in JavaScript project is JSON.

For now it's OK to distribute the scholl plan together with the app, It's gonna be much easier to modify it for others as well, as editing data file is simple.

I've placed the data in ```data/plans.json``` file. The structure is based on Arrays as most of the data is enumerative.

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



The result is exctly the same as from Stage4

![Stage4 Result Screenshot
](./images/stage4-result.gif)

