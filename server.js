var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var clientArray = [];
var drawerId;
var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];
var randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
var data = {
    drawing: false,
    word: randomWord
};
io.on('connection', function(socket) {
    var id = socket.client.id;
    console.log('Client ' + id + ' connected');
    clientArray.push(id);
    console.log(clientArray);
    drawerId = clientArray[0];
    data.drawerId = drawerId;
    data.id = id;
    socket.on('canDraw', function() {
        data.drawing = true;
        data.id = socket.client.id;
        socket.emit('userCanDraw', data);
    });
    socket.emit('userCanDraw', data);
    socket.on('draw', function(position) {
        var id = socket.client.id;
        socket.broadcast.emit('draw', position);
    });
    socket.on('keydown', function(guessData) {
        id = socket.client.id;
        if (guessData.guess == randomWord) {
            io.emit('keydown', guessData.win);
        } else {
            io.emit('keydown', guessData.guess);
        }
    });
    socket.on('disconnect', function() {
        id = socket.client.id;
        for (i = 0; i < clientArray.length; i++) {
            if (clientArray[i] === id)
                clientArray.splice(i, 1);
        }
        data.drawerId = clientArray[0];
        console.log('Client ' + id + ' disconnected');
    });
});
server.listen(8080);