# brick-flipbox

> A [Brick](https://github.com/mozilla/brick/) custom element.
> Flips between two content elements with a CSS Animation, similar to flipping a playing card.

## Demo

[Check it live!](http://mozbrick.github.io/brick-flipbox)

## Usage

1. Import Web Components polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="dist/brick-flipbox.html">
    ```

3. Start using it:

    ```html
    <brick-flipbox>
      <div>Front</div>
      <div>Back</div>
    </brick-flipbox>
    ```

## Options

Attribute    | Options    | Default     | Description
---          | ---        | ---         | ---
`flipped`    | *boolean*  | `false`     | True if the flipbox is flipped to the back.
`direction`  | *string*   | `right`     | The flip direction. Can be `left`, `right`, `up` and `down`.

## Methods

Method       | Parameters   | Returns     | Description
---          | ---          | ---         | ---
`toggle()`   | None.        | Nothing.    | Toggle the flipbox.
`showFront()`| None.        | Nothing.    | Show the front side.
`showBack()` | None.        | Nothing.    | Show the back side.

## Events

Event         | Description
---           | ---
`flipend`     | Triggers when the flipping is complete.

triggering `reveal` on one of the elements inside the flipbox, will reveal the corresponding side.

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
* Navigate to `http:localhost:3001`

To simply build and lint your code, run `gulp build`.

You can also push your code to GitHub Pages by running `gulp deploy`.
