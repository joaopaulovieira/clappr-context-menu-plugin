const playerElement = document.getElementById('player-wrapper')

const player = new Clappr.Player({
  source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  playback: { controls: true },
  plugins: [window.ContextMenuPlugin],
})

player.attachTo(playerElement)
