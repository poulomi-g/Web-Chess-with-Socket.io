var board; // UI Object
var game; // Logic object
// var data;
window.onload = function () {
    initGame(); // Initializes game for first board setup
};

// setup my socket client
var socket = io();


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
    else socket.emit("move", move);
};

socket.on('connectToRoom', function (data) {
    var newdiv = document.getElementById("room-number");
    newdiv.innerHTML = data;
    console.log('dhshdasdi');
});

socket.on('move', function (msg) {
    var room_div = document.getElementById("room-number");
    data = room_div.innerHTML;
    game.move(msg);
    board.position(game.fen());
    socket.emit('movedRoom', data);
    console.log(data);
});