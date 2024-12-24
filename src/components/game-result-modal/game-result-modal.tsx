import React, { useState, useEffect } from "react";
import "../../assets/css/game-result-modal.css";

interface GameResultModalProps {
  isWin: boolean;
  onHome: () => void;
  onNewGame: () => void;
  theme?: "light" | "dark";
}

const GameResultModal: React.FC<GameResultModalProps> = ({
  isWin,
  onHome,
  onNewGame,
  theme = "light",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [fireworkCount, setFireworkCount] = useState(3); // Control number of fireworks

  useEffect(() => {
    setShowModal(true);

    if (isWin) {
      // Create new fireworks periodically
      const interval = setInterval(() => {
        setFireworkCount((prev) => (prev % 3) + 1); // Cycle between 1-3 fireworks
      }, 2000); // Match with animation duration

      return () => clearInterval(interval);
    }
  }, [isWin]);

  return (
    <div
      className={`modal-container ${showModal ? "show" : ""}`}
      data-theme={theme}
    >
      <div className="modal-backdrop">
        {isWin &&
          Array.from({ length: fireworkCount }).map((_, index) => (
            <div key={`firework-${index}`} className="firework" />
          ))}
      </div>

      <div className="modal-content">
        <div className="modal-icon">
          {isWin ? (
            <div className="trophy">🏆</div>
          ) : (
            <div className="skull">💀</div>
          )}
        </div>

        <div className="modal-text">
          <h2 className={`modal-title ${isWin ? "win" : "lose"}`}>
            {isWin ? "VICTORY!" : "DEFEAT!"}
          </h2>
          <p className="modal-subtitle">
            {isWin
              ? "Congratulations! You've won the battle!"
              : "Better luck next time, Captain!"}
          </p>
        </div>

        <div className="modal-buttons">
          <button onClick={onHome} className="home-button1">
            Home
          </button>
          <button
            onClick={onNewGame}
            className={`new-game-button ${isWin ? "win" : "lose"}`}
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultModal;
