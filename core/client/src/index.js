import Phaser from 'phaser';
import { CTTS } from './constants';

import IntroScene from './scenes/IntroScene';
import GameScene from './scenes/GameScene';

const config = {
    type: Phaser.CANVAS,
    width: CTTS.CANVAS.WIDTH,
    height: CTTS.CANVAS.HEIGHT,
    scene: [IntroScene, GameScene]
};

const game = new Phaser.Game(config);
