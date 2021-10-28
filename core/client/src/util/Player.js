export default class Player {
    constructor(x, y, lifePoints, socket){
        this.x = x;
        this.y = y;
        this.lifePoints = lifePoints;
        this.socket = socket;
        console.log(this)
    }

    setLifePoints(lifePoints){
        this.lifePoints = lifePoints;
    }
}