import { CTTS } from "../constants";
import io from "socket.io-client";
import playSprite from '../assets/sprites/play.png';

export default class IntroScene extends Phaser.Scene {
    constructor (){
        super(CTTS.SCENES.INTROSCENE.NAME);
    }

    preload (){
        this.load.image(CTTS.SPRITES.PLAYBUTTON, playSprite);
    }
      
    create () {
        this.playBtn = this.add.sprite(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT/2, CTTS.SPRITES.PLAYBUTTON).setInteractive()
        this.playBtn.on('pointerdown', () => {
            try {
                this.socket = io('http://' + CTTS.SERVER.IP + ':' + CTTS.SERVER.PORT, { transports : ['websocket'] });
                this.socket.on('connect', () => console.log("Connected to Server!"));
                var config = {
                    target: CTTS.SCENES.GAMESCENE.NAME,
                    duration: 0,
                    // onUpdate: (progress) => CTTS.SCENES.TRANSITION.ANIMATION.FADE(progress, this.playBtn),
                    moveBelow: true,
                };
                this.scene.transition(config);
            } catch {
                console.log("Couldn't connect to server. Perhaps check if it is up and running.")
            }
        });
    }
}