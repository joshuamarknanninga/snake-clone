const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Game = require('./game');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

const game = new Game(io);

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  game.addPlayer(socket);

  socket.on('changeDirection', (data) => {
    game.changeDirection(socket.id, data.direction);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    game.removePlayer(socket);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
