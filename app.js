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
var numClients = {};
io.on('connection', function (socket) {

    socket.on('joinRoom', ({ username, room }) => {


        if (numClients[room] === 2) {
            socket.emit('roomFull', `${room} is full`);
        }

        if (numClients[room] == undefined) { // First user joining
            const user = userJoin(socket.id, username, room, 'w');
            numClients[room] = 1;
            socket.join(user.room);
            socket.emit('message', 'Welcome message');

            //Tell others that user has connected
            socket.broadcast.to(user.room).emit('message', `${username} has joined, piece is ${user.piece}`);

        }

        else if (numClients[room] < 2) { // Second user joining

            const user = userJoin(socket.id, username, room, 'b');

            socket.join(user.room);

            socket.room = room;

            socket.emit('message', 'Welcome message');

            //Tell others that user has connected
            socket.broadcast.to(user.room).emit('message', `${username} has joined, piece is ${user.piece}`);

            numClients[room]++;
        }
        console.log(numClients[room]);
    });
    console.log('new connection');



    // Listen for move:
    socket.on('move', function (msg) {

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('move', msg);
    });

    socket.on('undoMove', function (msg) {

        const user = getCurrentUser(socket.id);

        socket.emit('undoMove', msg);
    });

    socket.on('turn', (turn) => {
        const user = getCurrentUser(socket.id);


        if (user.piece === turn) {
            socket.emit('turnValidity', true);
        } else {
            socket.emit('turnValidity', false);
        }
    });

    // Upon disconnection
    socket.on('disconnect', () => {
        io.emit('message', 'User left');
    });


});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/default.html');
});


app.use(express.static(path.join(__dirname, 'public')));
