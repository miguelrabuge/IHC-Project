/* Server Requirements */
const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);

/* Configs */ 
TICK_LIMIT = 100
GAMETICK = 20
WORLDSIZE = 5
LP = 100
MAX_PLAYERS = 30


/* Global Objects */
rebooting = false;
players = {}
world = {
    map: [] // This bad boy will be a WORLDSIZE * WORLDSIZE matrix
}

/* Auxiliary Functions */
function getLocalWorld(x, y, seed) {
    var pos = 0, localWorld = [], v = [-1, 0, 1]
    for (let i = 0; i < v.length; i++) {
        for (let j = 0; j < v.length; j++) {
            if (x + v[j] < 0 || x + v[j] > WORLDSIZE - 1 || y + v[i] < 0 || y + v[i] > WORLDSIZE - 1) // If out of world bounds
                localWorld[pos] = -1
            else {
                if (seed == true) {
                    world.map[y + v[i]][x + v[j]] = (world.map[y + v[i]][x + v[j]] == 0 ? 3 * LP : world.map[y + v[i]][x + v[j]]);
                } 
                localWorld[pos] = world.map[y + v[i]][x + v[j]]
            }
            pos++;
        }
    }
    return localWorld
}

function seedWorld() {
    // Seed World 
    for (var i = 0; i < WORLDSIZE; i++) {
        world.map[i] = []
        for (var j = 0; j < WORLDSIZE; j++) {
            // world.map[i][j] = LP * MAX_PLAYERS;
            world.map[i][j] = 0;
        }
    }
    console.log(world.map)
}


/* Server Events */
io.on('connection', (socket) => {
    console.log("A user connected: " + socket.id);
    
    socket.on("InitializeInfo", (info) => {
        players[socket.id] = {
            x: parseInt(WORLDSIZE * Math.random()),
            y: parseInt(WORLDSIZE * Math.random()),
            lifePoints: LP
        }
        info({
            player: players[socket.id],
            worldSize: WORLDSIZE,
            maxCellLP: LP * MAX_PLAYERS, 
        });
    });

    socket.on("clientInfo", (data, newData) => {
            if (!rebooting) {
                // Local World
                var seed = false;
                if (data.action == "sow") {
                    players[socket.id].lifePoints -= parseInt(LP * 0.33);
                    seed = true;
                } else if (data.action == "up") {
                    players[socket.id].y = Math.max(0, players[socket.id].y - 1);
                } else if (data.action == "down") {
                    players[socket.id].y = Math.min(WORLDSIZE - 1, players[socket.id].y + 1);
                } else if (data.action == "left") {
                    players[socket.id].x = Math.max(0, players[socket.id].x - 1);
                } else if (data.action == "right") {
                    players[socket.id].x = Math.min(WORLDSIZE - 1, players[socket.id].x + 1);
                } else if (data.action == "harvest") {
                    players[socket.id].lifePoints += world.map[players[socket.id].y][players[socket.id].x]
                    world.map[players[socket.id].y][players[socket.id].x] = 0 
                } 
                // Get Local World
                var localWorld = getLocalWorld(players[socket.id].x, players[socket.id].y, seed);
                
                // Update Players
                players[socket.id].lifePoints -= LP * 0.01;
                // Callback with Updated data
                newData({player: players[socket.id], localWorld: localWorld})
            }
        })
        
    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id);
    });
});
    
http.listen(3000, function () {
    console.log("Server started!");

    var round = 0, newRound = true;

    // Round Function
    var gameRound = function () {
        console.log("Round [" + round + "] Started");
        seedWorld();
        rebooting = false;
        var tickCounter = 0;
        var tickInterval = setInterval(() => {
            if (++tickCounter == TICK_LIMIT) {
                rebooting = true;
                clearInterval(tickInterval);
                world = { map: [] }
                players = {}
                io.emit("RoundEnded")
                newRound = true
                console.log("Round [" + round++ + "] Ended")
            } else {
                if (tickCounter % 10 == 0) {
                    world.map = world.map.map(row => row.map(x => Math.min(MAX_PLAYERS * LP, parseInt(x * 1.1))))
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

