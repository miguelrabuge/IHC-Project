export default class Player {
    constructor(x, y, socket){
        this.x = x;
        this.y = y;
        this.socket = socket;
        console.log(this)
    }
}