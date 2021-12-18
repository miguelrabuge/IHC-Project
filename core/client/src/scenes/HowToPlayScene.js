
import { CTTS } from "../constants";

import mainMenuImg from '../assets/sprites/mainmenu.png';
import menuBackgroundImg from '../assets/sprites/menubackground.png';

export default class HowToPlayScene extends Phaser.Scene {
    constructor () {
        super(CTTS.SCENES.HOWTOPLAYSCENE.NAME);
    }
    
    preload() {
        this.load.image(CTTS.SPRITES.MENUBACKGROUND, menuBackgroundImg);
        this.load.image(CTTS.SPRITES.MAINMENUBUTTON, mainMenuImg);
    }
    
    create() {
        // Background
        this.background = this.add.sprite(0,0,CTTS.SPRITES.MENUBACKGROUND).setOrigin(0).setScale(2,2)

        // Title
        this.title = this.add.text(CTTS.CANVAS.WIDTH / 2, CTTS.CANVAS.HEIGHT * 0.05 , "How To Play", {strokeThickness: 3, color: "#823f05", fontSize: 50}).setOrigin(0.5)

        // Body Text
        this.text = "Here we explain how to play:\n" +
                    "this is how to break a line\n" ;
        this.body = this.add.text(CTTS.CANVAS.WIDTH * 0.01, CTTS.CANVAS.HEIGHT * 0.20, this.text, {strokeThickness: 1, fontSize: 20,color: "#ffffff"})
        
        // Main Menu Button
        this.mainMenuBtn = this.add.sprite(CTTS.CANVAS.WIDTH / 2, CTTS.CANVAS.HEIGHT * 0.92, CTTS.SPRITES.MAINMENUBUTTON)
            .setInteractive()
            .on("pointerover",() => {
                var config = {
                    target: CTTS.SCENES.INTROSCENE.NAME,
                    duration: 0,
                    moveBelow: true,
                };
                this.scene.transition(config);
            })
    }

}