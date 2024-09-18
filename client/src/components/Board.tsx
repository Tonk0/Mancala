import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import Store from './Store';
import Pit from './Pit';
import { Room } from '../types';
import EndGameModal from './EndGameModal';

interface GameState {
  pits: number[]
  currentPlayer: string
}
const initialState : GameState = {
  pits: Array(14).fill(4).map((_, index) => (index === 12 || index === 13 ? 0 : 4)),
  currentPlayer: '',
};
const getNextPit = (currentPit: number) => {
  if (currentPit === 0) return 12;
  if (currentPit === 11) return 13;
  if (currentPit === 12) return 6;
  if (currentPit === 13) return 5;
  if (currentPit <= 5) return currentPit - 1;
  if (currentPit >= 6) return currentPit + 1;
  return -1;
};
const checkForEmptyRow = (pits: Array<number>, start: number, end: number) : boolean => {
  for (let i = start; i <= end; i++) {
    if (pits[i] !== 0) return false;
  }
  return true;
};
const checkByAmount = (pits: Array<number>) : boolean => {
  const pitsSum = pits.slice(0, 12).reduce((acc, curr) => acc + curr, 0);
  if (Math.min(pits[12], pits[13]) + pitsSum < Math.max(pits[12], pits[13])) {
    return true;
  }
  return false;
};
const endGame = (pits: Array<number>) : number => {
  const collectStones = (start: number, end: number, store: number) => {
    for (let i = start; i <= end; i++) {
      pits[store] += pits[i];
      pits[i] = 0;
    }
  };
  if (checkForEmptyRow(pits, 0, 5)) {
    collectStones(6, 11, 13);
    if (pits[12] === pits[13]) return 2;
    return pits[13] > pits[12] ? 0 : 1;
  }
  if (checkForEmptyRow(pits, 6, 11)) {
    collectStones(0, 5, 12);
    if (pits[12] === pits[13]) return 2;
    return pits[13] > pits[12] ? 0 : 1;
  }
  if (checkByAmount(pits)) {
    return pits[12] < pits[13] ? 0 : 1;
  }
  return -1;
};
interface IBoardProps {
  socket: Socket
}
function Board({ socket }:IBoardProps) {
  const [state, setState] = useState(initialState);
  const [myID, setMyID] = useState('');
  const [isWaiting, setIsWaiting] = useState(true);
  const [room, setRoom] = useState<Room | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const handlePitClick = (index: number) => {
    console.log(index);
    // eslint-disable-next-line prefer-const
    let { pits, currentPlayer } = state;
    if (myID !== state.currentPlayer) return;
    if (index <= 5 || index > 11) return;
    let stones = pits[index];
    if (stones === 0) return;
    pits[index] = 0;
    while (stones > 0) {
      index = getNextPit(index);
      if (index === 12) {
        // eslint-disable-next-line no-continue
        continue;
      }
      pits[index] += 1;
      stones -= 1;
    }
    // stone capture
    const isLastStone = pits[index] === 1 && index !== 12 && index !== 13;
    const isPlayerSide = index >= 6;
    if (isLastStone && isPlayerSide) {
      const oppositeIndex = index - 6;
      if (pits[oppositeIndex] !== 0) {
        const playerStore = 13;
        pits[playerStore] += pits[index] + pits[oppositeIndex];
        pits[index] = 0;
        pits[oppositeIndex] = 0;
      }
    }
    if (!(index === 13)) {
      currentPlayer = '';
    }
    switch (endGame(pits)) { // endGame() can change pits
      case 0:
      case 1:
      case 2:
        // show modal which will show winner or show tie
        console.log('Current: ', pits[13], ' Opposite: ', pits[12]);
        setIsOpen(true);
        break;
      case -1:
      default:
        // do nothing
    }
    socket.emit('make-move', { pits, isSwitch: myID !== currentPlayer, room });
    setState({ pits, currentPlayer });
  };
  useEffect(() => {
    if (socket.id) {
      setMyID(socket.id);
    }
    // socket.on('connect', () => {
    //   if (socket.id) {
    //     setMyID(socket.id);
    //   }
    // });
    // socket.on('game-start', (currentPlayer) => {
    //   console.log('gameStarted: ', currentPlayer);
    //   setState((prev) => ({ ...prev, currentPlayer }));
    // });
    socket.on('gameStarted', (roomFromServer: Room) => {
      setIsWaiting(false);
      setRoom(roomFromServer);
      setState((prev) => ({ ...prev, currentPlayer: roomFromServer.currentPlayerId }));
    });
    socket.on('move-made', (pits, roomFromServer: Room) => {
      // console.log(pits, roomFromServer);
      setState({ pits, currentPlayer: roomFromServer.currentPlayerId });
      setRoom(roomFromServer);
    });
  }, [socket]);
  return (
    <div className="board-wrapper">
      {isWaiting && <h2>Waiting for player</h2>}
      <div className="board">
        <Store stones={state.pits[12]} />
        <div className="pits">
          {state.pits.slice(0, 12).map((stones, index) => (
          // eslint-disable-next-line react/no-array-index-key
            <Pit key={index} index={index} stones={stones} handlePitClick={handlePitClick} />
          ))}
        </div>
        <Store stones={state.pits[13]} />
      </div>
      {isOpen && <EndGameModal setIsOpen={setIsOpen} currentPlayerStones={state.pits[13]} oppositePlayerStones={state.pits[12]} />}
    </div>

  );
}

export default Board;
