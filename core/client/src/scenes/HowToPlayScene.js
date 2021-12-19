
import { CTTS } from "../constants";

import mainMenuImg from '../assets/sprites/mainmenu.png';
import bigBoxImg from '../assets/sprites/biginfobox.png'
import menuBackgroundImg from '../assets/sprites/menubackground.png';

export default class HowToPlayScene extends Phaser.Scene {
    constructor () {
        super(CTTS.SCENES.HOWTOPLAYSCENE.NAME);
    }
    
    preload() {
        this.load.image(CTTS.SPRITES.MENUBACKGROUND, menuBackgroundImg);
        this.load.image(CTTS.SPRITES.MAINMENUBUTTON, mainMenuImg);
        this.load.image(CTTS.SPRITES.BIGBOX, bigBoxImg);
    }
    
    create() {
        // Background
        this.background = this.add.sprite(0,0,CTTS.SPRITES.MENUBACKGROUND).setOrigin(0).setScale(2,2)

        // Title
        this.title = this.add.text(CTTS.CANVAS.WIDTH / 2, CTTS.CANVAS.HEIGHT * 0.05 , "How To Play", {strokeThickness: 3, color: "#823f05", fontSize: 50}).setOrigin(0.5)

        // Body Text
        this.text = "           There are 3 basic abilities:\n\n"           +
                    "              - Sow      (-33% LP)\n"                  +
                    "              - Harvest  (+ LP)\n"                     +
                    "              - Save     (LP -> XP)\n\n"               +
                    "              The first 2 abilities \n"                +
                    "             allow you to plant and \n"                +
                    "           collect lifepoints. The third\n"            +
                    "          one converts lifepoints into XP\n\n"         +
                    "  The player with most XP points wins the game\n"      +
                    "  If a player gets down to 0 lifepoints, loses\n\n"    +
                    "  When 2 players meet in a cell, there is an\n"        + 
                    "  encounter event. The first player to choose\n"       + 
                    "  forces one of the following actions:\n\n"            +
                    "  - Share: Both give half LP to one another\n"         +
                    "  - Fight: Both spend 50% LP. One wins and\n"          +
                    "           takes 50% of the sum\n"                     +
                    "  - Flee: Lose 25% LP and leave the encounter\n"       +
                    "          Other may find it with 20% Pb\n"             +
                    "  - Steal: 25% Pb to steal 25% LP. Else lose\n\n"      +
                    "     When the clock reaches 0, the game ends"          ;
                    
        this.box = this.add.sprite(CTTS.CANVAS.WIDTH /2 , CTTS.CANVAS.HEIGHT /2, CTTS.SPRITES.BIGBOX)
        this.body = this.add.text(CTTS.CANVAS.WIDTH * 0.01, CTTS.CANVAS.HEIGHT * 0.20, this.text, {strokeThickness: 1, fontSize: 16, color: "#000000"})
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