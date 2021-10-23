import swordImg from '../assets/sprites/sword.png';
import moveImg from '../assets/sprites/move.png';
import { CTTS } from '../constants';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene")
    }

    preload() {
        console.log("Hey GameScene")

        this.load.image(CTTS.SPRITES.SWORD, swordImg);
        this.load.image(CTTS.SPRITES.MOVE, moveImg);

        this.moveBtns = {
            up : {
                x: 16 + 64 + 14, 
                y: CTTS.CANVAS.WIDTH/2 + CTTS.SCENES.GAMESCENE.SCREEN.WIDTH/2 + 32,
                angle: 0,
                flipX: false, 
                handle : null
            },
            left : {
                x: 16 + 32,
                y: CTTS.CANVAS.WIDTH/2 + CTTS.SCENES.GAMESCENE.SCREEN.WIDTH/2 + 32 + 48,
                angle: -90,
                flipX: true,
                handle : null
            },
            down : {
                x: 16 + 64 + 14,
                y: CTTS.CANVAS.WIDTH/2 + CTTS.SCENES.GAMESCENE.SCREEN.WIDTH/2 + 32 + 64 + 32,
                angle: 180,
                flipX: true,
                handle : null
            },
            right: {
                x: 16 + 32 + 64 + 14*2,
                y: CTTS.CANVAS.WIDTH/2 + CTTS.SCENES.GAMESCENE.SCREEN.WIDTH/2 + 32 + 48,
                angle: 90,
                flipX: false,
                handle : null
            }
        }
    }

    create() {
        // Control Text
        this.moveText = this.add.text(CTTS.CANVAS.WIDTH/2,0, "Next Action: None").setOrigin(0.5,0);
        
        // GameScreen
        this.gameScreen = this.add.rectangle(
            CTTS.CANVAS.WIDTH/2,
            CTTS.CANVAS.HEIGHT * 0.35,
            CTTS.SCENES.GAMESCENE.SCREEN.WIDTH,
            CTTS.SCENES.GAMESCENE.SCREEN.HEIGHT,
            0x00ff00
        )
        
        /* Actions */
        this.add.sprite(CTTS.CANVAS.WIDTH/2 - 32, CTTS.CANVAS.HEIGHT* 0.75, CTTS.SPRITES.SWORD)
            .setInteractive()
            .on('pointerover', () => {this.moveText.setText("Next Action: Share")});
        this.add.text(CTTS.CANVAS.WIDTH/2 - 32, CTTS.CANVAS.HEIGHT* 0.75 + 48 , "Share").setOrigin(0.5,0.5)

        this.add.sprite(CTTS.CANVAS.WIDTH/2 + 32 + 16, CTTS.CANVAS.HEIGHT* 0.75, CTTS.SPRITES.SWORD)
            .setInteractive()
            .on('pointerover', () => {this.moveText.setText("Next Action: Fight")});
        this.add.text(CTTS.CANVAS.WIDTH/2 + 32 + 16, CTTS.CANVAS.HEIGHT* 0.75 + 48 , "Fight").setOrigin(0.5,0.5)

        this.add.sprite(CTTS.CANVAS.WIDTH/2 + 32 + 16 + 64 + 16, CTTS.CANVAS.HEIGHT* 0.75, CTTS.SPRITES.SWORD)
            .setInteractive()
            .on('pointerover', () => {this.moveText.setText("Next Action: Flee")});
        this.add.text(CTTS.CANVAS.WIDTH/2 + 32 + 16 + 64 + 16, CTTS.CANVAS.HEIGHT* 0.75 + 48 , "Flee").setOrigin(0.5,0.5)

        this.add.sprite(CTTS.CANVAS.WIDTH/2 + 32 + 16 + 64 + 16 + 64+16, CTTS.CANVAS.HEIGHT* 0.75, CTTS.SPRITES.SWORD)
            .setInteractive()
            .on('pointerover', () => {this.moveText.setText("Next Action: Steal")});
        this.add.text(CTTS.CANVAS.WIDTH/2 + 32 + 16 + 64 + 16 + 64+16, CTTS.CANVAS.HEIGHT* 0.75 + 48 , "Steal").setOrigin(0.5,0.5)
        

        this.add.sprite(CTTS.CANVAS.WIDTH/2 - 32 +64 +16, CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16, CTTS.SPRITES.SWORD)
            .setInteractive()
            .on('pointerover', () => {this.moveText.setText("Next Action: Harvest")});
        this.add.text(CTTS.CANVAS.WIDTH/2 - 32 +64 +16, CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16 + 48 , "Harvest").setOrigin(0.5,0.5)
        
        this.add.sprite(CTTS.CANVAS.WIDTH/2 + 32 + 16 +64 +16, CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16, CTTS.SPRITES.SWORD)
            .setInteractive()
            .on('pointerover', () => {this.moveText.setText("Next Action: Sow")});
        this.add.text(CTTS.CANVAS.WIDTH/2 + 32 + 16 +64 +16, CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16 + 48 , "Sow").setOrigin(0.5, 0.5)

        this.add.sprite(CTTS.CANVAS.WIDTH/2 + 32 + 16 + 64 + 16 +64 +16, CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16, CTTS.SPRITES.SWORD)
            .setInteractive()
            .on('pointerover', () => {this.moveText.setText("Next Action: Save")});
        this.add.text(CTTS.CANVAS.WIDTH/2 + 32 + 16 + 64 + 16 +64 +16, CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16 + 48 , "Save").setOrigin(0.5, 0.5)


        /* Move Buttons */
        for (const move in this.moveBtns) {
            this.moveBtns[move].handle = this.add.sprite(this.moveBtns[move].x, this.moveBtns[move].y, CTTS.SPRITES.MOVE)
                .setAngle(this.moveBtns[move].angle)
                .setFlipX(this.moveBtns[move].flipX)
                .setInteractive()
                .on('pointerout',  () => CTTS.SPRITES.ANIMATION.SCALE(this.moveBtns[move].handle, 1.00))
                .on('pointerover', () => {
                        CTTS.SPRITES.ANIMATION.SCALE(this.moveBtns[move].handle, 0.95);
                        this.moveText.setText("Next Action: Move " + move);
                    }
                );
        }
    }
}