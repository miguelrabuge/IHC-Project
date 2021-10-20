import { CTTS } from "../constants";
import io from "socket.io-client";

export default class IntroScene extends Phaser.Scene {
    constructor (){
        super();
    }

    preload (){
        console.log(CTTS.CANVAS.HEIGHT)
    }
      
    create () {
        this.socket = io('http://localhost:3000', { transports : ['websocket'] });
        this.socket.on('connect', function () {
            console.log("Connected!")
        })
    }
}