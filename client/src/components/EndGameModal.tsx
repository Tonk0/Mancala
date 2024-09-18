interface IEndGameModalProps {
  setIsOpen: (arg: boolean) => void
  currentPlayerStones: number
  oppositePlayerStones: number
}
function EndGameModal({ setIsOpen, currentPlayerStones, oppositePlayerStones }:IEndGameModalProps) {
  return (
    <div className="modal">
      <div className="overlay">
        <div className="modal-content">
          <button type="button" className="btn-close" onClick={() => setIsOpen(false)}>&#x2715;</button>
          {currentPlayerStones > oppositePlayerStones && <h2>You win</h2>}
          {currentPlayerStones > oppositePlayerStones && <h2>You lose</h2>}
          {currentPlayerStones === oppositePlayerStones && <h2>Tie</h2>}
          <div className="stones-number">
            <div className="stats-container">
              <p>Yours strones</p>
              <p>{currentPlayerStones}</p>
            </div>
            <div className="stats-container">
              <p>Player2</p>
              <p>{oppositePlayerStones}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default EndGameModal;
