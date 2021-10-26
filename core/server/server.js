const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
players = {}
gametick = 1000
worldSize = 5
world = {
    map: Array(worldSize).fill(Array(worldSize).fill(0))
}

io.on('connection', (socket) => {
    console.log("A user connected: " + socket.id);
    console.log(world.map)

    socket.on("InitializeInfo", (info) => {
        players[socket.id] = {
            x: parseInt(worldSize * Math.random()),
            y: parseInt(worldSize * Math.random()),
            worldSize: worldSize
        }
        console.log(players[socket.id])
        info(players[socket.id]);
    });
    
    socket.on("clientInfo", (data, newData) => {
        if(data.action == "up") {
            players[socket.id].y--;
        } else if (data.action == "down") {
            players[socket.id].y++;
        } else if (data.action == "left") {
            players[socket.id].x--;
        } else if (data.action == "right") {
            players[socket.id].x++;
        }
        // Callback with Updated data
        newData(players[socket.id])
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id);
    });
});

http.listen(3000, function () {
    console.log("Server started!");
    setInterval(() => io.emit("gametick"), gametick);
});

