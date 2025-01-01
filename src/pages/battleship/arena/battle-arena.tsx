import React from "react";
import useBattleArenaController from "./battle-arena-controller";
import BattleshipLoader from "../../../components/battleship-loader";
import { TOTAL_SHIP_SIZE } from "../../../constants/constants";
import GameResultModal from "../../../components/game-result-modal";

const BattleArena = () => {
  const {
    playerOneGrid,
    theme,
    playerTwoGrid,
    isLoading,
    clickedTileP1,
    clickedTileP2,
    totalShipsRevealed,
    handlePlayerOneGridClick,
    endGameRedirection,
  } = useBattleArenaController();

  if (isLoading || playerTwoGrid.length === 0 || playerOneGrid.length === 0) {
    return <BattleshipLoader />;
  }

  if (
    totalShipsRevealed.playerOne === TOTAL_SHIP_SIZE ||
    totalShipsRevealed.playerTwo === TOTAL_SHIP_SIZE
  ) {
    return (
      <GameResultModal
        isWin={totalShipsRevealed.playerOne === TOTAL_SHIP_SIZE ? true : false}
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
        <div className="battlefield-header">BOT</div>
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
        <div className="battlefield-header">YOU</div>
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

export default BattleArena;
