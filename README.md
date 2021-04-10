[![](https://data.jsdelivr.com/v1/package/npm/clappr-context-menu-plugin/badge)](https://www.jsdelivr.com/package/npm/clappr-context-menu-plugin)
[![](https://img.shields.io/npm/v/clappr-context-menu-plugin.svg?style=flat-square)](https://npmjs.org/package/clappr-context-menu-plugin)
[![](https://img.shields.io/npm/dt/clappr-context-menu-plugin.svg?style=flat-square)](https://npmjs.org/package/clappr-context-menu-plugin)
[![npm bundle size](https://img.shields.io/bundlephobia/min/clappr-context-menu-plugin?style=flat-square)](https://bundlephobia.com/result?p=clappr-context-menu-plugin)
![Travis (.com)](https://img.shields.io/travis/com/joaopaulovieira/clappr-context-menu-plugin?style=flat-square)
![Coveralls github](https://img.shields.io/coveralls/github/joaopaulovieira/clappr-context-menu-plugin?style=flat-square)
[![](https://img.shields.io/github/license/joaopaulovieira/clappr-context-menu-plugin?style=flat-square)](https://github.com/joaopaulovieira/clappr-context-menu-plugin/blob/master/LICENSE)

# Clappr context menu plugin
![screenshot](public/images/screenshot.png)

## Demo
https://joaopaulovieira.github.io/clappr-context-menu-plugin/

## Table of Contents
- [Features](https://github.com/joaopaulovieira/clappr-context-menu-plugin#Features)
- [Usage](https://github.com/joaopaulovieira/clappr-context-menu-plugin#Usage)
- [Configuration](https://github.com/joaopaulovieira/clappr-context-menu-plugin#Configuration)
- [Development](https://github.com/joaopaulovieira/clappr-context-menu-plugin#Development)

## Features
- Default actions:
  - Copy URL of the site where `Clappr` is playing;
  - Copy URL with the current time of the video;
  - Enable/Disable loop state;
- Default info:
  - `Clappr` version;
- Support to add new custom actions;
- Support to add custom style;

## Usage
You can use it from JSDelivr:
```
https://cdn.jsdelivr.net/npm/clappr-context-menu-plugin@latest/dist/clappr-context-menu-plugin.min.js
```
or as an npm package:
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

## Configuration
The options for the plugin go in the `contextMenu` property as shown below
```javascript
var player = new Clappr.Player({
  source: 'http://your.video/here.mp4',
  plugins: [ContextMenuPlugin],
  contextMenu: {
    menuItems: [`copyURL`, `copyURLCurrentTime`, `loop`, `playerVersion`],
    extraOptions: [
      {
        name: 'test',
        label: 'Test Label',
        //optional
        callback: function() {
          console.log('A absolutely awesome extra context menu item action')
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
      items: {
        'color': 'yellow'
      }
    }
  }
});
```
### `menuItems {Array}`
An array where each item is a name that matches one of the default menu items. The valid values are: `['copyURL', 'copyURLCurrentTime', 'loop', 'playerVersion']`

### `extraOptions {Array}`
An array of items to add on the context menu. Each context menu item on this array is an object which contains the parameters `name`, `label`, and `callback`
* #### `name {String}`
  Name of the extra item
  
* #### `label {String}`
  The label that will be displayed on the menu
  
* #### `callback {Function}`
  A method that will be triggered when clicking on the item label. This option is not required if your desired menu item not have one action to call on click (like the `playerVersion` default  menu item)

### `customStyle {Object}`
Styles to apply to mapped elements on the context menu. This option is an object with the parameters `container`, `list` and `items`
* #### `container {Object}`
  Attributes that will be applied in the main element. This option is an object that receives CSS attributes like the options example at the beginning of this section

* #### `list {Object}`
  Attributes that will be applied in the `<ul>` element. This option is an object that receives CSS attributes like the options example at the beginning of this section

* #### `items {Object}`
  Attributes that will be applied in each `<li>` element. This option is an object that receives CSS attributes like the options example at the beginning of this section

## Development

Install dependencies: `yarn`

Run: `yarn start`

Build: `yarn build`

Minified version: `yarn release`
