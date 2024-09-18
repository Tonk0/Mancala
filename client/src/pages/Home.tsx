import { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room } from '../types';
import Modal from '../components/Modal';

interface IHomeProps {
  socket: Socket
}
function Home({ socket }: IHomeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    socket.on('connect', () => {
      setIsLoading(false);
      socket.emit('getAvailableRooms');
    });
    socket.on('availableRooms', (availableRooms: Room[]) => {
      setRooms(availableRooms);
    });
  }, [socket]);
  const joinRoom = (room: Room) => {
    socket.emit('join-room', room.id);
    navigate(`/game/${room.id}`);
  };
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isLoading ? <p>Loading</p> : (
        <div style={{ width: '30%' }}>
          <div className="container">
            <p style={{ fontSize: '28px' }}>Доступные комнаты</p>
            <button type="button" onClick={() => setIsOpen(true)}>Создать игру</button>
          </div>
          <div className="line" />
          <div className="wrapper">
            {rooms.length > 0 && rooms.map((room) => (
              <div className="room" key={room.id}>
                <p className="room-name">{room.name}</p>
                <button type="button" onClick={() => joinRoom(room)}>Присоединиться</button>
              </div>
            ))}
          </div>
          {isOpen && <Modal setIsOpen={setIsOpen} socket={socket} />}
        </div>
      )}
    </>

  );
}

export default Home;
