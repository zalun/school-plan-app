# brick-storage-indexeddb

## Demo

[Check it live!](http://mozbrick.github.io/brick-storage-indexeddb)

## Usage

1. Import Web Components polyfill:

    ```html
    <script src="bower_components/platform/platform.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="src/brick-storage-indexeddb.html">
    ```

3. Start using it:

    ```html
    <brick-storage-indexeddb></brick-storage-indexeddb>
    ```

## Options

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`name`        | *string*    | `storage`    | The database name.
`keyname`         | *string*    | `id`         | The name of the unique primary key to use for get, set and remove operations. Defaults to an auto-incrementing `id`.
`indexname`       | *string*    |              | One or multiple indices which can be used to order and  the results of queries which return multiple items.

## Methods

Method            | Returns a promise for  | Description
---               | ---                    | ---
`insert(object)`  | key of the saved object| Insert an object.
`set(object)`     | key of the saved object| Insert/upate an object.
`setMany(objects)`| -                      | Insert/upate multiple objects.
`get(key)`        | object                 | Retrieves the object with the key.
`remove(key)`     | undefined              | Deletes the object with the key.
`getMany(options)`| array multiple objects | Retrieves multiple stored objects. If no filtering options are provided, it returns all objects.<ul><li>`options.start` - The first key of the results.</li><li>`options.end` - The last key of the results.</li><li>`options.count` - The number of results.</li><li>`options.offset` - The offset of the first result when set to true.</li><li>`options.orderby` - The key/index by which the results will be ordered. `options.start` and `options.end` use this key/index</li><li>`options.reverse` - Reverse the order of the results.</li></ul>
`size()`          | number of stored items | Returns the number of stored objects.
`clear()`         | undefined              | Deletes all database entries.

## Development

In order to run it locally you'll need to fetch some dependencies and a basic server setup.

* Install [Bower](http://bower.io/) & [Gulp](http://gulpjs.com/):

    ```sh
    $ npm install -g bower gulp
    ```

* Install local dependencies:

    ```sh
    $ bower install && npm install
    ```

* To test the project, start the development server and open `http://localhost:3001`.

    ```sh
    $ gulp server
    ```

* To build the css and lint the scripts.

    ```sh
    $ gulp build
    ```

* To provide a live demo, send everything to `gh-pages` branch.

    ```sh
    $ gulp deploy
    ```

## License

[MIT License](http://opensource.org/licenses/MIT)
