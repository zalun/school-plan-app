# brick-tabbar

> A [Brick](https://github.com/mozilla/brick/) tabbar component.

## Demo

[Check it live!](http://mozbrick.github.io/brick-tabbar)

## Usage

1. Import Web Components polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="dist/brick-tabbar.html">
    ```

3. Start using it:

    ```html
    <brick-tabbar>
      <brick-tabbar-tab>1</brick-tabbar-tab>
      <brick-tabbar-tab>2</brick-tabbar-tab>
      <brick-tabbar-tab>3</brick-tabbar-tab>
    </brick-tabbar>
    ```

## brick-tabbar details

### Attributes

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`target-event`| *string*    | `reveal`     | The event that a tab fires on its target element when the tab is clicked.

### Accessors

Property            | Type        | Default      | Description
---                 | ---         | ---          | ---
`target-event`      | *string*    | `reveal`     | Corresponds to the `target-event` attribute.
`tabs` (getter only)| *array*     | -            | Returns a list of the `<brick-tabbar-tab>` elements in the `<brick-tabbar>`.

## brick-tabbar-tab details

### Attributes

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`target-event`| *string*    | -            | The event that a tab fires on its target element when the tab is clicked. If not specified a tab takes the event specified on the parent brick-tabbar.
`target`      | *string*    | -            | The id of the target element of this particular tab.

### Accessors

Property       | Type        | Default      | Description
---            | ---         | ---          | ---
`target-event` | *string*    | `reveal`     | Corresponds to the `target-event` attribute.
`target`       | *string*    | -            | Corresponds to the `target` attrubute.
`targetElement`| *node*      |              | getter: Returns the element targeted by the specific tab. setter: Assigns the tab's targeted element. (If target is assigned using this dynamic assignment, the target-selector attribute is removed.)

### Methods

Method        | Parameters   | Returns     | Description
---           | ---          | ---         | ---
`select()`    | -            | -           | Select the tab.

### Events

Event         | Description
---           | ---
`reveal`      | Whenever a brick-tabbar-tab is clicked, and `target-event` is not otherwise specified, a `reveal` event is fired on each of its target elements. It is up to the target element to respond to this event. Some Brick Elements have default responses to the `reveal`.
`select`      | The select event is fired when the tab is explicitly selected, using its `select` method.

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
