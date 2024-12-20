import React from "react";
import useBattleArenaController from "./battle-arena-controller";
import BattleshipLoader from "../../components/battleship-loader";

const BattleArena = () => {
  const {
    playerOneGrid,
    theme,
    playerTwoGrid,
    isLoading,
    clickedTileP1,
    clickedTileP2,
    handlePlayerOneGridClick,
  } = useBattleArenaController();

  if (isLoading || playerTwoGrid.length === 0 || playerOneGrid.length === 0) {
    return <BattleshipLoader />;
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
                } ${
                  clickedTileP1?.row === rowIndex &&
                  clickedTileP1?.col === colIndex
                    ? "clicked"
                    : ""
                }  ${tile.shipId !== -1 && tile.isRevealed ? "ship" : ""}`}
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
                className={`tile ${tile.isRevealed ? "revealed" : ""}  ${
                  clickedTileP2?.row === rowIndex &&
                  clickedTileP2?.col === colIndex
                    ? "clicked"
                    : ""
                } ${tile.shipId !== -1 && tile.isRevealed ? "ship" : ""}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleArena;
