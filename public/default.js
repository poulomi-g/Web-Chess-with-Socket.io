var board; // UI Object
var game; // Logic object

window.onload = function () {
    initGame(); // Initializes game for first board setup
};

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
};