import React from "react";
import "../../assets/css/battleship.css";
import BattleshipController from "./battleship-controller";
import RotateIcon from "../../assets/icons/rotate-icon";
import LoadSavedGameModal from "./load-save-game-modal/load-save-game-modal";
import BattleshipLoader from "../../components/battleship-loader";

const TileGrid = () => {
  const {
    grid,
    clickedTile,
    ships,
    selectedShip,
    theme,
    loadPrevDataModal,
    isLoading,
    renderPlacedShips,
    handleTileClick,
    handleDrop,
    handleDragStart,
    handleShipClick,
    handleRotate,
    handleRandomBtnClick,
    saveShipPlacement,
    handleLoadGame,
    handleStartNewGame,
  } = BattleshipController();

  if (isLoading) {
    return <BattleshipLoader />;
  }

  if (loadPrevDataModal && !isLoading) {
    return (
      <LoadSavedGameModal
        handleLoadGame={handleLoadGame}
        handleStartNewGame={handleStartNewGame}
      />
    );
  }

  return (
    <div
      className={`game-container ${
        theme === "dark" ? "theme-dark" : "theme-light"
      }`}
    >
      <div className="container">
        <button className="main-btn" onClick={handleRandomBtnClick}>
          Random
        </button>

        <button className="main-btn save" onClick={saveShipPlacement}>
          Save
        </button>
      </div>
      <div
        className="tile-grid"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
      >
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`tile ${
                clickedTile?.row === rowIndex && clickedTile?.col === colIndex
                  ? "clicked"
                  : ""
              } ${tile.isOccupied ? "occupied" : ""}`}
              onClick={() => handleTileClick(rowIndex, colIndex)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(rowIndex, colIndex)}
            />
          ))
        )}
        {renderPlacedShips()}
      </div>
      <div className="ship-container">
        {ships
          .filter((ship) => !ship.placed)
          .map((ship) => (
            <div
              key={ship.id}
              className={`ship draggable-ship octa`}
              draggable
              onDragStart={(e) => handleDragStart(ship, e)}
              onClick={() => handleShipClick(ship)}
              style={{
                width:
                  ship.orientation === "horizontal"
                    ? `${ship.size * 48}px`
                    : "40px",
                height:
                  ship.orientation === "horizontal"
                    ? "40px"
                    : `${ship.size * 48}px`,
              }}
            >
              {selectedShip && selectedShip.id === ship.id && (
                <div className="rotate-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      handleRotate(e);
                    }}
                  >
                    <RotateIcon />
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default TileGrid;
