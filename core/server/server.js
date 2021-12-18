const { randomInt } = require('crypto');

/* Server Requirements */
const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);

/* Configs */ 
TICK_LIMIT = 10000
GAMETICK = 200 
WORLDSIZE = 5
LP = 1000
MAX_PLAYERS = 30

class World {
    constructor(worldSize, maxPlayers) {
        this.worldSize = worldSize;
        this.maxPlayers = maxPlayers;
        this.n_playing = 0;
        this.counted_players = 0;
        this.secondToChoose = []
        this.players = {}
        this.map = [];
    }
    
    init() {
        for (var i = 0; i < this.worldSize; i++) {
            this.map[i] = []
            for (var j = 0; j < this.worldSize; j++) {
                this.map[i][j] = this.getCell(0, 0);
            }
        }
    }

    reset() {
        this.map = [];
        this.players = {};
        this.n_playing = 0;
        this.counted_players = 0;
        this.secondToChoose = [];
    }

    getCell(lifePoints, players) {
        return {lifePoints: lifePoints, players: players}
    }
    
    getLocal(x, y, seed) {
        var pos = 0, localWorld = [], v = [-1, 0, 1]
        for (let i = 0; i < v.length; i++) {
            for (let j = 0; j < v.length; j++) {
                if (x + v[j] < 0 || x + v[j] > this.worldSize - 1 || y + v[i] < 0 || y + v[i] > this.worldSize - 1) // If out of world bounds
                    localWorld[pos] = this.getCell(-1, 0);
                else {
                    if (seed) {
                        this.map[y + v[i]][x + v[j]].lifePoints = (this.map[y + v[i]][x + v[j]].lifePoints == 0 ? 3 * LP : this.map[y + v[i]][x + v[j]].lifePoints);
                    } 
                    localWorld[pos] = this.map[y + v[i]][x + v[j]]
                }
                pos++;
            }
        }
        return localWorld
    }

    updatePositions() {
        for (var i = 0; i < this.worldSize; i++) {
            for (var j = 0; j < this.worldSize; j++) {
                this.map[i][j].players = [];
            }
        }
    
        for (var id in this.players) {
            var x = this.players[id].x;
            var y = this.players[id].y;
            this.map[y][x].players.push(id);
            this.players[id].encounter = false;
            if (this.map[y][x].players.length > 1) {
                var player1 = this.map[y][x].players.pop();
                var player2 = this.map[y][x].players.pop();

                this.players[player1].encounter = player2;
                this.players[player2].encounter = player1;
            }
        }
    }

}

/* Global Objects */
rebooting = false;
world = new World(WORLDSIZE, MAX_PLAYERS);


function tickUpdate() {
    world.counted_players = 0;
    world.secondToChoose = [];
    world.updatePositions();
    io.emit("tick-update");
}

/* Server Events */
io.on('connection', (socket) => {
    console.log("A user connected: " + socket.id);
    
    socket.on("initialize-info", (info) => {
            world.players[socket.id] = {
                x: parseInt(WORLDSIZE * Math.random()),
                y: parseInt(WORLDSIZE * Math.random()),
                lifePoints: LP,
                xp: 0,
                encounter: false
            }
            world.n_playing++;
            info({
                player: world.players[socket.id],
                worldSize: WORLDSIZE,
                maxCellLP: LP * MAX_PLAYERS, 
            });
        }
    );

    socket.on("client-info", (data) => {
        world.counted_players++;
        if (!rebooting) {
                world.players[socket.id].action = data.action;
                if (!data.encounter) { // server protection for encounter + basic action
                    if (data.action == "sow") {
                        world.players[socket.id].lifePoints -= parseInt(LP * 0.33);
                    } else if (data.action == "up") {
                        world.players[socket.id].y = Math.max(0, world.players[socket.id].y - 1);
                    } else if (data.action == "down") {
                        world.players[socket.id].y = Math.min(WORLDSIZE - 1, world.players[socket.id].y + 1);
                    } else if (data.action == "left") {
                        world.players[socket.id].x = Math.max(0, world.players[socket.id].x - 1);
                    } else if (data.action == "right") {
                        world.players[socket.id].x = Math.min(WORLDSIZE - 1, world.players[socket.id].x + 1);
                    } else if (data.action == "harvest") {
                        world.players[socket.id].lifePoints += world.map[world.players[socket.id].y][world.players[socket.id].x].lifePoints;
                        world.map[world.players[socket.id].y][world.players[socket.id].x].lifePoints = 0 
                    } else if (data.action == "save") {
                        world.players[socket.id].lifePoints = parseInt(world.players[socket.id].lifePoints * 0.5);
                        world.players[socket.id].xp += world.players[socket.id].lifePoints
                    }
                } else if (data.action != "None" && !world.secondToChoose.includes(socket.id)){
                    world.secondToChoose.push(data.encounter)
                    if (data.action == "flee") {
                        var px = world.players[socket.id].x;
                        var py = world.players[socket.id].y;
                        
                        var vx = [-1, 0, 1];
                        var vy = [-1, 0, 1];
                        if (px == WORLDSIZE - 1)
                            vx.splice(2, 1);
                        else if (px == 0)
                            vx.splice(0, 1);
                        
                        if (py == WORLDSIZE - 1)
                            vy.splice(2, 1);
                        else if (py == 0)
                            vy.splice(0, 1);
                        
                        var combinations = [];
                        for (const i in vx) {
                            for (const j in vy) {
                                if (!(vx[i] == 0 && vy[j] == 0))
                                    combinations.push([vx[i], vy[j]])
                            }
                        }
                        var idx = Math.round(Math.random() * (combinations.length - 1));
                        // Move to Cell
                        world.players[socket.id].x += combinations[idx][0];
                        world.players[socket.id].y += combinations[idx][1];
                        
                        // Lose Life
                        var lostLife = Math.round(world.players[socket.id].lifePoints * 0.25);
                        world.players[socket.id].lifePoints -= lostLife;
                        
                        // Oponent Finds life with 20% probability
                        if (Math.random() <= 0.2)
                            world.players[data.encounter].lifePoints += lostLife;
                    } else if (data.action == "share") {
                        // Get half life from both players
                        var life1 = Math.round(world.players[socket.id].lifePoints / 2);
                        var life2 = Math.round(world.players[data.encounter].lifePoints / 2);

                        // Update (share) players' lives
                        world.players[socket.id].lifePoints += life2 - life1;
                        world.players[data.encounter].lifePoints += life1 - life2;

                    } else if (data.action == "fight") {

                    } else if (data.action == "steal") {

                    }
                }
                    
                // Update Players
                //world.players[socket.id].lifePoints -= LP * 0.01;

                if (world.counted_players == world.n_playing) {
                    tickUpdate();
                }
            }
        }
    )

    socket.on("get-tick-update", (callback) => {
        callback({
            player: world.players[socket.id],
            localWorld: world.getLocal(world.players[socket.id].x, world.players[socket.id].y, world.players[socket.id].action == "sow")
        })
    })

    socket.on("disconnect", () => {
            if (!rebooting && (world.counted_players == --world.n_playing)) {
                tickUpdate();
            }
            delete world.players[socket.id];
            console.log("A user disconnected: " + socket.id);
        }
    );
});
    
http.listen(3000, function () {
    console.log("Server started!");

    var round = 0, newRound = true;

    // Round Function
    var gameRound = function () {
        console.log("Round [" + round + "] Started");
        world.init();
        rebooting = false;
        var tickCounter = 0;
        var tickInterval = setInterval(() => {
            if (++tickCounter == TICK_LIMIT) {
                rebooting = true;
                clearInterval(tickInterval);
                world.reset();
                io.emit("round-ended")
                newRound = true
                console.log("Round [" + round++ + "] Ended")
            } else {
                if (tickCounter % 10 == 0) {
                    for (var i = 0; i < WORLDSIZE; i++) {
                        for (var j = 0; j < WORLDSIZE; j++) {
                            world.map[i][j].lifePoints = Math.min(parseInt(world.map[i][j].lifePoints * 1.1), MAX_PLAYERS * LP);
                        }
                    }
                }
                io.emit("gametick");
            }
        }, GAMETICK);
    }

    // Round loop
    setInterval(() => {
        if (newRound) {
            newRound = false;
            setTimeout(gameRound, 5000)
        }
    }, GAMETICK);
});

