var board; // UI Object
var game; // Logic object
// var data;
window.onload = function () {
    initGame(); // Initializes game for first board setup
};

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

// setup my socket client
var socket = io();

var gameState;
var turn;

// Join a room:
socket.emit('joinRoom', { username, room });

var initGame = function () {
    var cfg = { // Initial configuration
        draggable: true, // Items are draggable
        position: 'start', // In FEN format
        onDrop: handleMove,
        // TO DO: 
        // Try to mimic dragging movement while its happening
    };

    board = new ChessBoard('gameBoard', cfg);
    game = new Chess();

    gameState = game.fen();
    turn = game.turn();

    console.log('Next turn is: ' + turn);

};

var handleMove = function (source, target) {
    var move = game.move({ from: source, to: target });

    if (move === null) return 'snapback'; // If its an invalid move


    // However, if valid:
    else {

        socket.emit('turn', turn)

        socket.on('turnValidity', function (turnValidity) {
            console.log(turnValidity);
            if (turnValidity === false) {
                // if (undomove != null) {
                //     // socket.emit('undoMove', undomove);
                // }
                game.load(gameState);
            } else {
                socket.emit('move', move);
            }
        });

    }

};

socket.on('message', message => {
    console.log(message);
    var status = document.getElementById("status")
    status.innerHTML = 'Status: ' + message;
})

socket.on('move', function (msg) {
    game.move(msg);
    board.position(game.fen());

    turn = game.turn();
    console.log('Next turn is: ' + turn);
    var turnDiv = document.getElementById("turn")
    turnDiv.innerHTML = 'Next turn is: ' + turn;
    console.log(turnDiv);
    gameState = game.fen();
});

socket.on('undoMove', function (msg) {
    game.move(msg);
    board.position(game.fen());
})

socket.on('roomFull', function (msg) {
    (window.location.href = "/")
        .then(alert(msg));
});

// socket.on('color', function (color) {
//     var assignedColor = document.getElementById("assignedColor")
//     assignedColor.innerHTML = 'Your color is: ' + color;
// });


