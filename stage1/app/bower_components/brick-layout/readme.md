# brick-layout

> A [Brick](https://github.com/mozbrick/brick/) layout component.

## Demo

[Check it live!](http://mozbrick.github.io/brick-layout)

## Usage

1. Import Web Components polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="dist/brick-layout.html">
    ```

3. Start using it:

    ```html
    <brick-layout></brick-layout>
    ```

    See [Examples](#examples) for detailed examples.

## Options

### Attributes on &lt;brick-layout&gt;

Attribute           | Type        | Description
---                 | ---         | ---
`horizontal`        | *boolean*   | Use a horizontal layout instead of the default vertical layout.
`open`              | *boolean*   | Open child drawer elements.

### Attributes on direct child-elements

Attribute     | Type        | Description
---           | ---         | ---
`flex`        | *boolean*   | Set `flex: 1` for this element.
`drawer`      | *boolean*   | Use this element as a drawer. Drawers can he hidden and shown by setting the `show` attribute on the parent `<brick-layout>`.


### Attributes on descendent elements
Attribute        | Type        | Description
---              | ---         | ---
`hide`           | *boolean*   | Hide this element.

### Attributes and page widths

All mentioned attributes except `open` can be set to only apply on certain page widths:

Attribute         | < 768px (xs) | ≥ 768px (s) | ≥ 992px (m)  | ≥ 1200px (l)
---               | ---          | ---         | ---          | ---
`attribute`       | **yes**      | **yes**     | **yes**      | **yes**
`attribute-xs`    | **yes**      | no          | no           | no
`attribute-s`     | no           | **yes**     | no           | no
`attribute-m`     | no           | no          | **yes**      | no
`attribute-l`     | no           | no          | no           | **yes**
`attribute-lt-s`  | **yes**      | no          | no           | no
`attribute-lt-m`  | **yes**      | **yes**     | no           | no
`attribute-lt-l`  | **yes**      | **yes**     | **yes**      | no
`attribute-gt-xs` | no           | **yes**     | **yes**      | **yes**
`attribute-gt-s`  | no           | no          | **yes**      | **yes**
`attribute-gt-m`  | no           | no          | no           | **yes**

Example:

The attribute `hide-gt-xs` hides an element when the page-width is greater than 768px.

## Methods

Method          | Description
---             | ---
`toggleDrawer()`| Toggle the drawer state.
`openDrawer()`  | Open the drawer.
`closeDrawer()` | Close the drawer.

## Examples

### Basic Examples

#### Simple

##### Description

* Headerbar on the top of the page.
* Below the Header:
  * Menu on the left side, taking up as much space as the menu items need.
  * Content taking up the rest of the space.

[Demo](http://mozbrick.github.io/examples/brick-layout/simple.html)

##### Code

We start with the outmost `brick-layout` to split the page vertically into the Header and the rest below it. We insert a `header` and a `div`.
To make the header take up as much space as it needs and the rest below we put the attribute `flex` on the div below the `header`.

```html
<brick-layout>
  <header>
    Brick-Layout Basic Examples: Simple
  </header>
  <div flex>
    <!-- menu and content will go here -->
  </div>
</brick-layout>
```

To add the menu and the content horizontally positioned next to each other, we replace the `div` with another `brick-layout` this time with the attribute `horizontal`. Inside we add a `div` for the menu and one for the content. We also add the attribute `flex` to the content-div.

```html
<brick-layout>
  <header>
    Brick-Layout Basic Examples: Simple
  </header>
  <brick-layout horizontal flex>
    <div id="menu">
      <ul>
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
        <li>Menu Item 3</li>
      </ul>
    </div>
    <div id="content" flex>
      Content goes here.
    </div>
  </brick-layout>
</brick-layout>
```

To make it all work we need some css. We do not want to have a `padding` and `margin` outside of our layout and we want our layout to be able fill the whole page, so we add the following css to the html and body.

```css
html, body {
  padding: 0;
  margin: 0;
  height: 100%;
}
```

To visualize the layout we add some borders:

```css
header {
  border-bottom: 1px solid #ccc;
}
#menu {
  border-right: 1px solid #ccc;
}
```

#### Columns

##### Description

* Split the page equally into 4 columns

[Demo](http://mozbrick.github.io/examples/brick-layout/columns.html)

##### Code

```html
<brick-layout horizontal>
  <div class="column" flex>1</div>
  <div class="column" flex>2</div>
  <div class="column" flex>3</div>
  <div class="column" flex>4</div>
</brick-layout>
```

```css
html, body {
  padding: 0;
  margin: 0;
  height: 100%;
}
.column {
  border-left: 1px solid #ccc;
  text-align: center;
}
.columns:first-of-type {
  border: none;
}
```

### Responsive Examples

#### Drawer

##### Description

* Headerbar on the top of the page.
* Below the Header:
  * Menu on the left side, turns into a drawer when the page-width is below 768px.
  * Menu-Button to control the Menu when the page-width is below 768px.
  * Content taking up the rest of the space.

[Demo](http://mozbrick.github.io/examples/brick-layout/drawer.html)

##### Code

```html
<brick-layout>
  <header>
    <brick-action target="main" action="toggleDrawer">
      <button hide-gt-xs>M</button>
    </brick-action>
    Brick Layout Example: Simple responsive Drawer
  </header>
  <brick-layout horizontal id="main" flex>
    <brick-menu id="menu" drawer-lt-s>
      <brick-menu-item selected>Menu Item 1</brick-menu-item>
      <brick-menu-item>Menu Item 2</brick-menu-item>
      <brick-menu-item>Menu Item 3</brick-menu-item>
    </brick-menu>
    <div id="article" flex>
      article
    </div>
  </brick-layout>
</brick-layout>
```

```css
html, body {
  padding: 0;
  margin: 0;
  height: 100%;
}
#header {
  border-bottom: 1px solid #ccc;
  padding: 12px 9px 9px 9px;
}
#menu {
  border-right: 1px solid #ccc;
  padding: 9px;
  background: white;
}
#menu brick-menu-item {
  padding: 3px 0;
}
#menu brick-menu-item[selected] {
  font-weight: bold;
}
#article {
  padding: 9px;
}
```

#### Tabs

* Headerbar on the top of the page.
* Below the Header:
  * Menu on the left side, turns into a tabbar at the bottom of the page when the page-width is below 768px.
  * Content taking up the rest of the space.

##### Description

[Demo](http://mozbrick.github.io/examples/brick-layout/tabs.html)

##### Code

```html
<brick-layout>
  <header>
    Brick Layout Example: Responsive Tabs
  </header>
  <brick-layout horizontal-gt-xs flex>
    <brick-menu id="menu" horizontal-lt-s>
      <brick-action selected target="card1" action="reveal">
        Menu Item 1
      </brick-action>
      <brick-action target="card2" action="reveal">
        Menu Item 2
      </brick-action>
      <brick-action target="card3" action="reveal">
        Menu Item 3
      </brick-action>
    </brick-menu>
    <brick-deck id="content" flex selected-index="0">
      <brick-card id="card1" selected>1</brick-card>
      <brick-card id="card2">2</brick-card>
      <brick-card id="card3">3</brick-card>
    </brick-deck>
  </brick-layout>
</brick-layout>
```

```css
html, body {
  padding: 0;
  margin: 0;
  height: 100%;
  box-sizing: border-box;
}
#header {
  border-bottom: 1px solid #ccc;
  padding: 12px 9px 9px 9px;
}
#menu {
  border-right: 1px solid #ccc;
  background: white;
}
#menu > * {
  padding: 9px;
  width: 100%;
}
#menu [selected] {
  font-weight: bold;
}
brick-card {
  padding: 9px;
  font-size: 6em;
  text-align: center;
}
@media (max-width: 768px) {
  #content {
    order: 1;
  }
  #menu {
    border: none;
    border-top: 1px solid #ccc;
    order: 2;
  }
  #menu > * {
    border-left: 1px solid #ccc;
  }
  #menu > *:first-child {
    border-left: none;
  }
}
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
