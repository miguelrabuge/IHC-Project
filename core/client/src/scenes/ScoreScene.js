
import { CTTS } from "../constants";
import mainMenuImg from '../assets/sprites/mainmenu.png';
import boxImg from '../assets/sprites/infobox.png'
import menuBackgroundImg from '../assets/sprites/menubackground.png';

export default class ScoreScene extends Phaser.Scene {
    constructor () {
        super(CTTS.SCENES.SCORESCENE.NAME);
    }
    
    init(data) {
        this.firstScore = data.firstScore
        this.myScore = data.myScore;
        this.zeroLife = data.zeroLife;
        this.outcome = this.myScore < this.firstScore || this.zeroLife ? "You Lose" : "You Win";
        
    }

    preload() {
        this.load.image(CTTS.SPRITES.MENUBACKGROUND, menuBackgroundImg);
        this.load.image(CTTS.SPRITES.MAINMENUBUTTON, mainMenuImg);
        this.load.image(CTTS.SPRITES.BOX, boxImg);
    }
    
    create() {
        // Background
        this.background = this.add.sprite(0,0,CTTS.SPRITES.MENUBACKGROUND).setOrigin(0).setScale(2,2)

        // Title
        this.title = this.add.text(CTTS.CANVAS.WIDTH / 2, CTTS.CANVAS.HEIGHT * 0.05 , "Score", {strokeThickness: 3, color: "#823f05", fontSize: 50}).setOrigin(0.5)

        // Outcome
        var color = this.outcome == "You Win" ? "#00ff00": "#ff0000"
        this.outcomeBox = this.add.sprite(CTTS.CANVAS.WIDTH / 2, CTTS.CANVAS.HEIGHT * 0.35, CTTS.SPRITES.BOX).setScale(1.2)
        this.outcometext = this.add.text(CTTS.CANVAS.WIDTH / 2, CTTS.CANVAS.HEIGHT * 0.35 , this.outcome, {strokeThickness: 3, color: color, fontSize: 50}).setOrigin(0.5)
        
        // The player score
        this.playerScore = this.add.text(CTTS.CANVAS.WIDTH / 2, CTTS.CANVAS.HEIGHT * 0.50 , `My Score: ${this.myScore}`, {strokeThickness: 3, color: color, fontSize: 35}).setOrigin(0.5)

        // The first player score
        if (this.outcome == "You Lose" && !this.zeroLife)
            this.firstScore = this.add.text(CTTS.CANVAS.WIDTH / 2, CTTS.CANVAS.HEIGHT * 0.60 , `1st Player: ${this.firstScore}`, {strokeThickness: 3, color: "#00ff00", fontSize: 35}).setOrigin(0.5)

        // Main Menu
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