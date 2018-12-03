import background from '../assets/im/background.png';
import dragon from '../assets/im/dragon.png';
import treasure from '../assets/im/treasure.png';
import player from '../assets/im/player.png';

// init() -> preload() -> create() -> update()
export class GameScene extends Phaser.Scene {
  private enemy: Phaser.GameObjects.Sprite;
  private enemies: Phaser.GameObjects.Group;
  private goal: Phaser.GameObjects.Sprite;
  private player: Phaser.GameObjects.Sprite;

  private enemyMaxY: number;
  private enemyMinY: number;
  private enemyMaxSpeed: number;
  private enemyMinSpeed: number;

  private playerSpeed: number;

  private isTerminating: boolean;

  constructor() {
    super({
      key: 'Game'
    })
  }

  init() {
    this.enemyMaxSpeed = 3;
    this.enemyMinSpeed = 1;
    this.enemyMaxY = 280;
    this.enemyMinY = 80;

    this.playerSpeed = 3;

    // we are not terminating;
    this.isTerminating = false;
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

    // enemy group
    this.enemies = this.add.group();
    this.enemies.createFromConfig({
      key: 'enemy',
      repeat: 4,
      setXY: {
        x: 120,
        y: 100,
        stepX: 95,
        stepY: 20
      }
    });

    // setting scale to all group elements
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);

    // set flipX, and speed
    Phaser.Actions.Call(this.enemies.getChildren(), (enemy: Phaser.GameObjects.Sprite) => {
      const dir = Math.random() > 0.5 ? 1 : -1;
      const speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);

      enemy.setFlipX(true);
      enemy.setData('speed', dir * speed);
    }, this);

    this.goal = this.add.sprite(width - 80, height / 2,  'goal').setScale(0.6);
    this.player = this.add.sprite(40, height / 2, 'player').setScale(0.5);
  }

  // this is called up to 60 times per second
  update() {
    // don't excute if we are terminating
    if (this.isTerminating) {
      return;
    }

    // check for active input
    if (this.input.activePointer.isDown) {
      this.player.x += this.playerSpeed;
    }

    const playerRect = this.player.getBounds();

    // check treasure overlap
    const treasureRect = this.goal.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
      return this.gameOver();
    }

    // enemy movement
    const enemies = this.enemies.getChildren() as Array<Phaser.GameObjects.Sprite>;
    const numEnemies = enemies.length;

    for (let i = 0; i < numEnemies; i++) {
      const enemy = enemies[i];
      const enemySpeed = enemy.getData('speed');
      const enemyRect = enemy.getBounds();

      enemies[i].y += enemySpeed;

      //check we haven't passed max or min Y
      const conditionDown = enemySpeed > 0 && enemy.y >= this.enemyMaxY;
      const conditionUp = enemySpeed < 0 && enemy.y <= this.enemyMinY;

      // if we passed the upper or lower limit, reverse
      if (conditionDown || conditionUp ) {
        enemy.setData('speed', enemySpeed * -1);
      }

      if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
        return this.gameOver();
      }
    }
  }

  gameOver() {
    // initiated game over sequence
    this.isTerminating = true;

    this.cameras.main.shake(500);

    this.cameras.main.on('camerashakecomplete', () => {
        this.cameras.main.fade(500);
    });

    this.cameras.main.on('camerafadeoutcomplete', () => {
      this.scene.restart();
    });
  }
}