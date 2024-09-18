import {
  ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { Room } from '../types';

interface IModalProps {
  setIsOpen: (arg: boolean) => void
  socket: Socket
}
function Modal({ setIsOpen, socket }:IModalProps) {
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    socket.on('room-created', (room: Room) => {
      navigate(`/game/${room.id}`);
    });
  }, [socket, navigate]);
  const createRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('createRoom', roomName);
  };
  return (
    <div className="modal">
      <div className="overlay">
        <div className="modal-content">
          <button type="button" className="btn-close" onClick={() => setIsOpen(false)}>&#x2715;</button>
          <form onSubmit={(e) => createRoom(e)}>
            <div className="inputContainer">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="roomName">Название комнаты</label>
              <input
                type="text"
                id="roomName"
                name="roomName"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRoomName(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-create">Создать комнату</button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default Modal;
