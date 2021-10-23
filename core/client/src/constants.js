export const CTTS = {
    CANVAS: {
        WIDTH: 64*2*4,
        HEIGHT: 64*2*5
    },
    SERVER: {
        IP: "localhost",
        PORT: "3000"
    },
    SPRITES: {
        PLAYBUTTON: 'play',
        SWORD: 'sword',
        MOVE: 'move',
        ANIMATION: {
            SCALE : (obj, scale) => {obj.setScale(scale)}
        }
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