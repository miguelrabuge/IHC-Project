import { CTTS } from "../constants";

export default class IntroScene extends Phaser.Scene {
    constructor (){
        super();
    }

    preload (){
        console.log(CTTS.CANVAS.HEIGHT)
    }
      
    create () {

    }
}