import swordImg from '../assets/sprites/sword.png';
import moveImg from '../assets/sprites/move.png';
import scytheImg from '../assets/sprites/scythe.png';
import saveImg from '../assets/sprites/save.png'
import sowImg from '../assets/sprites/sow.png'
import heartImg from '../assets/sprites/heart.png';
import xpImg from '../assets/sprites/XP.png'
import playerStancesImg from '../assets/sprites/playersheet.png'
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
        this.load.image(CTTS.SPRITES.SOW, sowImg)
        this.load.image(CTTS.SPRITES.SAVE, saveImg)
        this.load.image(CTTS.SPRITES.HEART, heartImg)
        this.load.image(CTTS.SPRITES.XP, xpImg)
        this.load.spritesheet(CTTS.SPRITES.PLAYER, playerStancesImg, {
            frameHeight: 64,
            frameWidth: 64
        })

        this.moveBtns = {
            up : {
                x: 16 + 64 + 14, 
                y: CTTS.CANVAS.HEIGHT/2 + CTTS.SCENES.GAMESCENE.SCREEN.HEIGHT/2 + 32,
                angle: 0,
                flipX: false, 
                handle : null,
                frame: 0
            },
            down : {
                x: 16 + 64 + 14,
                y: CTTS.CANVAS.HEIGHT/2 + CTTS.SCENES.GAMESCENE.SCREEN.HEIGHT/2 + 32 + 64 + 32,
                angle: 180,
                flipX: true,
                handle : null,
                frame: 1
            },
            right: {
                x: 16 + 32 + 64 + 14*2,
                y: CTTS.CANVAS.HEIGHT/2 + CTTS.SCENES.GAMESCENE.SCREEN.HEIGHT/2 + 32 + 48,
                angle: 90,
                flipX: false,
                handle : null,
                frame: 2
            },
            left : {
                x: 16 + 32,
                y: CTTS.CANVAS.HEIGHT/2 + CTTS.SCENES.GAMESCENE.SCREEN.HEIGHT/2 + 32 + 48,
                angle: -90,
                flipX: true,
                handle : null,
                frame: 3
            }
        }

        this.actionBtns = {
            harvest: {
                x: CTTS.CANVAS.WIDTH/2 - 32 +64 +16,
                y: CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16,
                sprite: CTTS.SPRITES.SCYTHE,
                labelHandler: null,
                spriteHandler: null
            },
            sow: {
                x: CTTS.CANVAS.WIDTH/2 + 32 + 16 +64 +16, 
                y: CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16,
                sprite: CTTS.SPRITES.SOW,
                labelHandler: null,
                spriteHandler: null
            },
            save: {
                x: CTTS.CANVAS.WIDTH/2 + 32 + 16 + 64 + 16 +64 +16, 
                y: CTTS.CANVAS.HEIGHT* 0.75 + 64 + 16 + 16,
                sprite: CTTS.SPRITES.SAVE,
                labelHandler: null,
                spriteHandler: null
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
        this.moveText = this.add.text(CTTS.CANVAS.WIDTH/2,CTTS.CANVAS.HEIGHT*0.65, "Next Action: None").setOrigin(0.5,0);
        //TODO: Remove this var
        this.local = this.add.text(CTTS.CANVAS.WIDTH - 20*6, CTTS.CANVAS.HEIGHT*0.65, `(${this.player.x}, ${this.player.y})`).setOrigin(0.5,0);
        
        // Lifepoints Sprite and Label
        this.lpSprite = this.add.sprite(CTTS.CANVAS.WIDTH*0.2,5, CTTS.SPRITES.HEART).setOrigin(0,0).setScale(0.5);
        this.lpText = this.add.text(CTTS.CANVAS.WIDTH*0.2 + 40,13,this.player.lifePoints, {color: "#00ff00"});

        // XP Sprite and Label
        this.xpSprite = this.add.sprite(CTTS.CANVAS.WIDTH*0.6, 5, CTTS.SPRITES.XP).setOrigin(0,0).setScale(0.5);
        this.xpText = this.add.text(CTTS.CANVAS.WIDTH*0.6 + 40, 13, this.player.xp, {color: "#5fA0ff"})

        
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
        
        // Player Sprite
        this.playerSprite = this.add.sprite(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT * 0.35, CTTS.SPRITES.PLAYER).setFrame(1);
        
        /* Actions */ //FIXME:
        // this.add.sprite(CTTS.CANVAS.WIDTH/2 - 32, CTTS.CANVAS.HEIGHT* 0.75, CTTS.SPRITES.SWORD)
        //     .setInteractive()
        //     .on('pointerover', () => {this.moveText.setText("Next Action: Share")});
        // this.add.text(CTTS.CANVAS.WIDTH/2 - 32, CTTS.CANVAS.HEIGHT* 0.75 + 48 , "Share").setOrigin(0.5,0.5)

        // this.add.sprite(CTTS.CANVAS.WIDTH/2 + 32 + 16, CTTS.CANVAS.HEIGHT* 0.75, CTTS.SPRITES.SWORD)
        //     .setInteractive()
        //     .on('pointerover', () => {this.moveText.setText("Next Action: Fight")});
        // this.add.text(CTTS.CANVAS.WIDTH/2 + 32 + 16, CTTS.CANVAS.HEIGHT* 0.75 + 48 , "Fight").setOrigin(0.5,0.5)

        // this.add.sprite(CTTS.CANVAS.WIDTH/2 + 32 + 16 + 64 + 16, CTTS.CANVAS.HEIGHT* 0.75, CTTS.SPRITES.SWORD)
        //     .setInteractive()
        //     .on('pointerover', () => {this.moveText.setText("Next Action: Flee")});
        // this.add.text(CTTS.CANVAS.WIDTH/2 + 32 + 16 + 64 + 16, CTTS.CANVAS.HEIGHT* 0.75 + 48 , "Flee").setOrigin(0.5,0.5)

        // this.add.sprite(CTTS.CANVAS.WIDTH/2 + 32 + 16 + 64 + 16 + 64+16, CTTS.CANVAS.HEIGHT* 0.75, CTTS.SPRITES.SWORD)
        //     .setInteractive()
        //     .on('pointerover', () => {this.moveText.setText("Next Action: Steal")});
        // this.add.text(CTTS.CANVAS.WIDTH/2 + 32 + 16 + 64 + 16 + 64+16, CTTS.CANVAS.HEIGHT* 0.75 + 48 , "Steal").setOrigin(0.5,0.5)
        
        /* Action Buttons */
        for (const action in this.actionBtns) {
            this.actionBtns[action].labelHandler = this.add.text(this.actionBtns[action].x,this.actionBtns[action].y + 48, action.charAt(0).toUpperCase() + action.slice(1))
                .setOrigin(0.5, 0.5)
            this.actionBtns[action].spriteHandler = this.add.sprite(this.actionBtns[action].x,this.actionBtns[action].y, this.actionBtns[action].sprite)
                .setInteractive()
                .on('pointerover', () => {
                    this.nextMove = action
                    this.actionBtns[action].spriteHandler.setScale(0.94)
                })
                .on('pointerout', () => {
                    this.actionBtns[action].spriteHandler.setScale(1)
                })
        }

        /* Move Buttons */
        for (const move in this.moveBtns) {
            this.moveBtns[move].handle = this.add.sprite(this.moveBtns[move].x, this.moveBtns[move].y, CTTS.SPRITES.MOVE)
                .setAngle(this.moveBtns[move].angle)
                .setFlipX(this.moveBtns[move].flipX)
                .setInteractive()
                .on('pointerout',  () => this.moveBtns[move].handle.setScale(1))
                .on('pointerover', () => {
                        this.moveBtns[move].handle.setScale(0.94);
                        this.moveText.setText("Next Action: Move " + move);
                        this.nextMove = move;
                        this.playerSprite.setFrame(this.moveBtns[move].frame)
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
                    this.player.xp = newData.player.xp;
                    this.localWorld = newData.localWorld;
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
            this.xpText.setText(this.player.xp)
            
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