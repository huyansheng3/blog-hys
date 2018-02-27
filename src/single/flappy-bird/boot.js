import Phaser from 'phaser'

let loading
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
    })
  }
  preload() {
    this.load.image('loading', require('./assets/preloader.gif'))
  }
  create() {
    const height = this.sys.game.config.height
    loading = this.add.image(0, height / 2, 'loading').setOrigin(0, 0.5)
    // window.onresize = () => {
    //   this.sys.game.renderer.resize(window.innerWidth, window.innerHeight, 1.0)
    // }

    this.scene.start('PreloadScene')
  }

  update() {
    loading.width += 60
  }
}
