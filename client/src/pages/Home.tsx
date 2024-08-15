import { Socket } from 'socket.io-client';

interface IHomeProps {
  socket: Socket
}
function Home({ socket }: IHomeProps) {
  return (
    <div>Home</div>
  );
}

export default Home;
