import io from 'socket.io-client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Board from './components/Board';
import Home from './pages/Home';

const socket = io('http://localhost:3000');
const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: <Home socket={socket} />,
  },
  {
    path: '/game/:roomID',
    element: <Board socket={socket} />,
  },
]);
function App() {
  return (
    <div className="app">
      {/* <Board /> */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
