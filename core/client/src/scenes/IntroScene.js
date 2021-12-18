import io from "socket.io-client";

import playSprite from '../assets/sprites/play.png';
import howToPlaySprite from '../assets/sprites/howtoplay.png';
import settingsSprite from '../assets/sprites/settings.png';
import Player from "../util/Player";
import backgroundImg from '../assets/sprites/background.png';
import boxImg from '../assets/sprites/infobox.png';
import { CTTS } from "../constants";

export default class IntroScene extends Phaser.Scene {
    constructor () {
        super(CTTS.SCENES.INTROSCENE.NAME);
    }

    preload () {
        this.load.image(CTTS.SPRITES.PLAYBUTTON, playSprite);
        this.load.image(CTTS.SPRITES.HOWTOPLAYBUTTON, howToPlaySprite);
        this.load.image(CTTS.SPRITES.SETTINGSBUTTON, settingsSprite);
        this.load.image(CTTS.SPRITES.BACKGROUND, backgroundImg);
        this.load.image(CTTS.SPRITES.BOX, boxImg);
    }
      
    create () {
        // Background
        this.background = this.add.sprite(0,0,CTTS.SPRITES.BACKGROUND).setOrigin(0).setScale(2,2)

        // EngageX Label
        this.title = this.add.text(CTTS.CANVAS.WIDTH / 2, CTTS.CANVAS.HEIGHT * 0.25, "EngageX", {strokeThickness: 3, color: "#ffffff", fontSize: 70, backgroundColor: "#823f05"} ).setOrigin(0.5,0.5)

        // Play Button
        this.playBtn = this.add.sprite(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT/2, CTTS.SPRITES.PLAYBUTTON)
            .setInteractive()
            .on('pointerover', () => {
                this.playBtn.setScale(0.94)
                // Create Websocket
                this.socket = io('http://' + CTTS.SERVER.IP + ':' + CTTS.SERVER.PORT, { transports : ['websocket'] });
                // Connect to Server
                this.socket.on('connect', () => {
                    console.log("Connected to Server on : " + "http://" + CTTS.SERVER.IP + ":" + CTTS.SERVER.PORT)
                    // Get player initial (randomized) information
                    this.socket.emit("initialize-info", (data) => {
                        // Create the Player
                        this.player = new Player(data.player.x, data.player.y, data.player.lifePoints, data.player.xp, this.socket);
                        // Switch to GameScene
                        var config = {
                            target: CTTS.SCENES.GAMESCENE.NAME,
                            duration: 0,
                            onUpdate: (progress) => CTTS.SCENES.TRANSITION.ANIMATION.FADE(progress, this.playBtn),
                            data: {
                                player: this.player, 
                                worldSize: data.worldSize,
                                maxCellLP: data.maxCellLP
                            },
                            moveBelow: true,
                        };
                        this.scene.transition(config);
                    });
                });
            }
        );

        // How to Play Button
        this.howToPlayBtn = this.add.sprite(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT/2 + 128, CTTS.SPRITES.HOWTOPLAYBUTTON)
            .setInteractive()
            .on("pointerover", () => {
                this.howToPlayBtn.setScale(0.94)
                var config = {
                    target: CTTS.SCENES.HOWTOPLAYSCENE.NAME,
                    duration: 0,
                    moveBelow: true,
                };
                this.scene.transition(config);
            })
        // Settings Button
        this.settingsBtn = this.add.sprite(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT/2 + 128 * 2, CTTS.SPRITES.SETTINGSBUTTON)
            .setInteractive()
            .on("pointerover", () => {
                this.settingsBtn.setScale(0.94)
                var config = {
                    target: CTTS.SCENES.SETTINGSSCENE.NAME,
                    duration: 0,
                    moveBelow: true,
                };
                this.scene.transition(config);
            })
    }
}