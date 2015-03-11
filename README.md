School Plan app
===============

Stage by stage - creating a school plan app

Defining a problem
------------------

Ability to check the school plan of kids even when offline.

Solution
--------

An app able to display a table with the school plan


To see the Stage[X]
-------------------

Clone the repository

    git clone git@github.com:zalun/school-plan-app.git

Create a cordova app

    cd school-plan-app
	cordova create school-plan com.mozilla-cordova.schoolplan SchoolPlan 

Remove the ``www`` directory and replace it with ``stage[X]``

    cd school-plan
    rm -rf www
    ln -fs ../stage[x] www

Add a platform

    cordova platform add [firefoxos/ios/android/...]

Application will be exported into ```school-plan/platforms/[platform_name]/www/```

Since app is using Brick please test it on an emulator or machine. It will work in the browser only if served from a server.

One can find more information about working with cordova project at 
http://cordova.apache.org/docs/en/edge/index.html
