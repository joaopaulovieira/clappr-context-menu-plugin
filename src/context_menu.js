import { UICorePlugin, Events, Styler, template, version } from 'clappr'

import pluginStyle from './public/context_menu.scss'
import templateHtml from './public/context_menu.html'

export default class ContextMenuPlugin extends UICorePlugin {
  get name() { return 'context_menu' }

  get attributes() { return { class: 'context-menu' } }

  get template() { return template(templateHtml) }

  get loopEnable() { return this.core.activePlayback.el.loop }

  get playerVersion() {
    return {
      label: `Clappr Player v${version}`,
      name: 'playerVersion',
      noAction: true,
    }
  }

  get copyURL() {
    return {
      label: 'Copy URL',
      name: 'copyURL',
    }
  }

  get copyURLCurrentTime() {
    return {
      label: 'Copy URL on current time',
      name: 'copyURLCurrentTime',
    }
  }

  get loop() {
    return {
      label: 'Loop: ',
      name: 'loop',
      class: this.core.options.loop ? 'on' : 'off',
    }
  }

  get events() {
    const events = {
      'click [data-copyURL]': 'onCopyURL',
      'click [data-copyURLCurrentTime]': 'onCopyURLCurrentTime',
      'click [data-loop]': 'onToggleLoop',
    }
    this.extraOptions && this.extraOptions.forEach(item => {
      if (typeof item.callback === 'function') {
        const callbackName = `${item.name}Callback`
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
    const coreEventListenerData = [
      { object: this.core, event: Events.CORE_ACTIVE_CONTAINER_CHANGED, callback: this.containerChanged },
      { object: this.core, event: Events.CORE_RESIZE, callback: this.registerPlayerResize },
    ]

    coreEventListenerData.forEach(item => this.stopListening(item.object, item.event, item.callback))
    coreEventListenerData.forEach(item => this.listenTo(item.object, item.event, item.callback))

    this.bindCustomEvents()
  }

  bindContainerEvents() {
    const containerEventListenerData = [
      { object: this.container, event: Events.CONTAINER_CONTEXTMENU, callback: this.toggleContextMenu },
      { object: this.container, event: Events.CONTAINER_CLICK, callback: this.hide },
    ]

    if (this.container) {
      containerEventListenerData.forEach(item => this.stopListening(item.object, item.event, item.callback))
      containerEventListenerData.forEach(item => this.listenTo(item.object, item.event, item.callback))
    }
  }

  bindCustomEvents() {
    $('body').off('click', this.hide.bind(this))
    $('body').on('click', this.hide.bind(this))
  }

  destroy() {
    $('body').off('click', this.hide.bind(this))
    this.stopListening()
    super.destroy()
  }

  registerPlayerResize(size) {
    if (!size.width || typeof size.width !== 'number') return
    this.playerSize = size
  }

  containerChanged() {
    this.container = this.core.activeContainer
    this.bindContainerEvents()
  }

  toggleContextMenu(event) {
    event.preventDefault()
    this.show(event.offsetY, event.offsetX)
  }

  show(top, left) {
    !this.playerElement && this.calculateContextMenuLimit()
    const finalTop = top > this.maxHeight ? this.maxHeight : top
    const finalLeft = left > this.maxWidth ? this.maxWidth : left
    this.hide()
    this.$el.css({ top: finalTop, left: finalLeft })
    this.$el.show()
  }

  calculateContextMenuLimit() {
    this.maxWidth = this.playerSize && this.playerSize.width - 160
    this.maxHeight = this.playerSize && this.playerSize.height - 200
  }

  hide() {
    this.$el.hide()
  }

  copyToClipboard(value, $el) {
    if (!$el) return

    const $copyTextarea = $('<textarea class="copytextarea"/>')
    $copyTextarea.text(value)
    $el.append($copyTextarea[0])

    const copyTextarea = document.querySelector('.context-menu .copytextarea')
    copyTextarea.select()

    try {
      document.execCommand('copy')
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
    const currentTime = Math.floor(this.container.getCurrentTime())

    /* eslint-disable no-useless-escape */
    if (window.location.search === '') { // if dont exist any query string
      url += `?t=${currentTime}`
    } else if (window.location.search.split(/[\?=&]/g).indexOf('t') === -1) { // if exist query string but not the resume at
      url += `&t=${currentTime}`
    } else if (window.location.search.split(/[\?=&]/g).indexOf('t') !== -1) { // if exist resume query string
      const search = window.location.search.split(/[\?&]/g)
      const resumeAtQueryString = search.find(item => item.includes('t='))
      const newQueryString = window.location.search.replace(resumeAtQueryString, `t=${currentTime}`)
      url = `${url.replace(window.location.search, '')}${newQueryString}`
    }
    /* eslint-enable no-useless-escape */

    this.copyToClipboard(url, this.$el)
  }

  onToggleLoop() {
    this.core.options.loop = !this.loopEnable
    this.core.activePlayback.el.loop = !this.loopEnable
    this.$el.find('[data-loop]').toggleClass('on', this.loopEnable)
    this.$el.find('[data-loop]').toggleClass('off', !this.loopEnable)
  }

  appendExtraOptions(item) {
    if (!item.callback || typeof item.callback !== 'function') item.noAction = true
    this.menuOptions.unshift(item)
  }

  addCustomStyle() {
    const styles = this.options.contextMenu && this.options.contextMenu.customStyle
    if (styles) {
      this.$el.css(styles.container)
      this.$el.find('.context-menu-list').css(styles.list)
      this.$el.find('.context-menu-list-item').css(styles.items)
    }
  }

  sanitizeCustomizedItems() {
    const customMenuItems = []
    this.options.contextMenu.menuItems.forEach(item => {
      typeof this[item] !== 'undefined' && customMenuItems.push(this[item])
    })
    return customMenuItems
  }

  render() {
    this.customMenuItems = this.options.contextMenu && this.options.contextMenu.menuItems && this.sanitizeCustomizedItems()
    this.menuOptions = this.customMenuItems && this.customMenuItems.length > 0
      ? this.customMenuItems
      : [this.copyURL, this.copyURLCurrentTime, this.loop, this.playerVersion]
    const extraOptions = this.options.contextMenu && this.options.contextMenu.extraOptions
    extraOptions && extraOptions.forEach(item => this.appendExtraOptions(item))
    this.$el.html(this.template({ options: this.menuOptions }))
    this.$el.append(Styler.getStyleFor(pluginStyle))
    this.core.$el[0].append(this.$el[0])
    this.hide()
    this.disable()
    this.addCustomStyle()
    return this
  }
}
