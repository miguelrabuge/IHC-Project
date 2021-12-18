import Phaser from 'phaser';
import { CTTS } from './constants';

import IntroScene from './scenes/IntroScene';
import HowToPlayScene from './scenes/HowToPlayScene';
import SettingsScene from './scenes/SettingsScene';
import GameScene from './scenes/GameScene';
import ScoreScene from './scenes/ScoreScene';

const config = {
    type: Phaser.CANVAS,
    width: CTTS.CANVAS.WIDTH,
    height: CTTS.CANVAS.HEIGHT,
    scene: [IntroScene, HowToPlayScene, SettingsScene, GameScene, ScoreScene]
};

const game = new Phaser.Game(config);
