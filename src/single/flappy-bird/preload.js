import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'PreloadScene',
    })
  }

  preload() {
    console.log('PreloadScene preload')
    const preloadSprite = this.add.sprite(
      35,
      this.sys.game.config.height / 2,
      'loading'
    )
    // this.load.setPreloadSprite(preloadSprite)

    //以下为要加载的资源
    this.load.image('background', require('./assets/background.png')) //背景
    this.load.image('ground', require('./assets/ground.png')) //地面
    this.load.image('title', require('./assets/title.png')) //游戏标题
    this.load.spritesheet('bird', require('./assets/bird.png'), {
      frameWidth: 34,
      frameHeight: 24,
    }) //鸟
    this.load.image('btn', require('./assets/start-button.png')) //按钮
    this.load.spritesheet('pipe', require('./assets/pipes.png'), {
      frameWidth: 54,
      frameHeight: 320,
      endFrame: 2,
    }) //管道
    this.load.bitmapFont(
      'flappy_font',
      require('./assets/fonts/flappyfont/flappyfont.png'),
      require('./assets/fonts/flappyfont/flappyfont.fnt')
    )
    this.load.audio('fly_sound', require('./assets/flap.wav')) //飞翔的音效
    this.load.audio('score_sound', require('./assets/score.wav')) //得分的音效
    this.load.audio('hit_pipe_sound', require('./assets/pipe-hit.wav')) //撞击管道的音效
    this.load.audio('hit_ground_sound', require('./assets/ouch.wav')) //撞击地面的音效

    this.load.image('ready_text', require('./assets/get-ready.png'))
    this.load.image('play_tip', require('./assets/instructions.png'))
    this.load.image('game_over', require('./assets/gameover.png'))
    this.load.image('score_board', require('./assets/scoreboard.png'))
  }

  create() {
    console.log('PreloadScene create')
    this.scene.start('MenuScene')
  }
}
