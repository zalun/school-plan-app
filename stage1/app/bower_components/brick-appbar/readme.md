# brick-appbar

> A [Brick](https://github.com/mozbrick/brick/) component providing a header bar.

## Demo

[Check it live!](http://mozbrick.github.io/brick-appbar)

## Usage

1. Import Web Components polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="dist/brick-appbar.html">
    ```

3. Start using it:

    You can use any elements in place of the `<button>` tags in the example below. A heading `<h1>` to `<h6>` can be used instead of the `<h2>`.

    ```html
    <brick-appbar>
      <button>=</button>
      <h2>Email</h2>
      <button>+</button>
      <button>?</button>
    </brick-appbar>
    ```

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
