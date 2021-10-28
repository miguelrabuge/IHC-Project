export const CTTS = {
    CANVAS: {
        WIDTH: 64*2*4,
        HEIGHT: 64*2*5
    },
    SERVER: {
        IP: "192.168.8.139",
        PORT: "3000"
    },
    SPRITES: {
        PLAYBUTTON: 'play',
        SWORD: 'sword',
        MOVE: 'move',
        SCYTHE: 'scythe', 
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
        }
    }
};