import React from "react";
import useArenaController from "./arena-controller";
import BattleshipLoader from "../../../../components/battleship-loader";
import GameResultModal from "../../../../components/game-result-modal";

const Arena = () => {
  const {
    playerOne,
    playerTwo,
    playerOneGrid,
    theme,
    playerTwoGrid,
    isLoading,
    clickedTileP1,
    clickedTileP2,
    isWin,
    handlePlayerOneGridClick,
    endGameRedirection,
  } = useArenaController();

  if (isLoading || playerTwoGrid.length === 0 || playerOneGrid.length === 0) {
    return <BattleshipLoader />;
  }

  if (isWin !== null) {
    return (
      <GameResultModal
        isWin={isWin}
        onHome={() => endGameRedirection("home")}
        onNewGame={() => endGameRedirection("new")}
        theme={theme === "dark" ? "dark" : "light"}
      />
    );
  }

  return (
    <div
      className={`game-container2 ${
        theme === "dark" ? "theme-dark" : "theme-light"
      }`}
    >
      <div className="battlefield-container">
        <div className="battlefield-header">{playerOne || "Player 1"}</div>
        <div className="tile-grid2">
          {playerOneGrid.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <div
                key={`bot-${rowIndex}-${colIndex}`}
                className={`tile ${
                  tile.isRevealed && tile.shipId === -1 ? "revealed" : ""
                }
                ${
                  theme === "dark"
                    ? "theme-dark-revealed"
                    : "theme-light-revealed"
                }
                ${
                  clickedTileP1?.row === rowIndex &&
                  clickedTileP1?.col === colIndex
                    ? "clicked"
                    : ""
                }  ${
                  tile.shipId !== -1 && tile.isRevealed
                    ? "ship ship-revealed"
                    : ""
                }`}
                onClick={() => handlePlayerOneGridClick(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>

      <div className="battlefield-container">
        <div className="battlefield-header">
          {playerTwo + "(you)" || "Player 2"}
        </div>
        <div className="tile-grid2">
          {playerTwoGrid.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <div
                key={`you-${rowIndex}-${colIndex}`}
                className={`tile ${
                  tile.isRevealed && tile.shipId === -1 ? "revealed" : ""
                }
                ${
                  theme === "dark"
                    ? "theme-dark-revealed"
                    : "theme-light-revealed"
                }
                ${
                  clickedTileP2?.row === rowIndex &&
                  clickedTileP2?.col === colIndex
                    ? "clicked"
                    : ""
                }  ${
                  tile.shipId !== -1 && tile.isRevealed
                    ? "ship ship-revealed"
                    : ""
                }`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Arena;
