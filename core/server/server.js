const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);

io.on('connection', function (socket){
    console.log("A user connected: " + socket.id);
});

io.on('disconnect', function (socket){
    console.log("A user disconnected: " + socket.id);
});

http.listen(3000, function () {
    console.log("Server started!");
});