import { useNavigate } from 'react-router-dom';

function PlayerLeftModal() {
  const navigate = useNavigate();
  return (
    <div className="modal">
      <div className="overlay">
        <div className="modal-content">
          <button type="button" className="btn-close" onClick={() => navigate('/')}>&#x2715;</button>
          <h2>Игрок покинул игру</h2>
          <button type="button" className="btn-create" onClick={() => navigate('/')}>Вернуться</button>
        </div>
      </div>
    </div>
  );
}

export default PlayerLeftModal;
