import { Events, Core, Container, Playback, version } from '@clappr/core'
import ContextMenuPlugin from './context_menu'

const setupTest = (options = {}, fullSetup = false) => {
  const core = new Core(options)
  const plugin = new ContextMenuPlugin(core)
  core.addPlugin(plugin)

  const response = { core, plugin }
  fullSetup && (response.container = new Container({ playerId: 1, playback: new Playback({}) }))

  return response
}

describe('Context Menu Plugin', function() {
  beforeEach(() => {
    jest.clearAllMocks()
    const response = setupTest({}, true)
    this.core = response.core
    this.container = response.container
    this.core.activeContainer = this.container
    this.playback = this.container.playback
    this.plugin = response.plugin
  })

  test('is loaded on core plugins array', () => {
    expect(this.core.getPlugin(this.plugin.name).name).toEqual('context_menu')
  })

  test('is compatible with the latest Clappr core version', () => {
    expect(this.core.getPlugin(this.plugin.name).supportedVersion).toEqual({ min: version })
  })

  test('only unbind events when is necessary', () => {
    jest.spyOn(this.plugin, 'stopListening')

    expect(this.plugin.stopListening).not.toHaveBeenCalled()

    this.core.activeContainer = this.container

    expect(this.plugin.stopListening).toHaveBeenCalled()
  })

  test('shows at context menu event trigger occurs', () => {
    jest.spyOn(this.plugin, 'show')
    const evt = new Event('contextmenu', { bubbles: true, cancelable: true })
    this.core.activeContainer.trigger(Events.CONTAINER_CONTEXTMENU, evt)

    expect(this.plugin.show).toHaveBeenCalled()
  })

  test('creates cache elements to not have unnecessary re-render cycles', () => {
    jest.spyOn(this.plugin, 'render')
    jest.spyOn(this.plugin, 'cacheElements')
    this.plugin.render()

    expect(this.plugin.render).toHaveBeenCalledTimes(1)
    expect(this.plugin.cacheElements).not.toHaveBeenCalled()

    this.plugin.render()

    expect(this.plugin.render).toHaveBeenCalledTimes(2)
    expect(this.plugin.cacheElements).not.toHaveBeenCalled()
  })

  test('only accept absolute size format', () => {
    const customSize = { height: 360, width: 640 }
    this.plugin.registerPlayerResize({ height: '100%', width: '100%' })

    expect(this.plugin.playerSize).toBeUndefined()
    this.core.resize(customSize)

    expect(this.plugin.playerSize).toEqual(customSize)
  })

  test('respect player size limits to render', () => {
    this.core.trigger(Events.CORE_RESIZE, { height: 360, width: 640 })
    this.plugin.show(100, 100)

    expect(this.plugin.el.style.left).toEqual('100px')

    this.plugin.show(1000, 2000)

    expect(this.plugin.el.style.left).toEqual('480px')
  })

  test('is destroyed when Core is destroyed too', () => {
    jest.spyOn(this.plugin, 'destroy')
    this.core.destroy()

    expect(this.plugin.destroy).toHaveBeenCalled()
  })

  describe('with no configuration', () => {
    test('render default items', () => {
      expect(this.plugin.menuOptions).toEqual(this.plugin.defaultMenuItems)
    })
  })

  describe('with menuItems configured', () => {
    const contextMenuOptions = { menuItems: [] }

    test('discard empty config', () => {
      const { plugin } = setupTest()

      expect(plugin.menuOptions).toEqual(plugin.defaultMenuItems)
    })

    test('discard unrecognized config', () => {
      contextMenuOptions.menuItems.push('invalid')
      const { plugin } = setupTest({ source: 'test.mp4', contextMenu: contextMenuOptions })

      expect(plugin.menuOptions).toEqual(plugin.defaultMenuItems)
    })

    test('apply custom menuItem config', () => {
      contextMenuOptions.menuItems.push('playerVersion')
      const { plugin } = setupTest({ source: 'test.mp4', contextMenu: contextMenuOptions })

      expect(plugin.menuOptions).toEqual([{ label: `Clappr Player v${version}`, name: 'playerVersion', noAction: true }])
    })
  })

  describe('with extraOptions configured', () => {
    const extraOption = { name: 'test', label: 'Test Label' }
    const contextMenuOptions = { extraOptions: [extraOption] }

    test('use set extra options', () => {
      const { plugin } = setupTest({ source: 'test.mp4', contextMenu: contextMenuOptions })

      expect(plugin.menuOptions).toContain(extraOption)
    })

    test('trigger callback at click on extra options', () => {
      let callbackCalled = false
      extraOption.callback = () => { callbackCalled = true }
      const { plugin } = setupTest({ source: 'test.mp4', contextMenu: contextMenuOptions })

      const evt = new Event('click', { bubbles: true, cancelable: false })
      const extraOptionElement = plugin.el.querySelector('[data-test]')
      extraOptionElement.dispatchEvent(evt)

      expect(callbackCalled).toBeTruthy()
    })
  })

  describe('with customStyle configured', () => {
    test('apply style correctly', () => {
      const customStyle = {
        list: { 'background-color': 'gray' },
        items: { color: 'yellow' },
      }
      const contextMenuOptions = { customStyle }
      const { plugin } = setupTest({ source: 'test.mp4', contextMenu: contextMenuOptions })
      jest.spyOn(plugin.$list, 'css')
      jest.spyOn(plugin.$listItem, 'css')
      plugin.addCustomStyle(customStyle)

      expect(plugin.$list.css).toHaveBeenCalledWith({ 'background-color': 'gray' })
      expect(plugin.$listItem.css).toHaveBeenCalledWith({ color: 'yellow' })
    })
  })

  describe('player version feature', () => {
    test('show correct Clappr version', () => {
      const playerVersion = this.plugin.el.querySelector('[data-playerversion]')

      expect(playerVersion.innerHTML).toEqual(`Clappr Player v${version}`)
    })
  })

  describe('loop feature', () => {
    test('show current loop status', () => {
      const { plugin } = setupTest({ source: 'test.mp4', loop: true })
      const loop = plugin.el.querySelector('[data-loop]')

      expect([...loop.classList]).toContain('on')
    })

    test('update loop playback property value', () => {
      const loop = this.plugin.el.querySelector('[data-loop]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      loop.dispatchEvent(evt)

      expect([...loop.classList]).toContain('on')
    })
  })

  describe('copyURL feature', () => {
    test('copy url website at Clappr as embedded', () => {
      jest.spyOn(this.plugin, 'copyToClipboard').mockImplementation()
      const copyURL = this.plugin.el.querySelector('[data-copyURL]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)

      expect(this.plugin.copyToClipboard).toHaveBeenCalledWith(window.location.href, this.plugin.$el)
    })
  })

  describe('CopyURLCurrentTime feature', () => {
    test('copy url without query string and put current video time', () => {
      jest.spyOn(this.plugin, 'copyToClipboard').mockImplementation()
      jest.spyOn(this.plugin.container, 'getCurrentTime').mockImplementation(() => 1)

      const copyURL = this.plugin.el.querySelector('[data-copyURLCurrentTime]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)
      const expectedURL = `${window.location.href}?t=1`

      expect(this.plugin.copyToClipboard).toHaveBeenCalledWith(expectedURL, this.plugin.$el)
    })

    test('copy url with other query string and put current video time', () => {
      jest.spyOn(this.plugin, 'copyToClipboard').mockImplementation()
      window.history.pushState({}, '', `${window.location.href}?other_query_string=0`)
      jest.spyOn(this.plugin.container, 'getCurrentTime').mockImplementation(() => 1)

      const copyURL = this.plugin.el.querySelector('[data-copyURLCurrentTime]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)
      const expectedURL = `${window.location.href}&t=1`

      expect(this.plugin.copyToClipboard).toHaveBeenCalledWith(expectedURL, this.plugin.$el)
    })

    test('copy url with resume at query string and put current video time', () => {
      jest.spyOn(this.plugin, 'copyToClipboard').mockImplementation()
      const sitePageURL = window.location.href
      window.history.pushState({}, '', `${window.location.href}?t=0`)
      jest.spyOn(this.plugin.container, 'getCurrentTime').mockImplementation(() => 1)

      const copyURL = this.plugin.el.querySelector('[data-copyURLCurrentTime]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)
      const expectedURL = `${sitePageURL}?t=1`

      expect(this.plugin.copyToClipboard).toHaveBeenCalledWith(expectedURL, this.plugin.$el)
    })
  })
})
