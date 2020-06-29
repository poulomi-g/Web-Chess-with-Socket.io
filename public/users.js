const users = [];

// Join user to the room
function userJoin(id, username, room, piece) {
    const user = { id, username, room, piece };

    users.push(user);

    return user;
}

// Current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}


module.exports = {
    userJoin,
    getCurrentUser,
}