var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var clientArray = [];
var drawerId;

io.on('connection', function(socket) {
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
    var id = socket.client.id;
    console.log('Client ' + id + ' connected');
    clientArray.push(id);
    console.log(clientArray);
    drawerId = clientArray[0];
    var data = {
        drawerId: drawerId,
        id: id,
        word: randomWord
    };
    socket.emit('userCanDraw', data);
    socket.on('drawingWord', function(randomWord) {
        console.log(randomWord);
    });
    socket.on('draw', function(position) {
        var id = socket.client.id;
        socket.broadcast.emit('draw', position);
    });
    socket.on('keydown', function(guess) {
        id = socket.client.id;
        console.log('Client ' + id + ' guessed ' + guess);
        socket.broadcast.emit('keydown', guess);
    });
    socket.on('disconnect', function() {
        id = socket.client.id;
        for (i = 0; i < clientArray.length; i++) {
            clientArray.splice(id, 1);
        }
        drawerId = clientArray[0];
        console.log(drawerId);
        console.log(clientArray);
        var data = {
            drawerId: drawerId,
            id: id
        };
        socket.emit('userCanDraw', data);
        console.log('Client ' + id + ' disconnected');
        console.log(clientArray);
    });
});
server.listen(8080);
