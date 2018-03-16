import {UICorePlugin, Events, Styler, template} from 'Clappr'

import pluginStyle from './public/context_menu.scss'
import templateHtml from './public/context_menu.html'

export default class ContextMenuPlugin extends UICorePlugin {
  get name() { return 'context_menu' }
  get attributes() { return { 'class': 'context-menu' } }
  get mediaControl() { return this.core.mediaControl }
  get template() { return template(templateHtml) }

  get exposeVersion() {
    return {
      label: `Clappr Player v${Clappr.version}`,
      name: 'version'
    }
  }

  get copyURL() {
    return {
      label: 'Copy URL',
      name: 'copyURL'
    }
  }

  get copyURLCurrentTime() {
    return {
      label: 'Copy URL on current time',
      name: 'copyURLCurrentTime'
    }
  }

  get loop() {
    return {
      label: 'Loop: ',
      name: 'loop',
      class: this.core.options.loop ? 'on' : 'off'
    }
  }

  get loopEnable() {
    return this.core.getCurrentPlayback().el.loop
  }

  get events() {
    let events = {
      'click [data-copyURL]': 'onCopyURL',
      'click [data-copyURLCurrentTime]': 'onCopyURLCurrentTime',
      'click [data-loop]': 'onToggleLoop'
    }
    this.extraOptions && this.extraOptions.forEach((item) => {
      if (typeof item.callback === 'function') {
        let callbackName = `${item.name}Callback`
        this[callbackName] = item.callback
        events[`click [data-${item.name}]`] = callbackName
      }
    })
    return events
  }

  constructor(core) {
    super(core)
    this.extraOptions = this.options.contextMenu && this.options.contextMenu.extraOptions || []
    this.delegateEvents(this.events)
    this.bindEvents()
  }

  bindEvents() {
    this.stopListening()
    if (this.mediaControl) {
      this.listenTo(this.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.containerChanged)
      if (this.container) {
        this.listenTo(this.container, Events.CONTAINER_CONTEXTMENU, this.toggleContextMenu)
        this.listenTo(this.container, Events.CONTAINER_CLICK, this.hide)
      }
    }
    $('body').on('click', this.hide.bind(this))
  }

  destroy() {
    $('body').off('click', this.hide.bind(this))
    this.stopListening()
    super.destroy()
  }

  containerChanged() {
    this.container = this.core.getCurrentContainer()
    this.bindEvents()
  }

  toggleContextMenu(event) {
    event.preventDefault()
    this.show(event.offsetY, event.offsetX)
  }

  show(top, left) {
    !this.playerElement && this.calculateContextMenuLimit()
    let finalTop = top > this.maxHeight ? this.maxHeight : top
    let finalLeft = left > this.maxWidth ? this.maxWidth : left
    this.hide()
    this.$el.css({ top: finalTop, left: finalLeft})
    this.$el.show()
  }

  calculateContextMenuLimit() {
    this.playerElement = document.querySelector('[data-player]')
    this.maxWidth = this.playerElement.clientWidth - 160
    this.maxHeight = this.playerElement.clientHeight - 200
  }

  hide() {
    this.$el.hide()
  }

  copyToClipboard(value, $el) {
    if (!$el) return

    let $copyTextarea = $('<textarea class="copytextarea"/>')
    $copyTextarea.text(value)
    $el.append($copyTextarea[0])

    let copyTextarea = document.querySelector('.context-menu .copytextarea');
    copyTextarea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      throw Error(err)
    }

    $copyTextarea.remove()
  }

  onCopyURL() {
    this.copyToClipboard(window.location.href, this.$el)
  }

  onCopyURLCurrentTime() {
    let url = window.location.href
    const current_time = Math.floor(this.container.getCurrentTime())
    if (window.location.search == '') {
      url += `?t=${current_time}`
    } else {
      if (window.location.search.split(/[\?=&]/g).indexOf('t') == -1) {
        url += `&t=${current_time}`
      } else {
        let search = window.location.search.split(/s=\d+&*/g)[1]
        if (search == '') {
          url = `${window.location.href.replace(window.location.search, '')}${search}?t=${current_time}`
        } else {
          search = window.location.search.split(/s=\d+&*/g).join('')
          url = `${window.location.href.replace(window.location.search, '')}${search}&t=${current_time}`
        }
      }
    }
    this.copyToClipboard(url, this.$el)
  }

  onToggleLoop() {
    this.core.options.loop = !this.loopEnable
    this.core.getCurrentPlayback().el.loop = !this.loopEnable
    this.$el.find('[data-loop]').toggleClass('on', this.loopEnable)
    this.$el.find('[data-loop]').toggleClass('off', !this.loopEnable)
  }

  appendExtraOptions(item) {
    this.menuOptions.unshift(item)
  }

  addCustomStyle() {
    let styles = this.options.contextMenu && this.options.contextMenu.customStyle
    if (styles) {
      this.$el.css(styles.container)
      this.$el.find('.context-menu-list').css(styles.list)
      this.$el.find('.context-menu-list-item').css(styles.itens)
    }
  }

  render() {
    this.menuOptions = [this.copyURL, this.copyURLCurrentTime, this.loop, this.exposeVersion]
    if (this.options.contextMenu && this.options.contextMenu.extraOptions)
      this.options.contextMenu.extraOptions.forEach((item) => this.appendExtraOptions(item))
    this.$el.html(this.template({options: this.menuOptions}))
    this.$el.append(Styler.getStyleFor(pluginStyle))
    this.core.$el[0].append(this.$el[0])
    this.hide()
    this.disable()
    this.addCustomStyle()
    return this
  }
}
