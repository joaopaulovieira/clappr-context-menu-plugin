import { Core, Container, Playback, version } from 'clappr'
import ContextMenuPlugin from './context_menu'

describe('Context Menu Plugin', () => {
  test('is loaded on core plugins array', () => {
    const core = new Core({})
    const plugin = new ContextMenuPlugin(core)
    core.addPlugin(plugin)

    expect(core.getPlugin(plugin.name).name).toEqual('context_menu')
  })

  test('only unbind events when is necessary', () => {
    const core = new Core({})
    const playback = new Playback({})
    const container = new Container({ playerId: 1, playback })
    const plugin = new ContextMenuPlugin(core)
    core.addPlugin(plugin)
    jest.spyOn(plugin, 'stopListening')

    core.activeContainer = container

    expect(plugin.stopListening).not.toHaveBeenCalled()

    core.activeContainer = container

    expect(plugin.stopListening).toHaveBeenCalled()
  })

  test('shows at context menu event trigger occurs', () => {
    const core = new Core({})
    const playback = new Playback({})
    const plugin = new ContextMenuPlugin(core)
    core.addPlugin(plugin)
    core.activeContainer = new Container({ playerId: 1, playback })
    jest.spyOn(plugin, 'show')

    const evt = new Event('contextmenu', { bubbles: true, cancelable: true })
    core.activeContainer.trigger('container:contextmenu', evt)

    expect(plugin.show).toHaveBeenCalled()
  })

  test('creates cache elements to not have unnecessary re-render cicles', () => {
    const core = new Core({})
    const plugin = new ContextMenuPlugin(core)
    core.addPlugin(plugin)
    jest.spyOn(plugin, 'render')
    jest.spyOn(plugin, 'cacheElements')
    plugin.render()

    expect(plugin.render).toHaveBeenCalledTimes(1)
    expect(plugin.cacheElements).not.toHaveBeenCalled()

    plugin.render()

    expect(plugin.render).toHaveBeenCalledTimes(2)
    expect(plugin.cacheElements).not.toHaveBeenCalled()
  })

  test('only accept absolute size format', () => {
    const customSize = { height: 360, width: 640 }
    const core = new Core({})
    const plugin = new ContextMenuPlugin(core)
    core.addPlugin(plugin)
    plugin.registerPlayerResize({ height: '100%', width: '100%' })

    expect(plugin.playerSize).toBeUndefined()
    core.resize(customSize)

    expect(plugin.playerSize).toEqual(customSize)
  })

  test('respect player size limits to render', () => {
    const core = new Core({})
    const plugin = new ContextMenuPlugin(core)
    core.addPlugin(plugin)
    core.trigger('core:resize', { height: 360, width: 640 })
    plugin.show(100, 100)

    expect(plugin.el.style.left).toEqual('100px')

    plugin.show(1000, 2000)

    expect(plugin.el.style.left).toEqual('480px')
  })

  test('is destroyed when Core is destroyed too', () => {
    const core = new Core({})
    const plugin = new ContextMenuPlugin(core)
    core.addPlugin(plugin)
    jest.spyOn(plugin, 'destroy')
    core.destroy()

    expect(plugin.destroy).toHaveBeenCalled()
  })

  describe('with no configuration', () => {
    test('render default items', () => {
      const core = new Core({})
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)

      expect(plugin.menuOptions).toEqual(plugin.defaultMenuItems)
    })
  })

  describe('with menuItems configured', () => {
    const contextMenuOptions = { menuItems: [] }

    test('discard empty config', () => {
      const core = new Core({})
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)

      expect(plugin.menuOptions).toEqual(plugin.defaultMenuItems)
    })

    test('discard unrecognized config', () => {
      contextMenuOptions.menuItems.push('xpto')
      const core = new Core({ source: 'test.mp4', contextMenu: contextMenuOptions })
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)

      expect(plugin.menuOptions).toEqual(plugin.defaultMenuItems)
    })

    test('apply custom menuItem config', () => {
      contextMenuOptions.menuItems.push('playerVersion')
      const core = new Core({ source: 'test.mp4', contextMenu: contextMenuOptions })
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)

      expect(plugin.menuOptions).toEqual([{ label: `Clappr Player v${version}`, name: 'playerVersion', noAction: true }])
    })
  })

  describe('with extraOptions configured', () => {
    const extraOption = { name: 'test', label: 'Test Label' }
    const contextMenuOptions = { extraOptions: [extraOption] }

    test('use setted extram options', () => {
      const core = new Core({ source: 'test.mp4', contextMenu: contextMenuOptions })
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)

      expect(plugin.menuOptions).toContain(extraOption)
    })

    test('trigger callback at click on extra options', () => {
      let callbackCalled = false
      extraOption.callback = () => { callbackCalled = true }

      const core = new Core({ source: 'test.mp4', contextMenu: contextMenuOptions })
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)

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

      const core = new Core({ source: 'test.mp4', contextMenu: contextMenuOptions })
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)
      jest.spyOn(plugin.$list, 'css')
      jest.spyOn(plugin.$listItem, 'css')
      plugin.addCustomStyle(customStyle)

      expect(plugin.$list.css).toHaveBeenCalledWith({ 'background-color': 'gray' })
      expect(plugin.$listItem.css).toHaveBeenCalledWith({ color: 'yellow' })
    })
  })

  describe('player version feature', () => {
    test('show correct Clappr version', () => {
      const core = new Core({})
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)

      const playerVersion = plugin.el.querySelector('[data-playerversion]')

      expect(playerVersion.innerHTML).toEqual(`Clappr Player v${version}`)
    })
  })

  describe('loop feature', () => {
    test('show current loop status', () => {
      const core = new Core({ source: 'test.mp4', loop: true })
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)

      const loop = plugin.el.querySelector('[data-loop]')

      expect([...loop.classList]).toContain('on')
    })

    test('update loop playback property value', () => {
      const core = new Core({})
      const playback = new Playback({})
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)
      core.activeContainer = new Container({ playerId: 1, playback })

      const loop = plugin.el.querySelector('[data-loop]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      loop.dispatchEvent(evt)

      expect([...loop.classList]).toContain('on')
    })
  })

  describe('copyURL feature', () => {
    test('copy url website at Clappr as embeded', () => {
      const core = new Core({})
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)
      jest.spyOn(plugin, 'copyToClipboard').mockImplementation()

      const copyURL = plugin.el.querySelector('[data-copyURL]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)

      expect(plugin.copyToClipboard).toHaveBeenCalledWith(window.location.href, plugin.$el)
    })
  })

  describe('CopyURLCurrentTime feature', () => {
    test('copy url without query string and put current video time', () => {
      const core = new Core({})
      const playback = new Playback({})
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)
      core.activeContainer = new Container({ playerId: 1, playback })
      jest.spyOn(plugin, 'copyToClipboard').mockImplementation()
      jest.spyOn(plugin.container, 'getCurrentTime').mockImplementation(() => 1)

      const copyURL = plugin.el.querySelector('[data-copyURLCurrentTime]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)
      const expectedURL = `${window.location.href}?t=1`

      expect(plugin.copyToClipboard).toHaveBeenCalledWith(expectedURL, plugin.$el)
    })

    test('copy url with other query string and put current video time', () => {
      const core = new Core({})
      const playback = new Playback({})
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)
      core.activeContainer = new Container({ playerId: 1, playback })
      jest.spyOn(plugin, 'copyToClipboard').mockImplementation()
      window.history.pushState({}, '', `${window.location.href}?other_query_string=0`)
      jest.spyOn(plugin.container, 'getCurrentTime').mockImplementation(() => 1)

      const copyURL = plugin.el.querySelector('[data-copyURLCurrentTime]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)
      const expectedURL = `${window.location.href}&t=1`

      expect(plugin.copyToClipboard).toHaveBeenCalledWith(expectedURL, plugin.$el)
    })

    test('copy url with resume at query string and put current video time', () => {
      const core = new Core({})
      const playback = new Playback({})
      const plugin = new ContextMenuPlugin(core)
      core.addPlugin(plugin)
      core.activeContainer = new Container({ playerId: 1, playback })
      jest.spyOn(plugin, 'copyToClipboard').mockImplementation()
      const sitePageURL = window.location.href
      window.history.pushState({}, '', `${window.location.href}?t=0`)
      jest.spyOn(plugin.container, 'getCurrentTime').mockImplementation(() => 1)

      const copyURL = plugin.el.querySelector('[data-copyURLCurrentTime]')
      const evt = new Event('click', { bubbles: true, cancelable: false })
      copyURL.dispatchEvent(evt)
      const expectedURL = `${sitePageURL}?t=1`

      expect(plugin.copyToClipboard).toHaveBeenCalledWith(expectedURL, plugin.$el)
    })
  })
})
