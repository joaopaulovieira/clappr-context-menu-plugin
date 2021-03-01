
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { version, template, Events, Styler, UICorePlugin } from '@clappr/core';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".context-menu {\n  z-index: 999;\n  position: absolute;\n  top: 0;\n  left: 0;\n  text-align: center; }\n  .context-menu .context-menu-list {\n    font-family: \"Proxima Nova\";\n    font-size: 12px;\n    line-height: 12px;\n    list-style-type: none;\n    text-align: left;\n    padding: 5px;\n    margin-left: auto;\n    margin-right: auto;\n    background-color: rgba(0, 0, 0, 0.75);\n    border: 1px solid #666;\n    border-radius: 4px; }\n    .context-menu .context-menu-list .context-menu-list-item {\n      color: white;\n      padding: 5px;\n      cursor: pointer; }\n      .context-menu .context-menu-list .context-menu-list-item:hover {\n        color: #2b669a; }\n      .context-menu .context-menu-list .context-menu-list-item[data-no-action] {\n        pointer-events: none; }\n      .context-menu .context-menu-list .context-menu-list-item[data-loop].on:after {\n        content: 'ON'; }\n      .context-menu .context-menu-list .context-menu-list-item[data-loop].off:after {\n        content: 'OFF'; }\n";
styleInject(css_248z);

var templateHtml = "<ul class=\"context-menu-list\">\n  <% if(options) { %>\n    <% for (var i = 0; i < options.length; i++) { %>\n        <li class=\"context-menu-list-item <%=options[i].class%>\" data-<%=options[i].name%> <% if(options[i].noAction) { %> data-no-action <% } %>\n        ><%=options[i].label%></li>\n    <% } %>\n  <% } %>\n</ul>\n";

var ContextMenuPlugin = /*#__PURE__*/function (_UICorePlugin) {
  _inherits(ContextMenuPlugin, _UICorePlugin);

  var _super = _createSuper(ContextMenuPlugin);

  _createClass(ContextMenuPlugin, [{
    key: "name",
    get: function get() {
      return 'context_menu';
    }
  }, {
    key: "supportedVersion",
    get: function get() {
      return {
        min: version
      };
    }
  }, {
    key: "attributes",
    get: function get() {
      return {
        "class": 'context-menu'
      };
    }
  }, {
    key: "template",
    get: function get() {
      return template(templateHtml);
    }
  }, {
    key: "defaultMenuItems",
    get: function get() {
      return [this.copyURL, this.copyURLCurrentTime, this.loop, this.playerVersion];
    }
  }, {
    key: "loopEnable",
    get: function get() {
      return this.core.activePlayback && this.core.activePlayback.el && this.core.activePlayback.el.loop;
    }
  }, {
    key: "playerVersion",
    get: function get() {
      return {
        label: "Clappr Player v".concat(version),
        name: 'playerVersion',
        noAction: true
      };
    }
  }, {
    key: "copyURL",
    get: function get() {
      return {
        label: 'Copy URL',
        name: 'copyURL'
      };
    }
  }, {
    key: "copyURLCurrentTime",
    get: function get() {
      return {
        label: 'Copy URL on current time',
        name: 'copyURLCurrentTime'
      };
    }
  }, {
    key: "loop",
    get: function get() {
      return {
        label: 'Loop: ',
        name: 'loop',
        "class": this.core.options.loop ? 'on' : 'off'
      };
    }
  }, {
    key: "events",
    get: function get() {
      var _this2 = this;

      var events = {
        'click [data-copyURL]': 'onCopyURL',
        'click [data-copyURLCurrentTime]': 'onCopyURLCurrentTime',
        'click [data-loop]': 'onToggleLoop'
      };
      this.extraOptions && this.extraOptions.forEach(function (item) {
        if (typeof item.callback === 'function') {
          var callbackName = "".concat(item.name, "Callback");
          _this2[callbackName] = item.callback;
          events["click [data-".concat(item.name, "]")] = callbackName;
        }
      });
      return events;
    }
  }]);

  function ContextMenuPlugin(core) {
    var _this;

    _classCallCheck(this, ContextMenuPlugin);

    _this = _super.call(this, core);

    _this.init();

    return _this;
  }

  _createClass(ContextMenuPlugin, [{
    key: "init",
    value: function init() {
      this.extraOptions = this.options.contextMenu && this.options.contextMenu.extraOptions || [];
      this.delegateEvents(this.events);
      this.bindEvents();
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this3 = this;

      var coreEventListenerData = [{
        object: this.core,
        event: Events.CORE_ACTIVE_CONTAINER_CHANGED,
        callback: this.containerChanged
      }, {
        object: this.core,
        event: Events.CORE_RESIZE,
        callback: this.registerPlayerResize
      }];
      coreEventListenerData.forEach(function (item) {
        return _this3.stopListening(item.object, item.event, item.callback);
      });
      coreEventListenerData.forEach(function (item) {
        return _this3.listenTo(item.object, item.event, item.callback);
      });
      this.bindCustomEvents();
    }
  }, {
    key: "bindContainerEvents",
    value: function bindContainerEvents() {
      var _this4 = this;

      var containerEventListenerData = [{
        object: this.container,
        event: Events.CONTAINER_CONTEXTMENU,
        callback: this.toggleContextMenu
      }, {
        object: this.container,
        event: Events.CONTAINER_CLICK,
        callback: this.hide
      }];
      this.container && containerEventListenerData.forEach(function (item) {
        return _this4.listenTo(item.object, item.event, item.callback);
      });
    }
  }, {
    key: "bindCustomEvents",
    value: function bindCustomEvents() {
      $('body').off('click', this.hide.bind(this));
      $('body').on('click', this.hide.bind(this));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      $('body').off('click', this.hide.bind(this));
      this.isRendered = false;

      _get(_getPrototypeOf(ContextMenuPlugin.prototype), "destroy", this).call(this);
    }
  }, {
    key: "registerPlayerResize",
    value: function registerPlayerResize(size) {
      if (!size.width || typeof size.width !== 'number') return;
      this.playerSize = size;
    }
  }, {
    key: "containerChanged",
    value: function containerChanged() {
      this.container && this.stopListening(this.container);
      this.container = this.core.activeContainer;
      this.bindContainerEvents();
    }
  }, {
    key: "toggleContextMenu",
    value: function toggleContextMenu(event) {
      event.preventDefault();
      this.show(event.offsetY, event.offsetX);
    }
  }, {
    key: "show",
    value: function show(top, left) {
      !this.playerElement && this.calculateContextMenuLimit();
      var finalTop = top > this.maxHeight ? this.maxHeight : top;
      var finalLeft = left > this.maxWidth ? this.maxWidth : left;
      this.hide();
      this.$el.css({
        top: finalTop,
        left: finalLeft
      });
      this.$el.show();
    }
  }, {
    key: "calculateContextMenuLimit",
    value: function calculateContextMenuLimit() {
      this.maxWidth = this.playerSize && this.playerSize.width - 160;
      this.maxHeight = this.playerSize && this.playerSize.height - 200;
    }
  }, {
    key: "hide",
    value: function hide() {
      this.$el.hide();
    }
  }, {
    key: "copyToClipboard",
    value: function copyToClipboard(value, $el) {
      if (!$el) return;
      var $copyTextarea = $('<textarea class="copytextarea"/>');
      $copyTextarea.text(value);
      $el.append($copyTextarea[0]);
      var copyTextarea = this.el.querySelector('.context-menu .copytextarea');
      copyTextarea.select();

      try {
        document.execCommand('copy');
      } catch (err) {
        throw Error(err);
      }

      $copyTextarea.remove();
    }
  }, {
    key: "onCopyURL",
    value: function onCopyURL() {
      this.copyToClipboard(window.location.href, this.$el);
    }
  }, {
    key: "onCopyURLCurrentTime",
    value: function onCopyURLCurrentTime() {
      var url = window.location.href;
      var currentTime = Math.floor(this.container.getCurrentTime());
      /* eslint-disable no-useless-escape */

      if (window.location.search === '') {
        // if dont exist any query string
        url += "?t=".concat(currentTime);
      } else if (window.location.search.split(/[\?=&]/g).indexOf('t') === -1) {
        // if exist query string but not the resume at
        url += "&t=".concat(currentTime);
      } else if (window.location.search.split(/[\?=&]/g).indexOf('t') !== -1) {
        // if exist resume query string
        var search = window.location.search.split(/[\?&]/g);
        var resumeAtQueryString = search.find(function (item) {
          return item.includes('t=');
        });
        var newQueryString = window.location.search.replace(resumeAtQueryString, "t=".concat(currentTime));
        url = "".concat(url.replace(window.location.search, '')).concat(newQueryString);
      }
      /* eslint-enable no-useless-escape */


      this.copyToClipboard(url, this.$el);
    }
  }, {
    key: "onToggleLoop",
    value: function onToggleLoop() {
      this.core.options && (this.core.options.loop = !this.loopEnable);
      this.core.activePlayback && this.core.activePlayback.el && (this.core.activePlayback.el.loop = !this.loopEnable);
      this.$el.find('[data-loop]').toggleClass('on', this.loopEnable);
      this.$el.find('[data-loop]').toggleClass('off', !this.loopEnable);
    }
  }, {
    key: "appendExtraOptions",
    value: function appendExtraOptions(item) {
      if (!item.callback || typeof item.callback !== 'function') item.noAction = true;
      this.menuOptions.unshift(item);
    }
  }, {
    key: "addCustomStyle",
    value: function addCustomStyle() {
      var styles = this.options.contextMenu && this.options.contextMenu.customStyle;

      if (styles) {
        this.$el.css(styles.container);
        this.$list.css(styles.list);
        this.$listItem.css(styles.items);
      }
    }
  }, {
    key: "sanitizeCustomizedItems",
    value: function sanitizeCustomizedItems() {
      var _this5 = this;

      var customMenuItems = [];
      this.options.contextMenu.menuItems.forEach(function (item) {
        typeof _this5[item] !== 'undefined' && customMenuItems.push(_this5[item]);
      });
      return customMenuItems;
    }
  }, {
    key: "cacheElements",
    value: function cacheElements() {
      this.$list = this.$el.find('.context-menu-list');
      this.$listItem = this.$el.find('.context-menu-list-item');
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      if (this.isRendered) return;
      this.customMenuItems = this.options.contextMenu && this.options.contextMenu.menuItems && this.sanitizeCustomizedItems();
      this.menuOptions = this.customMenuItems && this.customMenuItems.length > 0 ? this.customMenuItems : this.defaultMenuItems;
      var extraOptions = this.options.contextMenu && this.options.contextMenu.extraOptions;
      extraOptions && extraOptions.forEach(function (item) {
        return _this6.appendExtraOptions(item);
      });
      this.$el.html(this.template({
        options: this.menuOptions
      }));
      this.$el.append(Styler.getStyleFor(css_248z));
      this.core.$el[0].append(this.$el[0]);
      this.cacheElements();
      this.hide();
      this.disable();
      this.addCustomStyle();
      this.isRendered = true;
      return this;
    }
  }]);

  return ContextMenuPlugin;
}(UICorePlugin);

export default ContextMenuPlugin;
