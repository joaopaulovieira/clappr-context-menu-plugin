/* eslint-disable prefer-arrow-callback */
import { Player, Container, version } from 'clappr'
import ContextMenuPlugin from './context_menu'

const menuItems = [
  { label: 'Copy URL', name: 'copyURL' },
  { label: 'Copy URL on current time', name: 'copyURLCurrentTime' },
  { label: 'Loop: ', name: 'loop', class: 'off' },
  { label: `Clappr Player v${version}`, name: 'playerVersion', noAction: true },
]

describe('Context Menu Plugin', function() {
  beforeEach(function() {
    this.playerElement = document.getElementById('context')
  })

  afterEach(function() {
    this.player && this.player.destroy()
  })

  it('is loaded on core plugins array', function() {
    this.player = new Player({ source: 'test.mp4' })
    this.player.attachTo(this.playerElement)
    this.plugin = new ContextMenuPlugin(this.player.core)
    this.player.core.addPlugin(this.plugin)

    expect(this.player.core.getPlugin(this.plugin.name).name).toEqual('context_menu')
  })

  it('shows at context menu event trigger occurs', function() {
    this.player = new Player({ source: 'test.mp4' })
    this.player.attachTo(this.playerElement)
    this.plugin = new ContextMenuPlugin(this.player.core)
    spyOn(this.plugin, 'show')
    this.player.core.addPlugin(this.plugin)
    this.player.core.activeContainer = new Container({ playerId: 1, playback: this.player.core.activePlayback })

    const evt = new Event('contextmenu', { bubbles: true, cancelable: true })
    this.player.core.activeContainer.trigger('container:contextmenu', evt)

    expect(this.plugin.show).toHaveBeenCalled()
  })

  it('respect player size limits to render', function() {
    this.player = new Player({ source: 'test.mp4' })
    this.player.attachTo(this.playerElement)
    this.plugin = new ContextMenuPlugin(this.player.core)
    this.player.core.addPlugin(this.plugin)
    this.player.core.trigger('core:resize', { height: 360, width: 640 })
    this.plugin.show(100, 100)

    expect(this.plugin.$el[0].style.top).toEqual('100px')
    expect(this.plugin.$el[0].style.left).toEqual('100px')

    this.plugin.show(1000, 2000)

    expect(this.plugin.$el[0].style.top).toEqual('160px')
    expect(this.plugin.$el[0].style.left).toEqual('480px')
  })

  describe('with no configuration', function() {
    it('render default items', function() {
      this.player = new Player({ source: 'test.mp4' })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)

      expect(this.plugin.menuOptions).toEqual(menuItems)
    })
  })

  describe('with menuItems configured', function() {
    const contextMenuOptions = { menuItems: [] }

    it('discard empty config', function() {
      this.player = new Player({ source: 'test.mp4', contextMenu: contextMenuOptions })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)

      expect(this.plugin.menuOptions).toEqual(menuItems)
    })

    it('discard unrecognized config', function() {
      contextMenuOptions.menuItems.push('xpto')
      this.player = new Player({ source: 'test.mp4', contextMenu: contextMenuOptions })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)

      expect(this.plugin.menuOptions).toEqual(menuItems)
    })

    it('apply custom menuItem config', function() {
      contextMenuOptions.menuItems.push('playerVersion')
      this.player = new Player({ source: 'test.mp4', contextMenu: contextMenuOptions })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)

      expect(this.plugin.menuOptions).toEqual([{ label: `Clappr Player v${version}`, name: 'playerVersion', noAction: true }])
    })
  })

  describe('with extraOptions configured', function() {
    const extraOption = { name: 'test', label: 'Test Label' }
    const contextMenuOptions = { extraOptions: [extraOption] }

    it('use setted extram options', function() {
      this.player = new Player({ source: 'test.mp4', contextMenu: contextMenuOptions })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)

      expect(this.plugin.menuOptions).toContain(extraOption)
    })

    it('trigger callback at click on extra options', function() {
      let callbackCalled = false
      extraOption.callback = function() { callbackCalled = true }

      this.player = new Player({ source: 'test.mp4', contextMenu: contextMenuOptions })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)

      const evt = new Event('click', { bubbles: true, cancelable: false })
      const extraOptionElement = this.plugin.el.querySelector('[data-test]')
      extraOptionElement.dispatchEvent(evt)

      expect(callbackCalled).toBeTruthy()
    })
  })

  describe('with customStyle configured', function() {
    const customStyle = {
      list: { 'background-color': 'gray' },
      items: { color: 'yellow' },
    }
    const contextMenuOptions = { customStyle }

    it('apply style correctly', function() {
      this.player = new Player({ source: 'test.mp4', contextMenu: contextMenuOptions })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)

      const listElement = this.plugin.$el.find('.context-menu-list')
      const ListItemElement = this.plugin.$el.find('.context-menu-list-item')

      expect(listElement[0].style.backgroundColor).toEqual('gray')
      expect(ListItemElement[0].style.color).toEqual('yellow')
    })
  })

  describe('player version feature', function() {
    it('show correct Clappr version', function() {
      this.player = new Player({ source: 'test.mp4' })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)

      const playerVersion = this.plugin.el.querySelector('[data-playerversion]')

      expect(playerVersion.innerHTML).toEqual(`Clappr Player v${version}`)
    })
  })

  describe('loop feature', function() {
    it('show current loop status', function() {
      this.player = new Player({ source: 'test.mp4', loop: true })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)

      const loop = this.plugin.el.querySelector('[data-loop]')

      expect([...loop.classList]).toContain('on')
    })

    it('update loop playback property value', function() {
      this.player = new Player({ source: 'test.mp4' })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)

      const loop = this.plugin.el.querySelector('[data-loop]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      loop.dispatchEvent(evt)

      expect([...loop.classList]).toContain('on')
    })
  })

  describe('copyURL feature', function() {
    it('copy url website at Clappr as embeded', function() {
      this.player = new Player({ source: 'test.mp4' })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)
      spyOn(this.plugin, 'copyToClipboard')

      const copyURL = this.plugin.el.querySelector('[data-copyURL]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)

      expect(this.plugin.copyToClipboard).toHaveBeenCalledWith(window.location.href, this.plugin.$el)
    })
  })

  describe('CopyURLCurrentTime feature', function() {
    beforeEach(function() {
      this.player = new Player({ source: 'test.mp4' })
      this.player.attachTo(this.playerElement)
      this.plugin = new ContextMenuPlugin(this.player.core)
      this.player.core.addPlugin(this.plugin)
      this.player.core.activeContainer = new Container({ playerId: 1, playback: this.player.core.activePlayback })
      spyOn(this.plugin, 'copyToClipboard')
    })

    it('copy url without query string and put current video time', function() {
      spyOn(this.plugin.container, 'getCurrentTime').and.returnValue(1)

      const copyURL = this.plugin.el.querySelector('[data-copyURLCurrentTime]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)
      const expectedURL = `${window.location.href}?t=1`

      expect(this.plugin.copyToClipboard).toHaveBeenCalledWith(expectedURL, this.plugin.$el)
    })

    it('copy url with other query string and put current video time', function() {
      window.history.pushState({}, '', `${window.location.href}?other_query_string=0`)
      spyOn(this.plugin.container, 'getCurrentTime').and.returnValue(1)

      const copyURL = this.plugin.el.querySelector('[data-copyURLCurrentTime]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)
      const expectedURL = `${window.location.href}&t=1`

      expect(this.plugin.copyToClipboard).toHaveBeenCalledWith(expectedURL, this.plugin.$el)
    })

    it('copy url with resume at query string and put current video time', function() {
      const sitePageURL = window.location.href
      window.history.pushState({}, '', `${window.location.href}?t=0`)
      spyOn(this.plugin.container, 'getCurrentTime').and.returnValue(1)

      const copyURL = this.plugin.el.querySelector('[data-copyURLCurrentTime]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)
      const expectedURL = `${sitePageURL}?t=1`

      expect(this.plugin.copyToClipboard).toHaveBeenCalledWith(expectedURL, this.plugin.$el)
    })
  })
})
