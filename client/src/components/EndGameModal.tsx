import { useNavigate } from 'react-router-dom';

interface IEndGameModalProps {
  currentPlayerStones: number
  oppositePlayerStones: number
}
function EndGameModal({ currentPlayerStones, oppositePlayerStones }:IEndGameModalProps) {
  const navigate = useNavigate();
  return (
    <div className="modal">
      <div className="overlay">
        <div className="modal-content">
          <button type="button" className="btn-close" onClick={() => navigate('/')}>&#x2715;</button>
          {currentPlayerStones > oppositePlayerStones && <h2>You win</h2>}
          {currentPlayerStones < oppositePlayerStones && <h2>You lose</h2>}
          {currentPlayerStones === oppositePlayerStones && <h2>Tie</h2>}
          <div className="stones-number">
            <div className="stats-container">
              <p>Ваши камни</p>
              <p>{currentPlayerStones}</p>
            </div>
            <div className="stats-container">
              <p>Камни оппонента</p>
              <p>{oppositePlayerStones}</p>
            </div>
          </div>
          <button type="button" className="btn-create" onClick={() => navigate('/')}>Вернуться</button>
        </div>
      </div>
    </div>
  );
}

export default EndGameModal;
