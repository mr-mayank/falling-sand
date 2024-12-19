import React from "react";
import "../../assets/css/save-game-modal.css";

export const LoadSavedGameModal: React.FC<{
  handleLoadGame: () => void;
  handleStartNewGame: () => void;
}> = ({ handleLoadGame, handleStartNewGame }) => {
  return (
    <div className="prompt-overlay">
      <div className="prompt-container">
        <div className="prompt-content">
          <h2>Resume Previous Battle?</h2>
          <p>
            A previous game session was found. Would you like to continue where
            you left off?
          </p>
          <div className="prompt-buttons">
            <button className="btn-secondary" onClick={handleStartNewGame}>
              Start New Game
            </button>
            <button className="btn-primary" onClick={handleLoadGame}>
              Load Saved Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadSavedGameModal;
