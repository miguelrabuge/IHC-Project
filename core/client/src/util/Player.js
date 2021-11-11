export default class Player {
    constructor(x, y, lifePoints, xp, socket){
        this.x = x;
        this.y = y;
        this.lifePoints = lifePoints;
        this.xp = xp
        this.socket = socket;
        console.log(this)
    }

    setLifePoints(lifePoints){
        this.lifePoints = lifePoints;
    }
}