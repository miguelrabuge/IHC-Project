import io from "socket.io-client";

import playSprite from '../assets/sprites/play.png';
import Player  from "../util/Player";
import { CTTS } from "../constants";

export default class IntroScene extends Phaser.Scene {
    constructor () {
        super(CTTS.SCENES.INTROSCENE.NAME);
    }

    preload () {
        this.load.image(CTTS.SPRITES.PLAYBUTTON, playSprite);
    }
      
    create () {
        // Play Button
        this.playBtn = this.add.sprite(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT/2, CTTS.SPRITES.PLAYBUTTON).setInteractive()
        // Event: On Play Button Click
        this.playBtn.on('pointerdown', () => {
            // Create Websocket
            this.socket = io('http://' + CTTS.SERVER.IP + ':' + CTTS.SERVER.PORT, { transports : ['websocket'] });
            // Connect to Server
            this.socket.on('connect', () => {
                console.log("Connected to Server on : " + "http://" + CTTS.SERVER.IP + ":" + CTTS.SERVER.PORT)
                // Get player initial (randomized) information
                this.socket.emit("InitializeInfo", (data) => {
                    // Create the Player
                    this.player = new Player(data.player.x, data.player.y, data.player.lifePoints, this.socket);
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
    }
}