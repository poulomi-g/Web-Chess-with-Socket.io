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
};


var handleMove = function (source, target) {
    var move = game.move({ from: source, to: target });

    if (move === null) return 'snapback'; // If its an invalid move

    // However, if valid:
    else socket.emit('move', move);
};

socket.on('message', message => {
    console.log(message);
})

socket.on('move', function (msg) {
    game.move(msg);
    board.position(game.fen());
});

socket.on('roomFull', function (msg) {
    (window.location.href = "/")
        .then(alert(msg));
});

