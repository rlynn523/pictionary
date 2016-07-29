var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function(socket){
    console.log(socket.client);
    var id = socket.client.id;
    console.log('Client ' + id  + ' connected');
    socket.on('draw', function(position) {
        var id = socket.client.id;
        socket.broadcast.emit('draw', position);
    });
    socket.on('keydown', function(guess) {
        var id = socket.client.id;
        console.log('Client ' + id + ' guessed ' + guess);
        socket.broadcast.emit('keydown', guess);
    });
    socket.on('disconnect', function(){
        id = socket.client.id;
        console.log('Client ' + id + ' disconnected');
    });
});
server.listen(8080);
