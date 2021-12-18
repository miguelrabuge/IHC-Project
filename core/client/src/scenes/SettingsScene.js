
import { CTTS } from "../constants";

import heartImg from '../assets/sprites/heart.png';
import mainMenuBtn from '../assets/sprites/mainmenu.png';
import menuBackgroundImg from '../assets/sprites/menubackground.png';

export default class SettingsScene extends Phaser.Scene {
    constructor () {
        super(CTTS.SCENES.SETTINGSSCENE.NAME);
    }
    
    init(data) {
        this.volume = 50;
        this.stopUpdate = false;
    }

    preload() {
        this.load.image(CTTS.SPRITES.MENUBACKGROUND, menuBackgroundImg);
        this.load.image(CTTS.SPRITES.MAINMENUBUTTON, mainMenuBtn);
        this.load.image(CTTS.SPRITES.HEART, heartImg);
        var url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsliderplugin.min.js';
        this.load.plugin('rexsliderplugin', url, true);

        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/white-dot.png';
        this.load.image('dot', url);
    }
    
    create() {
        // Background
        this.background = this.add.sprite(0,0,CTTS.SPRITES.MENUBACKGROUND).setOrigin(0).setScale(2,2)

        // Title
        this.title = this.add.text(CTTS.CANVAS.WIDTH / 2, CTTS.CANVAS.HEIGHT * 0.05 , "Settings", {strokeThickness: 3, color: "#823f05", fontSize: 50}).setOrigin(0.5)

        // Sound Slider
        this.volumeText = this.add.text(CTTS.CANVAS.WIDTH * 0.24, CTTS.CANVAS.HEIGHT * 0.30, "Volume", {fontSize: 30}).setOrigin(1,0.5)
        this.volumeLabel = this.add.text(CTTS.CANVAS.WIDTH * 0.85, CTTS.CANVAS.HEIGHT * 0.30, this.volume, {fontSize: 30}).setOrigin(1,0.5)
        this.volumeHeart = this.add.sprite(CTTS.CANVAS.WIDTH * 0.30, CTTS.CANVAS.HEIGHT * 0.30, CTTS.SPRITES.HEART)
            .setScale(0.5)
            .setDepth(10);

        this.volumeHeart.slider = this.plugins.get('rexsliderplugin').add(this.volumeHeart, {
            gap: 0.01,
            value: this.volume / 100,
            endPoints: [
                {
                    x: this.volumeHeart.x,
                    y: this.volumeHeart.y,
                },
                {
                    x: this.volumeHeart.x + 200,
                    y: this.volumeHeart.y
                }
            ],
        });

        this.add.graphics()
            .lineStyle(3, 0xffffff)
            .strokePoints(this.volumeHeart.slider.endPoints);
        
        // Main Menu Button
        this.mainMenuBtn = this.add.sprite(CTTS.CANVAS.WIDTH / 2, CTTS.CANVAS.HEIGHT * 0.92, CTTS.SPRITES.MAINMENUBUTTON)
            .setInteractive()
            .on("pointerover",() => {
                this.stopUpdate = true;
                var config = {
                    target: CTTS.SCENES.INTROSCENE.NAME,
                    duration: 0,
                    moveBelow: true,
                };
                this.scene.transition(config);
            })
    }

    update() {
        if (!this.stopUpdate) {
            this.volume = Math.round(100 * (this.volumeHeart.x - this.volumeHeart.slider.endPoints[0].x) / (this.volumeHeart.slider.endPoints[1].x - this.volumeHeart.slider.endPoints[0].x));
            this.volumeLabel.setText(this.volume)
        }
    }

}  