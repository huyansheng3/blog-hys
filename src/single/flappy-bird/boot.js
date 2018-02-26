import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor(opts) {
    super({
      key: 'BootScene',
    })
  }

  preload() {
    this.load.image('loading', require('./assets/preloader.gif'))
  }
  create() {
    this.scene.start('preloadScene')
  }
}
