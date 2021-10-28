import swordImg from '../assets/sprites/sword.png';
import moveImg from '../assets/sprites/move.png';
import scytheImg from '../assets/sprites/scythe.png';
import { CTTS } from "../constants";


export default class GameScene extends Phaser.Scene {
    player;
    worldSize;
    localWorld;
    nextMove;
    moveBtns;

    constructor() {
        super(CTTS.SCENES.GAMESCENE.NAME)
    }

    init(data) {
        this.player = data.player;
        this.worldSize = data.worldSize;
        this.localWorld = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
        this.maxCellLP = data.maxCellLP;
        console.log(data.worldSize)
        this.nextMove = "None";
        this.stopUpdate = false
    }

    preload() {
        this.load.image(CTTS.SPRITES.SWORD, swordImg);
        this.load.image(CTTS.SPRITES.MOVE, moveImg);
        this.load.image(CTTS.SPRITES.SCYTHE, scytheImg);
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

    colors(cell) {
        var range = [0xffff00, 0xefff00, 0xdfff00, 0xcfff00, 0xbfff00, 0xafff00, 0x9fff00, 0x8fff00, 0x7fff00, 0x6fff00, 0x00ff00]
        if (cell == -1)
            return CTTS.COLORS.BLACK
        if (cell == 0)
            return CTTS.COLORS.WHITE
        var cellNormalized = 100*cell/this.maxCellLP;
        return range[(cellNormalized - cellNormalized%10) / 10]
    }

    create() {
        // Control Text
        this.moveText = this.add.text(CTTS.CANVAS.WIDTH/2,0, "Next Action: None").setOrigin(0.5,0);
        //TODO: Remove this var
        this.local = this.add.text(CTTS.CANVAS.WIDTH - 20*6, 0, `(${this.player.x}, ${this.player.y})`).setOrigin(0.5,0);
        this.local.depth = 20;
        this.lpText = this.add.text(0,0,this.player.lifePoints, {color: "#ff0000"});
        // GameScreen
        this.gameScreen = {
            top: {
                left: this.add.rectangle(CTTS.CANVAS.WIDTH/2 - 128 - 1, CTTS.CANVAS.HEIGHT * 0.35 - 128 - 1, 128, 128, 0xff0000),
                middle: this.add.rectangle(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT * 0.35 - 128 - 1, 128, 128, 0x00ff00),
                right: this.add.rectangle(CTTS.CANVAS.WIDTH/2 + 128 + 1, CTTS.CANVAS.HEIGHT * 0.35 - 128 - 1, 128, 128,0xffff00),
            },
            middle: {
                left: this.add.rectangle(CTTS.CANVAS.WIDTH/2 - 128 - 1, CTTS.CANVAS.HEIGHT * 0.35, 128, 128, 0xff0000),
                middle: this.add.rectangle(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT * 0.35, 128, 128, 0x00ff00),
                right: this.add.rectangle(CTTS.CANVAS.WIDTH/2 + 128 + 1, CTTS.CANVAS.HEIGHT * 0.35, 128, 128,0xffff00),
            },
            bottom: {
                left: this.add.rectangle(CTTS.CANVAS.WIDTH/2 - 128 - 1, CTTS.CANVAS.HEIGHT * 0.35 + 128 + 1, 128, 128, 0xff0000),
                middle: this.add.rectangle(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT * 0.35 + 128 + 1, 128, 128, 0x00ff00),
                right: this.add.rectangle(CTTS.CANVAS.WIDTH/2 + 128 + 1, CTTS.CANVAS.HEIGHT * 0.35 + 128 + 1, 128, 128,0xffff00),
            }
        }


        /* Actions */ //FIXME:
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
        

        this.add.sprite(CTTS.CANVAS.WIDTH/2 - 32 +64 +16, CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16, CTTS.SPRITES.SCYTHE)
            .setInteractive()
            .on('pointerover', () => {
                this.nextMove = "harvest"
            });
        this.add.text(CTTS.CANVAS.WIDTH/2 - 32 +64 +16, CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16 + 48 , "Harvest").setOrigin(0.5,0.5)
        
        this.add.sprite(CTTS.CANVAS.WIDTH/2 + 32 + 16 +64 +16, CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16, CTTS.SPRITES.SWORD)
            .setInteractive()
            .on('pointerover', () => {
                this.nextMove = "sow";
            });
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
                .on('pointerout',  () => CTTS.SPRITES.ANIMATION.SCALE(this.moveBtns[move].handle, 1))
                .on('pointerover', () => {
                        CTTS.SPRITES.ANIMATION.SCALE(this.moveBtns[move].handle, 0.94);
                        this.moveText.setText("Next Action: Move " + move);
                        this.nextMove = move;  
                    }
                );
        }
        // Update server with player intentions every gametick
        this.player.socket.on("gametick", (info) => {

                this.player.socket.emit("clientInfo", 
                {
                    action: this.nextMove
                }, 
                (newData) => {
                    this.player.x = newData.player.x;
                    this.player.y = newData.player.y;
                    this.player.lifePoints = newData.player.lifePoints;
                    this.localWorld = newData.localWorld;
                    console.log(newData)

                }
                );
                this.nextMove = "None";
            }
        )

        this.player.socket.on("RoundEnded", () => {
            this.player.socket.close()
            this.stopUpdate = true
            var config = {
                target: "ScoreScene",
                duration: 0,
                onUpdate: (progress) => {},
                moveBelow: true,
            };
    this.scene.transition(config);
            
        })
    }

    update() { 
        if (!this.stopUpdate) {
            // Updating Labels
            this.local.setText(`(${this.player.x}, ${this.player.y})`)
            this.moveText.setText("Next Action: " + this.nextMove);
            this.lpText.setText(this.player.lifePoints);
            
            // Activate/Deactivate Arrows
            this.player.x == this.worldSize - 1 ? this.deactivateComponent(this.moveBtns["right"].handle) : this.activateComponent(this.moveBtns["right"].handle);
            this.player.y == this.worldSize - 1 ? this.deactivateComponent(this.moveBtns["down"].handle) : this.activateComponent(this.moveBtns["down"].handle);
            this.player.x == 0 ? this.deactivateComponent(this.moveBtns["left"].handle) : this.activateComponent(this.moveBtns["left"].handle);
            this.player.y == 0 ? this.deactivateComponent(this.moveBtns["up"].handle) : this.activateComponent(this.moveBtns["up"].handle);
            
            // Updating Game Screen tiles
            var i = 0;
            for (const row in this.gameScreen) {
                for (const tile in this.gameScreen[row]) {
                    this.gameScreen[row][tile].fillColor = this.colors(this.localWorld[i++])
                }
            }
        }
    }
        
    activateComponent(component) {
        component.alpha = 1;
        component.setInteractive()
    }

    deactivateComponent(component) {
        component.alpha = 0.5;
        component.disableInteractive();
    }
 }