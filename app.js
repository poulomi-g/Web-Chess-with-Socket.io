var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

var io = require('socket.io')(http);
var roomno = 1;
io.on('connection', function(socket) {
    console.log('new connection');

    if (io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
    socket.join("room-"+roomno);
    console.log("Room number: "+roomno);

    io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room"+roomno)

    socket.on('move', function(msg) {
        // socket.broadcast.emit('move', msg);
        // socket.broadcast.to(otherSocket.id).emit('move', msg);
        io.in("room-"+roomno).emit('move', msg)
        console.log("moved room"+roomno)
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/default.html');
});

http.listen(port, function () {
    console.log('listening on *: ' + port);
});