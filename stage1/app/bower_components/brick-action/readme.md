# brick-action

> A [Brick](https://github.com/mozbrick/brick/) custom element to wire up events and methods on different elements.
It listens to an event on a source elemenet and then calls a method on a target element using event.detail as argument.

## Demo

[Check it live!](http://mozbrick.github.io/brick-action)

## Usage

1. Import Web Components polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="dist/brick-action.html">
    ```

3. Start using it:

    The following attribute values reflect an arbitrary example.

    ```html
    <brick-action src="menu-button"
              trigger="click"
               target="menu-drawer"
               action="reveal">
    </brick-action>
    ```

## Options

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`target`      | *string*    |              | ID of the target element.
`source`      | *string*    | the element itself | ID of the source element. If not provided, the `brick-action` element will listen to events on itself. So you can wrap the source element inside `brick-action`
`trigger`     | *string*    |              | Name of the event to listen for on the soure element.
`action`      | *string*    | `click`      | Name of the method to call on the target element.

## Development

Brick components use [Stylus](http://learnboost.github.com/stylus/) to generate their CSS.

This repository comes outfitted with a set of tools to ease the development process.

To get started:

* Install [Bower](http://bower.io/) & [Gulp](http://gulpjs.com/):

    ```sh
    $ npm install -g bower gulp
    ```

* Install local dependencies:

    ```sh
    $ npm install && bower install
    ```

While developing your component, there is a development server that will watch your files for changes and automatically re-build your styles and re-lint your code.

To run the development server:

* Run `gulp server`
* Navigate to `http://localhost:3001`

To simply build and lint your code, run `gulp build`.

You can also push your code to GitHub Pages by running `gulp deploy`.
