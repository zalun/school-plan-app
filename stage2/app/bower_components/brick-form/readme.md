# brick-form

> A [Brick](https://github.com/mozbrick/brick/) form component which uses a brick-storage component to store its content.

## Demo

[Check it live!](http://mozbrick.github.io/brick-form)

## Usage

1. Import Web Components polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="src/brick-form.html">
    ```

3. Start using it:

    ```html
    <brick-storage-indexeddb id="store" key="group"></brick-store-indexeddb>
    <brick-form storage="store" name="a">... inputs ...</brick-form>
    ```

## Options

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`name`        | *string*    |              | The name of the form. Will be used  to identify the forms data in the datastore. Has to be set.
`storage`     | *string*    |              | The id of the storage component to save the form data to.
`autosave`    | *boolean*   |              | Automatically save data on change events, instead of just on submit events.

## Methods

Method            | Parameters   | Returns     | Description
---               | ---          | ---         | ---
`loadFormData()`  | -            | -           | Load the data from the storage component.
`saveFormData()`  | -            | -           | Save the data from the storage component.

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
