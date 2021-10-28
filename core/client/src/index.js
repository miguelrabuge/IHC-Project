import Phaser from 'phaser';
import { CTTS } from './constants';

import IntroScene from './scenes/IntroScene';
import GameScene from './scenes/GameScene';
import ScoreScene from './scenes/ScoreScene';

const config = {
    type: Phaser.CANVAS,
    width: CTTS.CANVAS.WIDTH,
    height: CTTS.CANVAS.HEIGHT,
    scene: [IntroScene, GameScene, ScoreScene]
};

const game = new Phaser.Game(config);
