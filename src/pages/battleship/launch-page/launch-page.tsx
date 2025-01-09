import React from "react";
import useLaunchPageController from "./launch-page-controller";
import "../../../assets/css/launch-page.css";

const LaunchPage = () => {
  const {
    theme,
    gameRoomDetails,
    showUrlTooltip,
    showKickConfirm,
    isHost,
    canStartGame,
    handleCopyLink,
    handleLeaveGame,
    handleStartGame,
    handleCopyHover,
    handleCopyLeave,
    handleKickPlayer,
    setShowKickConfirm,
  } = useLaunchPageController();

  return (
    <div className={`launch-container theme-${theme}`}>
      <div className="launch-box">
        <button className="leave-button" onClick={handleLeaveGame}>
          Leave
        </button>
        <div className="game-details">
          <h2>{gameRoomDetails?.name}</h2>
          <div className="room-info1">
            <p>Room ID: {gameRoomDetails?.id}</p>
            <p>
              Room Type: {gameRoomDetails?.isPrivate ? "Private" : "Public"}
            </p>
          </div>
        </div>

        <div className="players-section">
          <div className="player-info">
            <span className="player-name">
              {gameRoomDetails?.player1.name}{" "}
              <span className="host-tag">(Host)</span>
            </span>
          </div>

          {gameRoomDetails?.player2 ? (
            <div
              className="player-info"
              onClick={() => setShowKickConfirm((prev) => !prev)}
            >
              {isHost ? (
                <div className="tooltip-container">
                  <span className="player-name clickable">
                    {gameRoomDetails?.player2.name}{" "}
                    {showKickConfirm && (
                      <button
                        onClick={handleKickPlayer}
                        className="kick-confirm"
                      >
                        Kick
                      </button>
                    )}
                  </span>
                </div>
              ) : (
                <span className="player-name">
                  {gameRoomDetails?.player2.name}
                </span>
              )}
            </div>
          ) : (
            <div className="waiting-message">
              Waiting for other player to join game...
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button
            className={`start-button ${!canStartGame ? "disabled" : ""}`}
            disabled={!canStartGame}
            onClick={handleStartGame}
          >
            Start Game
          </button>

          <div
            className="tooltip-container"
            onMouseEnter={handleCopyHover}
            onMouseLeave={handleCopyLeave}
          >
            <button className="copy-button" onClick={handleCopyLink}>
              Copy URL
            </button>
            {showUrlTooltip && (
              <div className="tooltip">
                {navigator.clipboard
                  ? "Click to copy the game URL!"
                  : "Copying not supported"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPage;
