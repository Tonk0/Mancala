const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});
const players = [];
let currentPlayer = Math.floor(Math.random() * 2);
io.on('connection', (socket) => {
  players.push(socket.id);
  if (players.length === 2) {
    io.emit('game-start', players[currentPlayer]);
  }
  console.log(socket.id)
  socket.on('make-move', ({pits, isSwitch}) => {
    console.log(isSwitch)
    console.log(currentPlayer, players[currentPlayer]);
    if (isSwitch) {
      console.log('in isSwitch')
      currentPlayer = 1 - currentPlayer;
    }
    console.log(currentPlayer, players[currentPlayer]);
    const oppSide = pits.slice(0,6).reverse();
    const playerSide = pits.slice(6, 12).reverse();
    pits = [...playerSide, ...oppSide, pits[13], pits[12]];
    socket.broadcast.emit('move-made', {pits, currentPlayer: players[currentPlayer]});
  })
})
httpServer.listen(3000, () => {
  console.log('server started');
});