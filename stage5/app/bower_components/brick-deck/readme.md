# brick-deck

> A [Brick](https://github.com/mozbrick/brick/) box element in which cards can be cycled independently of order with a variety of different transitions.

## Demo

[Check it live!](http://mozbrick.github.io/brick-deck)

## Usage

1. Import Web Components polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="dist/brick-deck.html">
    ```

3. Start using it:

    ```html
    <brick-deck selected-index="0">
      <brick-card selected>0</brick-card>
      <brick-card>1</brick-card>
      <brick-card>2</brick-card>
      <brick-card>3</brick-card>
      <brick-card>4</brick-card>
    </brick-deck>
    ```

## Options
<table>
  <tr>
    <th>Attribute</th>
    <th>Options</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>transition-type</code></td>
    <td>
      <i>string</i>
      <ul>
        <li><code>slide-left</code></li>
        <li><code>slide-right</li>
        <li><code>slide-up</code></li>
        <li><code>slide-down</code></li>
      </ul>
    </td>
    <td>-</td>
    <td>
      Defines the type of animation to use for cycling between cards. 
      The default is no transition animation.
      <br>
      This property can either be set as an HTML attribute under the name <code>transition-type</code>,
      or programmatically with the property <code>transitionType</code> <code>selected-index</code>.
    </td>
  </tr>
  <tr>
    <td><code>selected-index</code></td>
    <td>
      <i>number</i>
    </td>
    <td>-</td>
    <td>
      Gets/sets the index of the currently selected card in the deck.
      <br>
      Can either be set as an HTML attribute under the name selected-index or programmatically with the property selectedIndex.
    </td>
  </tr>
  <tr>
    <td><code>loop</code></td>
    <td>
      <i>boolean</i>
    </td>
    <td>-</td>
    <td>
      Toggle allowance of looping when calling nextCard and previousCard methods has reached the end of either side of the index.    
    </td>
  </tr>
</table>

## Accessors

Poperty               | Type      | Description
---                   | ---       | ---
`transitionType`      | *string*  | corresponds to the `transition-type` attribute 
`selectedIndex`       | *string*  | corresponds to the `selected-index` attribute 
`loop`                | *boolean* | corresponds to the `loop` attribute 
`cards` (getter only) | *array*   | array of all the brick-card elements contained in an brick-deck
`selectedCard` (getter only) | *brick-card* | the brick-card DOM element that is currently displayed by the deck. Returns null if no such card exists.

## Methods

Method                                    | Returns     | Description
---                                       | ---         | ---
`showCard(index / element, [direction])`  | -           | Transitions to the brick-card at the given index within the deck. If given a direction of 'forward', will perform the forwards/normal version of the current transition animation. If given 'reverse', will performs the reverse animation. If the direction is omitted, the deck will perform a forward animation.
`hideCard(index / element)`               | -           | Hides the card element or card located at a specified index.
`nextCard([direction])`                   | -           | Transitions to the next card in the deck, looping back to the start if needed.
`previousCard([direction])`               | -           | Transitions to the previous card in the deck, looping back to the end if needed.

## Events

Event         | Description
---           | ---
`show`        | Fired from a card target after it has completed its show animation, and the show state has been finalized.
`hide`        | Fired from a card target after it has completed its hide animation, and the hide state has been finalized.

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
