import Phaser from 'phaser'

let background, ground

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'MenuScene',
    })
  }

  create() {
    const width = this.sys.game.config.width
    const height = this.sys.game.config.height
    background = this.add.tileSprite(0, 0, width * 2, height * 2, 'background') //背景图
    ground = this.add.tileSprite(0, height - 56, width * 2, 112, 'ground') //地板

    const titleGroup = this.add.group() //创建存放标题的组
    const title = this.add.image(width / 2, 100, 'title')
    const bird = this.add.sprite(width - 40, 100, 'bird')
    titleGroup.add(title)
    titleGroup.add(bird)

    this.tweens.add({
      targets: [title, bird],
      y: 80,
      duration: 1000,
      yoyo: true,
      loop: -1,
    })

    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bird', {
        start: 0,
        end: 2,
      }),
      frameRate: 16,
      repeat: -1,
    })

    bird.anims.play('fly')

    const btn = this.add.sprite(width / 2, height / 2, 'btn').setInteractive()

    btn.on('pointerdown', pointer => {
      this.scene.start('PlayScene')
    })

    this.scene.start('PlayScene')
  }

  update(time, delta) {
    background.tilePositionX += 0.2
    ground.tilePositionX += 2
  }
}
