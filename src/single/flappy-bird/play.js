import Phaser from 'phaser'

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'PlayScene',
    })
  }

  create() {
    const width = this.sys.game.config.width
    const height = this.sys.game.config.height

    this.background = this.add
      .tileSprite(0, 0, width * 2, width * 2, 'background')
      .setOrigin(0, 0) //背景图
    this.ground = this.add.tileSprite(0, height - 56, width * 2, 112, 'ground') //地板

    this.pipeGroup = this.physics.add.group([
      {
        key: 'pipe',
        frame: 0,
        frameQuantity: 3,
        immovable: true,
        setXY: {
          x: 100,
          y: 0,
          stepX: 50,
        },
      },
      {
        key: 'pipe',
        frame: 1,
        frameQuantity: 3,
        immovable: true,
        setXY: {
          x: 100,
          y: height,
          stepX: 50,
        },
      },
    ])

    console.log(this.pipeGroup)

    this.bird = this.physics.add.sprite(60, 150, 'bird')
    this.bird.anims.play('fly')

    this.bird.setCollideWorldBounds(true).setGravityY(0)

    this.physics.world.enable([this.ground, this.bird])

    // this.physics.enable(this.bird, Phaser.Physics.ARCADE) //开启鸟的物理系统
    // this.bird.body.gravity.y = 0 //鸟的重力,未开始游戏，先先让他不动
    // this.physics.enable(this.ground, Phaser.Physics.ARCADE) //地面
    // this.ground.body.immovable = true //固定不动

    this.soundFly = this.sound.add('fly_sound')
    this.soundScore = this.sound.add('score_sound')
    this.soundHitPipe = this.sound.add('hit_pipe_sound')
    this.soundHitGround = this.sound.add('hit_ground_sound')
    this.scoreText = this.add.bitmapText(width / 2, 60, 'flappy_font', '0', 36)

    this.readyText = this.add.image(width / 2, 60, 'ready_text') //get ready 文字
    this.playTip = this.add.image(width / 2, 300, 'play_tip') //提示点击
    this.hasStarted = false //游戏是否已开始
    this.input.once('pointerdown', this.statrGame, this)
  }
  statrGame() {
    this.gameSpeed = 200 //游戏速度
    this.gameIsOver = false
    this.hasHitGround = false
    this.hasStarted = true
    this.score = 0
    this.bird.setGravityY(1150)
    this.readyText.destroy()
    this.playTip.destroy()
    this.input.on('pointerdown', this.fly, this)
    // this.timedEvent = this.time.addEvent({
    //   delay: 3900,
    //   callback: this.stopGame,
    //   callbackScope: this,
    //   loop: true,
    // })
  }

  stopGame() {
    // this.pipeGroup.forEachExists(function(pipe) {
    //       pipe.body.velocity.x = 0
    //     }, this)
    this.hasStarted = false
    this.timedEvent.remove(false)
    this.bird.anims.stop('fly')
    this.input.off('pointerdown', this.fly, this)
  }

  update() {
    if (!this.hasStarted) return //游戏未开始
    this.background.tilePositionX += 0.2
    this.ground.tilePositionX += 2

    if (this.bird.angle < 90) this.bird.angle += 2.5 //下降时头朝下

    this.physics.world.collide(this.bird, this.ground)
  }

  // generatePipes(gap) {
  //   //制造管道
  //   gap = gap || 100 //上下管道之间的间隙宽度
  //   var position =
  //     505 -
  //     320 -
  //     gap +
  //     Math.floor((505 - 112 - 30 - gap - 505 + 320 + gap) * Math.random())
  //   var topPipeY = position - 360
  //   var bottomPipeY = position + gap
  //   if (this.resetPipe(topPipeY, bottomPipeY)) return
  //   var topPipe = this.add.sprite(
  //     this.width,
  //     topPipeY,
  //     'pipe',
  //     0,
  //     this.pipeGroup
  //   )
  //   var bottomPipe = this.add.sprite(
  //     this.width,
  //     bottomPipeY,
  //     'pipe',
  //     1,
  //     this.pipeGroup
  //   )

  // ]);

  // }

  resetPipe(topPipeY, bottomPipeY) {
    //重置出了边界的管道，做到回收利用
    // var i = 0
    // this.pipeGroup.forEachDead(function(pipe) {
    //   if (pipe.y <= 0) {
    //     //topPipe
    //     pipe.reset(game.width, topPipeY)
    //     pipe.hasScored = false //重置为未得分
    //   } else {
    //     pipe.reset(game.width, bottomPipeY)
    //   }
    //   pipe.body.velocity.x = -this.gameSpeed
    //   i++
    // }, this)
    // return i == 2 //如果 i==2 代表有一组管道已经出了边界，可以回收这组管道了
  }

  fly() {
    // 飞行增加向上的加速度
    this.bird.setVelocityY(-350)
    this.tweens.add({
      targets: this.bird,
      angle: -30,
      duration: 100,
      repeat: 1,
    })
    this.soundFly.play()
  }

  showGameOverText() {
    // this.scoreText.destroy()
    // this.bestScore = this.bestScore || 0
    // if (this.score > this.bestScore) this.bestScore = this.score //最好分数
    // this.gameOverGroup = this.add.group() //添加一个组
    // var gameOverText = this.gameOverGroup.create(this.width / 2, 0, 'game_over') //game over 文字图片
    // var scoreboard = this.gameOverGroup.create(
    //   this.width / 2,
    //   70,
    //   'score_board'
    // ) //分数板
    // var currentScoreText = this.add.bitmapText(
    //   this.width / 2 + 60,
    //   105,
    //   'flappy_font',
    //   this.score + '',
    //   20,
    //   this.gameOverGroup
    // ) //当前分数
    // var bestScoreText = this.add.bitmapText(
    //   this.width / 2 + 60,
    //   153,
    //   'flappy_font',
    //   this.bestScore + '',
    //   20,
    //   this.gameOverGroup
    // ) //最好分数
    // var replayBtn = this.add.button(
    //   this.width / 2,
    //   210,
    //   'btn',
    //   function() {
    //     //重玩按钮
    //     this.state.start('play')
    //   },
    //   this,
    //   null,
    //   null,
    //   null,
    //   null,
    //   this.gameOverGroup
    // )
    // gameOverText.anchor.setTo(0.5, 0)
    // scoreboard.anchor.setTo(0.5, 0)
    // replayBtn.anchor.setTo(0.5, 0)
    // this.gameOverGroup.y = 30
  }
}

// function play() {
//   this.update = function() {
//     if (!this.hasStarted) return //游戏未开始
//     game.physics.arcade.collide(
//       this.bird,
//       this.ground,
//       this.hitGround,
//       null,
//       this
//     ) //与地面碰撞
//     game.physics.arcade.overlap(
//       this.bird,
//       this.pipeGroup,
//       this.hitPipe,
//       null,
//       this
//     ) //与管道碰撞
//     if (this.bird.angle < 90) this.bird.angle += 2.5 //下降时头朝下
//     this.pipeGroup.forEachExists(this.checkScore, this) //分数检测和更新
//   }

//   this.stopGame = function() {
//     this.bg.stopScroll()
//     this.ground.stopScroll()
//     this.pipeGroup.forEachExists(function(pipe) {
//       pipe.body.velocity.x = 0
//     }, this)
//     this.bird.animations.stop('fly', 0)
//     game.input.onDown.remove(this.fly, this)
//     game.time.events.stop(true)
//   }

//   this.hitPipe = function() {
//     if (this.gameIsOver) return
//     this.soundHitPipe.play()
//     this.gameOver()
//   }
//   this.hitGround = function() {
//     if (this.hasHitGround) return //已经撞击过地面
//     this.hasHitGround = true
//     this.soundHitGround.play()
//     this.gameOver(true)
//   }
//   this.gameOver = function(show_text) {
//     this.gameIsOver = true
//     this.stopGame()
//     if (show_text) this.showGameOverText()
//   }

//   this.showGameOverText = function() {
//     this.scoreText.destroy()
//     game.bestScore = game.bestScore || 0
//     if (this.score > game.bestScore) game.bestScore = this.score //最好分数
//     this.gameOverGroup = game.add.group() //添加一个组
//     var gameOverText = this.gameOverGroup.create(game.width / 2, 0, 'game_over') //game over 文字图片
//     var scoreboard = this.gameOverGroup.create(
//       game.width / 2,
//       70,
//       'score_board'
//     ) //分数板
//     var currentScoreText = game.add.bitmapText(
//       game.width / 2 + 60,
//       105,
//       'flappy_font',
//       this.score + '',
//       20,
//       this.gameOverGroup
//     ) //当前分数
//     var bestScoreText = game.add.bitmapText(
//       game.width / 2 + 60,
//       153,
//       'flappy_font',
//       game.bestScore + '',
//       20,
//       this.gameOverGroup
//     ) //最好分数
//     var replayBtn = game.add.button(
//       game.width / 2,
//       210,
//       'btn',
//       function() {
//         //重玩按钮
//         game.state.start('play')
//       },
//       this,
//       null,
//       null,
//       null,
//       null,
//       this.gameOverGroup
//     )
//     gameOverText.anchor.setTo(0.5, 0)
//     scoreboard.anchor.setTo(0.5, 0)
//     replayBtn.anchor.setTo(0.5, 0)
//     this.gameOverGroup.y = 30
//   }

//   this.resetPipe = function(topPipeY, bottomPipeY) {
//     //重置出了边界的管道，做到回收利用
//     var i = 0
//     this.pipeGroup.forEachDead(function(pipe) {
//       if (pipe.y <= 0) {
//         //topPipe
//         pipe.reset(game.width, topPipeY)
//         pipe.hasScored = false //重置为未得分
//       } else {
//         pipe.reset(game.width, bottomPipeY)
//       }
//       pipe.body.velocity.x = -this.gameSpeed
//       i++
//     }, this)
//     return i == 2 //如果 i==2 代表有一组管道已经出了边界，可以回收这组管道了
//   }

//   this.checkScore = function(pipe) {
//     //负责分数的检测和更新
//     if (!pipe.hasScored && pipe.y <= 0 && pipe.x <= this.bird.x - 17 - 54) {
//       pipe.hasScored = true
//       this.scoreText.text = ++this.score
//       this.soundScore.play()
//       return true
//     }
//     return false
//   }
// }
