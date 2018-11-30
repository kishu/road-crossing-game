import { Game } from './game';
import { GameScene } from './scenes/game-scene';

const config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use canvas
  width: 640,
  height: 360,
  scene: GameScene
};

window.onload = () => {
  const game = new Game(config);
};
