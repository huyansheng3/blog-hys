import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    })
  }
  preload() {
    console.log('BootScene preload')
    this.load.image('loading', require('./assets/preloader.gif'))
  }
  create() {
    window.onresize = function() {
      this.sys.game.renderer.resize(window.innerWidth, window.innerHeight, 1.0)
    }
    console.log('BootScene create')
    this.scene.start('PreloadScene')
  }
}
