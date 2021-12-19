export const CTTS = {
    CANVAS: {
        WIDTH: 128*4,
        HEIGHT: 128*6
    },
    SERVER: {
        IP: "192.168.1.9",
        PORT: "3000"
    },
    SPRITES: {
        PLAYBUTTON: 'play-button',
        HOWTOPLAYBUTTON: 'how-to-play-button',
        SETTINGSBUTTON: 'settings-button',
        MAINMENUBUTTON: 'main-menu-button',
        CLOCK: 'clock',
        BOX: 'box',
        BIGBOX: 'big-box',
        MENUBACKGROUND: "menu-background",
        BACKGROUND: 'background',
        HEART: 'heart',
        SWORD: 'sword',
        MOVE: 'move',
        SCYTHE: 'scythe', 
        SOW: 'sow',
        SAVE: 'save',
        XP: 'XP',
        ENCOUNTER: 'encounter',
        FLEE: 'flee',
        FIGHT: 'fight',
        SHARE: 'share',
        STEAL: 'steal',
        PLAYER: 'player',
        ENEMY: 'enemy',
        ANIMATION: {
            SCALE : (obj, scale) => {obj.setScale(scale)}
        }
    },
    COLORS: {
        WHITE: 0xffffff,
        BLACK: 0x000000,
        RED: 0xff0000,
        GREEN: 0x00ff00,
        BLUE: 0x0000ff,
        YELLOW: 0xffff00
    },
    SCENES: {
        TRANSITION: {
            TIME: 2000,
            ANIMATION: {
                FADE: (progress, obj) => {                                
                    if (progress >= 0.5) {
                        obj.alpha = 1 - 4 * (progress - 0.5) ** 2;
                    }
                }
            }
        },
        INTROSCENE: {
            NAME: "IntroScene",

        },
        GAMESCENE: {
            NAME: "GameScene",
            SCREEN: {
                WIDTH: 128*3,
                HEIGHT: 128*3
            }
        },
        SCORESCENE: {
            NAME: "ScoreScene"
        },
        HOWTOPLAYSCENE: {
            NAME: "HowToPlayScene",
            TEXT: ""
        },
        SETTINGSSCENE: {
            NAME: "SettingsScene",
        }
    }
};
