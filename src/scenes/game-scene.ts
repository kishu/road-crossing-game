import background from '../assets/im/background.png';
import dragon from '../assets/im/dragon.png';
import treasure from '../assets/im/treasure.png';
import player from '../assets/im/player.png';

// init() -> preload() -> create() -> update()
export class GameScene extends Phaser.Scene {
  private enemy1: Phaser.GameObjects.Sprite;
  private enemy2: Phaser.GameObjects.Sprite;
  private player: Phaser.GameObjects.Sprite;

  private playerSpeed: number;

  constructor() {
    super({
      key: 'Game'
    })
  }

  init() {
    this.playerSpeed = 5;
  }

  preload() {
    this.load.image('background', background);
    this.load.image('enemy', dragon);
    this.load.image('goal', treasure);
    this.load.image('player', player);
  }

  create() {
    const height = this.sys.game.config.height as number;
    const width = this.sys.game.config.width as number;

    this.add.sprite(0, 0, 'background').setOrigin(0, 0);
    this.player = this.add.sprite(40, height / 2, 'player').setScale(0.5);
    this.enemy1 = this.add.sprite(250, 180, 'enemy');
    this.enemy2 = this.add.sprite(380, 110, 'enemy');
  }

  // this is called up to 60 times per second
  update() {
    // check for active input
    if (this.input.activePointer.isDown) {
      this.player.x += this.playerSpeed;
    }
  }
}