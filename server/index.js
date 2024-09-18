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
const rooms = [];

io.on('connection', (socket) => {
  socket.on('getAvailableRooms', ()=>{
    const availableRooms = rooms.filter(room => room.users.length < 2);
    socket.emit('availableRooms', availableRooms);
  })
  socket.on('createRoom', (roomName)=>{
    const roomId = generateRoomId();
    const room = {
      id: roomId,
      name: roomName,
      users: [socket.id],
      currentPlayerId: '',
      currentPlayerIndex: undefined
    }
    rooms.push(room);
    joinRoomAndEmit(socket, roomId);
    //socket.join(roomId);
    socket.emit('room-created', room);
    const availableRooms = rooms.filter(room => room.users.length < 2);
    io.emit('availableRooms', availableRooms);
  })
  socket.on('join-room', (roomId) => {
    const room = rooms.find((el)=>el.id === roomId);
    joinRoomAndEmit(socket, roomId);
    room.users.push(socket.id);
    room.currentPlayerIndex = Math.floor(Math.random() * 2);
    room.currentPlayerId = room.users[room.currentPlayerIndex];
    io.to(roomId).emit('gameStarted', room);
    const availableRooms = rooms.filter(room => room.users.length < 2);
    io.emit('availableRooms', availableRooms);
  })
  // players.push(socket.id);
  // if (players.length === 2) {
  //   io.emit('game-start', players[currentPlayer]);
  // }
  console.log(socket.id)
  socket.on('make-move', ({pits, isSwitch, room}) => {
    //console.log(currentPlayer, players[currentPlayer]);
    if (isSwitch) {
      console.log('in isSwitch')
      room.currentPlayerIndex = 1 - room.currentPlayerIndex;
      room.currentPlayerId = room.users[room.currentPlayerIndex];
    }
    //console.log(currentPlayer, players[currentPlayer]);
    const oppSide = pits.slice(0,6).reverse();
    const playerSide = pits.slice(6, 12).reverse();
    pits = [...playerSide, ...oppSide, pits[13], pits[12]];
    socket.broadcast.emit('move-made', pits, room);
  })
})
httpServer.listen(3000, () => {
  console.log('server started');
});

function joinRoomAndEmit(socket, roomId){
  socket.join(roomId);

  socket.emitToRoom = (eventName, data) => {
    socket.to(roomId).emit(eventName, data);
  }
}

function generateRoomId() {
  return Math.random().toString(36).substring(2, 15);
}