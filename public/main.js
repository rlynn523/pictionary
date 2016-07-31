var socket = io();

var pictionary = function() {
    var canvas, context;
    var drawing = false;

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
            6, 0, 2 * Math.PI);
        context.fill();
    };
    var drawBox;
    var drawWord = $('#draw-word');
    var drawingWord = function(randomWord) {
        drawWord.html('Draw this word: ' + randomWord);
    };

    var guessBox;
    var userGuess = $('#user-guess');
    var userGuessing = function(guess) {
        userGuess.text(guess);
    };
    var onKeyDown = function(event) {
        if (event.keyCode != 13) {
            return;
        }
        var guess = (guessBox.val());
        userGuessing(guess);
        socket.emit('keydown', guess);
        guessBox.val('');
    };
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    socket.on('userCanDraw', function(data) {
        console.log(data.drawerId + ' can draw!');
        console.log(data.id + ' client id');
        if (data.drawerId == data.id) {
            drawingWord(data.word);
            canvas.on('mousemove', function(event) {
                if (drawing === true) {
                    var offset = canvas.offset();
                    var position = {
                        x: event.pageX - offset.left,
                        y: event.pageY - offset.top
                    };
                    draw(position);
                    socket.emit('draw', position);
                }
            });
            canvas.on('mousedown', function(event) {
                drawing = true;
            });
            canvas.on('mouseup', function(event) {
                drawing = false;
                return;
            });
        } else {
            alert("You can only guess!");
        }
    });
    socket.on('draw', draw);
    socket.on('keydown', userGuessing);
};
$(document).ready(function() {
    pictionary();
});
