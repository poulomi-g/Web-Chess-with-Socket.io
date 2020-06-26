const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const { userJoin, getCurrentUser } = require('./public/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Running on ${PORT}`));
var roomno = 1;
io.on('connection', function (socket) {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', 'Welcome message');

        //Tell others that user has connected
        socket.broadcast.to(user.room).emit('message', `${username} has joined`);

    });
    console.log('new connection');


    // Listen for move:
    socket.on('move', function (msg) {

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('move', msg);
    });

    // Upon disconnection
    socket.on('disconnect', () => {
        io.emit('message', 'User left');
    });

    // if (io.nsps['/'].adapter.rooms["room-" + roomno] && io.nsps['/'].adapter.rooms["room-" + roomno].length > 1) roomno++;

    // socket.join("room-" + roomno);
    // console.log("Room number: " + roomno);

    // io.sockets.in("room-" + roomno).emit('connectToRoom', "room-" + roomno);


});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/default.html');
});


app.use(express.static(path.join(__dirname, 'public')));

