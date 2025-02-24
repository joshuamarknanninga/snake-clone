const { GRID_SIZE, GAME_SPEED } = require('../common/config');

class Game {
  constructor(io) {
    this.io = io;
    this.players = {};
    // Run game loop at GAME_SPEED (in milliseconds)
    this.interval = setInterval(() => this.gameLoop(), GAME_SPEED);
  }

  addPlayer(socket) {
    // Initialize player with random start position and default direction
    this.players[socket.id] = {
      id: socket.id,
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      direction: 'RIGHT',
      tail: [],
      score: 0
    };
  }

  removePlayer(socket) {
    delete this.players[socket.id];
  }

  changeDirection(id, direction) {
    // Optionally add logic to prevent reversing
    if (this.players[id]) {
      this.players[id].direction = direction;
    }
  }

  gameLoop() {
    // Update each player's snake position
    for (let id in this.players) {
      const player = this.players[id];
      // Add current position to tail history
      player.tail.push({ x: player.x, y: player.y });
      // Limit tail length for simplicity (this can be increased for a full snake experience)
      if (player.tail.length > 5) {
        player.tail.shift();
      }
      // Move according to current direction
      switch (player.direction) {
        case 'UP':
          player.y -= 1;
          break;
        case 'DOWN':
          player.y += 1;
          break;
        case 'LEFT':
          player.x -= 1;
          break;
        case 'RIGHT':
          player.x += 1;
          break;
      }
      // Wrap around grid edges
      if (player.x < 0) player.x = GRID_SIZE - 1;
      if (player.x >= GRID_SIZE) player.x = 0;
      if (player.y < 0) player.y = GRID_SIZE - 1;
      if (player.y >= GRID_SIZE) player.y = 0;
    }
    // Broadcast the updated game state to all connected clients
    this.io.emit('gameState', this.players);
  }
}

module.exports = Game;
