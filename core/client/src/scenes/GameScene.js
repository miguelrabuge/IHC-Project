import swordImg from '../assets/sprites/sword.png';
import moveImg from '../assets/sprites/move.png';
import scytheImg from '../assets/sprites/scythe.png';
import saveImg from '../assets/sprites/save.png'
import sowImg from '../assets/sprites/sow.png'
import heartImg from '../assets/sprites/heart.png';
import xpImg from '../assets/sprites/XP.png'
import encounterImg from '../assets/sprites/encounter.png';
import playerStancesImg from '../assets/sprites/playersheet.png'
import enemyStancesImg from '../assets/sprites/enemysheet.png'
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

    /* Phaser Init Method */
    
    init(data) {
        this.player = data.player;
        this.worldSize = data.worldSize;
        this.localWorld = [
            {lifePoints: -1, players: []}, {lifePoints: -1, players: []}, {lifePoints: -1, players: []},
            {lifePoints: -1, players: []}, {lifePoints: -1, players: []}, {lifePoints: -1, players: []},
            {lifePoints: -1, players: []}, {lifePoints: -1, players: []}, {lifePoints: -1, players: []}
        ];
        this.maxCellLP = data.maxCellLP;
        this.nextMove = "None";
        this.stopUpdate = true
        this.encounter = false;
    }

    /* Phaser Preload Method */

    preload() {
        this.load.image(CTTS.SPRITES.SWORD, swordImg);
        this.load.image(CTTS.SPRITES.MOVE, moveImg);
        this.load.image(CTTS.SPRITES.SCYTHE, scytheImg);
        this.load.image(CTTS.SPRITES.SOW, sowImg)
        this.load.image(CTTS.SPRITES.SAVE, saveImg)
        this.load.image(CTTS.SPRITES.HEART, heartImg)
        this.load.image(CTTS.SPRITES.XP, xpImg)
        this.load.image(CTTS.SPRITES.ENCOUNTER, encounterImg)
        this.load.spritesheet(CTTS.SPRITES.PLAYER, playerStancesImg, {
            frameHeight: 64,
            frameWidth: 64
        });
        this.load.spritesheet(CTTS.SPRITES.ENEMY, enemyStancesImg, {
            frameHeight: 64,
            frameWidth: 64
        });

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

        this.basicActions = ["harvest", "sow", "save"];
        this.encounterActions = ["share", "fight", "flee", "steal"];

        this.actionBtns = {
            harvest: {
                x: CTTS.CANVAS.WIDTH / 2 - 32 + 64 + 16,
                y: CTTS.CANVAS.HEIGHT * 0.75 + 64 + 16 + 16,
                sprite: CTTS.SPRITES.SCYTHE,
                labelHandler: null,
                spriteHandler: null
            },
            sow: {
                x: CTTS.CANVAS.WIDTH / 2 + 32 + 16 + 64 + 16, 
                y: CTTS.CANVAS.HEIGHT * 0.75 + 64 + 16 + 16,
                sprite: CTTS.SPRITES.SOW,
                labelHandler: null,
                spriteHandler: null
            },
            save: {
                x: CTTS.CANVAS.WIDTH / 2 + 32 + 16 + 64 + 16 + 64 + 16, 
                y: CTTS.CANVAS.HEIGHT * 0.75 + 64 + 16 + 16,
                sprite: CTTS.SPRITES.SAVE,
                labelHandler: null,
                spriteHandler: null
            },
            share: {
                x: CTTS.CANVAS.WIDTH/2 - 32,
                y: CTTS.CANVAS.HEIGHT* 0.75,
                sprite: CTTS.SPRITES.SCYTHE,
                labelHandler: null,
                spriteHandler: null
            },
            fight: {
                x: CTTS.CANVAS.WIDTH / 2 + 32 + 16, 
                y: CTTS.CANVAS.HEIGHT * 0.75,
                sprite: CTTS.SPRITES.SCYTHE,
                labelHandler: null,
                spriteHandler: null
            },
            flee: {
                x: CTTS.CANVAS.WIDTH / 2 + 32 + 16 + 64 + 16, 
                y: CTTS.CANVAS.HEIGHT * 0.75,
                sprite: CTTS.SPRITES.SCYTHE,
                labelHandler: null,
                spriteHandler: null
            },
            steal: {
                x: CTTS.CANVAS.WIDTH / 2 + 32 + 16 + 64 + 16 + 64 + 16,
                y: CTTS.CANVAS.HEIGHT * 0.75,
                sprite: CTTS.SPRITES.SCYTHE,
                labelHandler: null,
                spriteHandler: null
            }
        }
    }
    
    /* Utility Methods */

    activateComponent(component) {
        component.alpha = 1;
        component.setInteractive()
    }

    deactivateComponent(component) {
        component.alpha = 0.5;
        component.disableInteractive();
    }

    colors(cell) { 
        var range = [0xffff00, 0xefff00, 0xdfff00, 0xcfff00, 0xbfff00, 0xafff00, 0x9fff00, 0x8fff00, 0x7fff00, 0x6fff00, 0x00ff00]
        if (cell == -1)
            return CTTS.COLORS.BLACK
        if (cell == 0)
            return CTTS.COLORS.WHITE
        var cellNormalized = 100 * cell / this.maxCellLP;
        return range[(cellNormalized - cellNormalized % 10) / 10]
    }

    /* Phaser Create Method */

    create() {
        /* Control Text */
        this.moveText = this.add.text(CTTS.CANVAS.WIDTH/2,CTTS.CANVAS.HEIGHT*0.65, "Next Action: None").setOrigin(0.5,0);
        //TODO: Remove this var
        this.local = this.add.text(CTTS.CANVAS.WIDTH - 20*6, CTTS.CANVAS.HEIGHT*0.65, `(${this.player.x}, ${this.player.y})`).setOrigin(0.5,0);
        
        /* Lifepoints Sprite and Label */
        this.lpSprite = this.add.sprite(CTTS.CANVAS.WIDTH*0.2,5, CTTS.SPRITES.HEART).setOrigin(0,0).setScale(0.5);
        this.lpText = this.add.text(CTTS.CANVAS.WIDTH*0.2 + 40,13,this.player.lifePoints, {color: "#00ff00"});

        /* XP Sprite and Label */
        this.xpSprite = this.add.sprite(CTTS.CANVAS.WIDTH*0.6, 5, CTTS.SPRITES.XP).setOrigin(0,0).setScale(0.5);
        this.xpText = this.add.text(CTTS.CANVAS.WIDTH*0.6 + 40, 13, this.player.xp, {color: "#5fA0ff"})
        
        /* Player Sprite */
        this.playerSprite = this.add.sprite(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT * 0.35, CTTS.SPRITES.PLAYER).setFrame(1).setDepth(29);
        
        /* GameScreen */
        this.gameScreen = {
            top: {
                left: {
                    rect: this.add.rectangle(CTTS.CANVAS.WIDTH/2 - 128 - 1, CTTS.CANVAS.HEIGHT * 0.35 - 128 - 1, 128, 128, 0xff0000),
                    enemy: this.add.sprite(CTTS.CANVAS.WIDTH/2 - 128 - 1, CTTS.CANVAS.HEIGHT * 0.35 - 128 - 1, CTTS.SPRITES.ENEMY).setFrame(1)
                },
                middle: {
                    rect: this.add.rectangle(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT * 0.35 - 128 - 1, 128, 128, 0x00ff00),
                    enemy: this.add.sprite(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT * 0.35 - 128 - 1, CTTS.SPRITES.ENEMY).setFrame(1)
                },
                right: {
                    rect: this.add.rectangle(CTTS.CANVAS.WIDTH/2 + 128 + 1, CTTS.CANVAS.HEIGHT * 0.35 - 128 - 1, 128, 128,0xffff00),
                    enemy: this.add.sprite(CTTS.CANVAS.WIDTH/2 + 128 + 1, CTTS.CANVAS.HEIGHT * 0.35 - 128 - 1, CTTS.SPRITES.ENEMY).setFrame(1)
                },
            },
            middle: {
                left: {
                    rect: this.add.rectangle(CTTS.CANVAS.WIDTH/2 - 128 - 1, CTTS.CANVAS.HEIGHT * 0.35, 128, 128, 0xff0000),
                    enemy: this.add.sprite(CTTS.CANVAS.WIDTH/2 - 128 - 1, CTTS.CANVAS.HEIGHT * 0.35, CTTS.SPRITES.ENEMY).setFrame(1)
                },
                middle: {
                    rect: this.add.rectangle(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT * 0.35, 128, 128, 0x00ff00),
                    enemy: this.add.sprite(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT * 0.35, CTTS.SPRITES.ENCOUNTER).setDepth(30)
                },
                right: {
                    rect: this.add.rectangle(CTTS.CANVAS.WIDTH/2 + 128 + 1, CTTS.CANVAS.HEIGHT * 0.35, 128, 128,0xffff00),
                    enemy: this.add.sprite(CTTS.CANVAS.WIDTH/2 + 128 + 1, CTTS.CANVAS.HEIGHT * 0.35, CTTS.SPRITES.ENEMY).setFrame(1)
                },
            },
            bottom: {
                left: {
                    rect: this.add.rectangle(CTTS.CANVAS.WIDTH/2 - 128 - 1, CTTS.CANVAS.HEIGHT * 0.35 + 128 + 1, 128, 128, 0xff0000),
                    enemy: this.add.sprite(CTTS.CANVAS.WIDTH/2 - 128 - 1, CTTS.CANVAS.HEIGHT * 0.35 + 128 + 1, CTTS.SPRITES.ENEMY).setFrame(1)
                },
                middle: {
                    rect: this.add.rectangle(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT * 0.35 + 128 + 1, 128, 128, 0x00ff00),
                    enemy: this.add.sprite(CTTS.CANVAS.WIDTH/2, CTTS.CANVAS.HEIGHT * 0.35 + 128 + 1, CTTS.SPRITES.ENEMY).setFrame(1)
                },
                right: {
                    rect: this.add.rectangle(CTTS.CANVAS.WIDTH/2 + 128 + 1, CTTS.CANVAS.HEIGHT * 0.35 + 128 + 1, 128, 128,0xffff00),
                    enemy: this.add.sprite(CTTS.CANVAS.WIDTH/2 + 128 + 1, CTTS.CANVAS.HEIGHT * 0.35 + 128 + 1, CTTS.SPRITES.ENEMY).setFrame(1)
                },
            }
        }

        // Set "Enemies" and Encounter Pop-up Invisible
        for (const row in this.gameScreen) {
            for (const tile in this.gameScreen[row]) {
                this.gameScreen[row][tile].enemy.visible = false;
            }
        }

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

            if (this.encounterActions.includes(action)) {
                this.deactivateComponent(this.actionBtns[action].spriteHandler)
            }
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

        /* Server Communication */

        // On gametick, send selected Action
        this.player.socket.on("gametick", () => {
                this.player.socket.emit("client-info", {action: this.nextMove, encounter: this.encounter});
                this.nextMove = "None";
            }
        );
        
        // After processing all clients, server sends the "tick-update" event, which makes all the clients get the tick information
        // through the "get-tick-update" event callback.
        this.player.socket.on("tick-update", () => {
                this.player.socket.emit("get-tick-update", (data) => {
                        this.encounter = data.player.encounter;
                        this.localWorld = data.localWorld;
                        this.player.x = data.player.x;
                        this.player.y = data.player.y;
                        this.player.lifePoints = data.player.lifePoints;
                        this.player.xp = data.player.xp;
                    }
                )
            }
        );
        
        // When a round ends, the server sends the "round-ended" event, that makes the client disconnect and transition to the ScoreScene
        this.player.socket.on("round-ended", () => {
            this.player.socket.close()
            this.stopUpdate = true
            var config = {
                target: "ScoreScene",
                duration: 0,
                moveBelow: true,
            };
            this.scene.transition(config);
        })
        this.stopUpdate = false;
    }

    update() { 
        if (!this.stopUpdate) {
            // Updating Labels
            this.local.setText(`(${this.player.x}, ${this.player.y})`)
            this.moveText.setText("Next Action: " + this.nextMove);
            this.lpText.setText(this.player.lifePoints);
            this.xpText.setText(this.player.xp)
            
            // Activate / Deactivate Arrows
            this.player.x == this.worldSize - 1 ? this.deactivateComponent(this.moveBtns["right"].handle) : this.activateComponent(this.moveBtns["right"].handle);
            this.player.y == this.worldSize - 1 ? this.deactivateComponent(this.moveBtns["down"].handle) : this.activateComponent(this.moveBtns["down"].handle);
            this.player.x == 0 ? this.deactivateComponent(this.moveBtns["left"].handle) : this.activateComponent(this.moveBtns["left"].handle);
            this.player.y == 0 ? this.deactivateComponent(this.moveBtns["up"].handle) : this.activateComponent(this.moveBtns["up"].handle);
            
            // Updating Game Screen tiles
            var i = 0;
            for (const row in this.gameScreen) {
                for (const tile in this.gameScreen[row]) {
                    this.gameScreen[row][tile].rect.fillColor = this.colors(this.localWorld[i].lifePoints)
                    if (row != "middle" || tile != "middle") {
                        if (this.localWorld[i].players.length > 0) {
                            this.gameScreen[row][tile].enemy.visible = true;
                        } else {
                            this.gameScreen[row][tile].enemy.visible = false;
                        }
                    }
                    i++;
                }
            }

            // Update Encounter related Components
            if (this.encounter != false) {
                this.gameScreen["middle"]["middle"].enemy.visible = true;
                for (const i in this.encounterActions) {
                    this.activateComponent(this.actionBtns[this.encounterActions[i]].spriteHandler);
                }
                for (const i in this.basicActions) {
                    this.deactivateComponent(this.actionBtns[this.basicActions[i]].spriteHandler);
                }
                for(const move in this.moveBtns) {
                    this.deactivateComponent(this.moveBtns[move].handle)
                }
            } else {
                this.gameScreen["middle"]["middle"].enemy.visible = false;
                for (const i in this.encounterActions) {
                    this.deactivateComponent(this.actionBtns[this.encounterActions[i]].spriteHandler);
                }
                for (const i in this.basicActions) {
                    this.activateComponent(this.actionBtns[this.basicActions[i]].spriteHandler);
                }
                for(const move in this.moveBtns) {
                    this.activateComponent(this.moveBtns[move].handle)
                }
            }
        }
    }
 }