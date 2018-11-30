import 'phaser';
import { forEach, head, indexOf, nth, last } from 'lodash';
import arrow from '../assets/images/arrow.png';
import background from '../assets/images/background.png';
// import chicken from '../assets/images/chicken.png';
// import horse from '../assets/images/horse.png';
// import pig from '../assets/images/pig.png';
// import sheep from '../assets/images/sheep3.png';
import chicken_spritesheet from '../assets/images/chicken_spritesheet.png';
import horse_spritesheet from '../assets/images/horse_spritesheet.png';
import pig_spritesheet from '../assets/images/pig_spritesheet.png';
import sheep_spritesheet from '../assets/images/sheep_spritesheet.png';

export class MainScene extends Phaser.Scene {
  private animals: Phaser.GameObjects.Group;
  private currentAnimal: Phaser.GameObjects.Sprite;

  // private chicken: Phaser.GameObjects.Sprite;
  // private horse: Phaser.GameObjects.Sprite;
  // private pig: Phaser.GameObjects.Sprite;
  // private sheep: Phaser.GameObjects.Sprite;

  private leftArrow: Phaser.GameObjects.Sprite;
  private rightArrow: Phaser.GameObjects.Sprite;

  constructor() {
    super({key: 'MainScene'});
  }

  get centerX(): number {
    return this.sys.canvas.width / 2;
  }

  get centerY(): number {
    return this.sys.canvas.height / 2;
  }

  preload() {
    this.load.image('arrow', arrow);
    this.load.image('background', background);
    // this.load.image('chicken', chicken);
    // this.load.image('horse', horse);
    // this.load.image('pig', pig);
    // this.load.image('sheep', sheep);
    this.load.spritesheet('chicken',  chicken_spritesheet, { frameWidth: 131, frameHeight: 200 });
    this.load.spritesheet('horse', horse_spritesheet, { frameWidth: 212, frameHeight: 200 });
    this.load.spritesheet('pig', pig_spritesheet, { frameWidth: 297, frameHeight: 200 });
    this.load.spritesheet('sheep', sheep_spritesheet, { frameWidth: 244, frameHeight: 200 });
  };

  create() {
    const animalData = [
      { key: 'chicken', text: 'CHICKEN' },
      { key: 'horse', text: 'HORSE' },
      { key: 'pig', text: 'PIG' },
      { key: 'sheep', text: 'SHEEP' }
    ];

    this.anims.create({
      key: 'walk',
      // frames: [0, 1, 2, 1, 0, 1],
      frameRate: 3,
      yoyo: true,
      repeat: -1
    });

    this.animals = this.add.group();
    this.add.sprite(0, 0, 'background').setOrigin(0);

    forEach(animalData, element => {
      this.animals
        .create(this.sys.canvas.width * 2, this.centerY, element.key)
        .setOrigin(0.5, 0.5)
        .anims.load('walk')
        .setData({text: element.text})
        .setInteractive({ pixelPerfect: true })
        .on('pointerdown', this.animateAnimal);
    });

    this.currentAnimal = head(this.animals.getChildren()) as Phaser.GameObjects.Sprite;
    this.currentAnimal.setPosition(this.centerX, this.centerY);

    // this.chicken = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'chicken');
    // this.chicken.setScale(2, 1);
    //
    // this.horse = this.add.sprite(120, 50, 'horse');
    // this.horse.setScale(0.5);

    // this.pig = this.add.sprite(centerX, centerY, 'pig').setOrigin(0.5);
    // this.pig.setInteractive({ pixelPerfect: true });
    // this.pig.setScale(-1, 1);

    // this.sheep = this.add.sprite(150, 150, 'sheep');
    // this.sheep.angle = 90;

    this.leftArrow = this.add.sprite(60, this.centerY, 'arrow');
    this.leftArrow.setScale(-1);
    // @ts-ignore
    this.leftArrow.setData({direction: -1});
    this.leftArrow.setInteractive({ pixelPerfect: true });

    this.rightArrow = this.add.sprite(580, this.centerY, 'arrow');
    // @ts-ignore
    this.rightArrow.setData({direction: 1});
    this.rightArrow.setInteractive({ pixelPerfect: true });

    forEach([this.leftArrow, this.rightArrow],(arrow) => {
      arrow.on('pointerdown', this.switchAnimal)
    });
  }

  update() {
    // this.sheep.angle += 0.5;
  }

  animateAnimal() {
    console.log('animate');
  }

  switchAnimal(e: PointerEvent) {
    // this는 이벤트 타겟 즉 leftArrow 또는 rightArrow
    // MainScene 컨텍스트 접근은??
    const scene: MainScene = this.scene as any;

    if (scene.tweens.isTweening(scene.currentAnimal)) {
      return;
    }

    const animals: Array<Phaser.GameObjects.Sprite> = scene.animals.getChildren() as any;
    const currentIdx = indexOf(animals, scene.currentAnimal);
    const canvas = scene.sys.canvas;

    let nextAnimal;
    let startX, endX;

    if (this.data.get('direction') > 0) {
      nextAnimal = nth(animals, currentIdx + 1) || head(animals);
      startX = -nextAnimal.width;
      endX = canvas.width + scene.currentAnimal.width;
    } else {
      nextAnimal = nth(animals, currentIdx - 1) || last(animals);
      startX = canvas.width + nextAnimal.width;
      endX = 0 - scene.currentAnimal.width;
    }

    //scene.currentAnimal.setPosition(canvas.width);
    nextAnimal.setPosition(startX, scene.centerY);

    scene.tweens.add({
      targets: scene.currentAnimal,
      x: endX
    });

    scene.tweens.add({
      targets: nextAnimal,
      x: scene.centerX
    });


    scene.currentAnimal = nextAnimal;
  }
}
