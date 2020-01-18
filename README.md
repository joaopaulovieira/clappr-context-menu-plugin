[![](https://data.jsdelivr.com/v1/package/npm/clappr-context-menu-plugin/badge)](https://www.jsdelivr.com/package/npm/clappr-context-menu-plugin)

# Clappr context menu plugin
![screenshot](screenshot.png)
## Usage
You can use it from JSDelivr:
```
https://cdn.jsdelivr.net/npm/clappr-context-menu-plugin@latest/dist/clappr-context-menu-plugin.js
```
or as a npm package:
```
yarn add clappr-context-menu-plugin
```
Then just add `ContextMenuPlugin` into the list of plugins of your player instance
```javascript
var player = new Clappr.Player({
  source: 'http://your.video/here.mp4',
  plugins: [ContextMenuPlugin]
});
```
### Options
The options for the plugin go in the `contextMenu` property as shown below.
```javascript
var player = new Clappr.Player({
  source: 'http://your.video/here.mp4',
  plugins: [ContextMenuPlugin],
  contextMenu: {
    extraOptions: [
      {
        name: 'test',
        label: 'Test Label',
        //optional
        callback: function() {
          console.log('A absolutely awesome extra context menu item action');
        }
      }
    ],
    customStyle: {
      container: {
        'display': 'block'
      },
      list: {
        'background-color': 'gray'
      },
      itens: {
        'color': 'yellow'
      }
    }
  }
});
```
`extraOptions {Array}`: Array of objects to which each object can have the parameters `name`, `label` and `callback`.

`name {String}`: Name of the extra item.

`label {String}`: The label that will be displayed on menu.

`callback {Function}`: Method that will be triggered when clicking on the item label.

`customStyle {Object}`: Object with the parameters `container`, `list` and `itens`.

`container {Object}`: Receive the attributes that will be applied in the main element.

`list {Object}`: Receive the attributes that will be applied in the `<ul>` element.

`itens {Object}`: Receive the attributes that will be applied in each `<li>` element.

## Development

Install dependencies: `yarn`

Run: `yarn start`

Build: `yarn build`

Minified version: `yarn release`
