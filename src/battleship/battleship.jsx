import React from "react";
import "./battleship.css";
import BattleshipController from "./battleship-controller";

const TileGrid = () => {
  const {
    grid,
    clickedTile,
    ships,
    selectedShip,
    renderPlacedShips,
    handleTileClick,
    handleDrop,
    handleDragStart,
    handleShipClick,
    handleRotate,
  } = BattleshipController();
  return (
    <div className="game-container">
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
              onDrop={() => handleDrop(rowIndex, colIndex)}
            ></div>
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
                cursor: "pointer",
              }}
            >
              {selectedShip && selectedShip.id === ship.id && (
                <div className="rotate-container">
                  <button onClick={(e) => handleRotate(e)}>Rotate</button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default TileGrid;
