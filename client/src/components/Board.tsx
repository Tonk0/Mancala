import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Store from './Store';
import Pit from './Pit';

const socket = io('http://localhost:3000');
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
    return pits[12] < pits[13] ? 1 : 0;
  }
  if (checkForEmptyRow(pits, 6, 11)) {
    collectStones(0, 5, 12);
    if (pits[12] === pits[13]) return 2;
    return pits[12] < pits[13] ? 1 : 0;
  }
  if (checkByAmount(pits)) {
    return pits[12] < pits[13] ? 13 : 12;
  }
  return -1;
};

function Board() {
  const [state, setState] = useState(initialState);
  const [myID, setMyID] = useState('');
  const handlePitClick = (index: number) => {
    // eslint-disable-next-line prefer-const
    let { pits, currentPlayer } = state;
    if (myID !== state.currentPlayer) return;
    if (index <= 5 || index >= 11) return;
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
        // show modal first player win
        break;
      case 1:
        // show modal second player win
        break;
      case 2:
        // show modal tie
        break;
      case -1:
      default:
        // do nothing
    }
    socket.emit('make-move', { pits, isSwitch: myID !== currentPlayer });
    setState({ pits, currentPlayer });
  };
  useEffect(() => {
    socket.on('connect', () => {
      if (socket.id) {
        setMyID(socket.id);
      }
    });
    socket.on('game-start', (currentPlayer) => {
      console.log('gameStarted: ', currentPlayer);
      setState((prev) => ({ ...prev, currentPlayer }));
    });
    socket.on('move-made', ({pits, currentPlayer}) => {
      console.log(pits, currentPlayer)
      setState({ pits, currentPlayer });
    });
  }, []);
  return (
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
  );
}

export default Board;
