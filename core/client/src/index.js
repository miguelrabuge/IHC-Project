import Phaser from 'phaser';
import { CTTS } from './constants';

import IntroScene from './scenes/IntroScene';

const config = {
    type: Phaser.CANVAS,
    width: CTTS.CANVAS.WIDTH,
    height: CTTS.CANVAS.HEIGHT,
    scene: [IntroScene]
};

const game = new Phaser.Game(config);
