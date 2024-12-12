import React, { useState } from "react";
import { shipsData, GRID_WIDTH, GRID_HEIGHT } from "../constants/constants";

const BattleshipController = () => {
  const [grid, setGrid] = useState(() =>
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => ({
        isOccupied: false,
        shipId: -1,
      }))
    )
  );
  const [clickedTile, setClickedTile] = useState(null);
  const [draggedShip, setDraggedShip] = useState(null);
  const [ships, setShips] = useState(
    shipsData.map((ship) => ({
      ...ship,
      placed: false,
      position: null,
      orientation: "horizontal", // Default orientation
    }))
  );
  const [selectedShip, setSelectedShip] = useState(null);
  const handleShipClick = (ship) => {
    setSelectedShip(ship);
  };

  const [dragOffset, setDragOffset] = useState(0);

  const handleRotate = (e) => {
    e.stopPropagation();
    if (!selectedShip) return;

    const newShips = ships.map((ship) =>
      ship.id === selectedShip.id
        ? {
            ...ship,
            orientation:
              ship.orientation === "horizontal" ? "vertical" : "horizontal",
          }
        : ship
    );
    setShips(newShips);
    setSelectedShip(null);
  };

  const handleTileClick = (rowIndex, colIndex) => {
    setClickedTile({ row: rowIndex, col: colIndex });
    setTimeout(() => setClickedTile(null), 600);
  };

  const handleDragStart = (ship, event) => {
    const rect = event.target.getBoundingClientRect();
    let offset = Math.round(
      (event.clientX - rect.left) / (rect.width / ship.size)
    );

    setDragOffset(offset);
    setDraggedShip(ship);
  };

  const handleDrop = (rowIndex, colIndex) => {
    if (!draggedShip) return;

    const { size, orientation } = draggedShip;
    let adjustedCol = colIndex; // Default to the passed column index
    let adjustedRow = rowIndex; // Default to the passed row index

    if (orientation === "horizontal") {
      if (colIndex <= size) {
        adjustedCol =
          colIndex - dragOffset < 0
            ? colIndex - dragOffset + 1
            : size % 2 !== 0 && dragOffset >= Math.round(size / 2)
            ? colIndex - dragOffset + 1
            : colIndex - dragOffset;
      } else {
        adjustedCol =
          dragOffset === size
            ? colIndex - dragOffset + 1
            : size % 2 !== 0 && dragOffset >= Math.round(size / 2)
            ? colIndex - dragOffset + 1
            : colIndex - dragOffset;
      }
    } else {
      if (rowIndex <= size) {
        adjustedRow =
          rowIndex - dragOffset < 0
            ? rowIndex - dragOffset + 1
            : size % 2 !== 0 && dragOffset >= Math.round(size / 2)
            ? rowIndex - dragOffset + 1
            : rowIndex - dragOffset;
      } else {
        adjustedRow =
          dragOffset === size
            ? rowIndex - dragOffset + 1
            : size % 2 !== 0 && dragOffset >= Math.round(size / 2)
            ? rowIndex - dragOffset + 1
            : rowIndex - dragOffset;
      }
    }

    // Validate placement
    if (validatePlacement(adjustedRow, adjustedCol, size, orientation)) {
      const newGrid = grid.map((row) => [...row]);
      const newShips = [...ships];

      if (orientation === "horizontal") {
        for (let i = 0; i < size; i++) {
          newGrid[adjustedRow][adjustedCol + i] = {
            isOccupied: true,
            shipId: draggedShip.id,
          };
        }
      } else {
        for (let i = 0; i < size; i++) {
          newGrid[adjustedRow + i][adjustedCol] = {
            isOccupied: true,
            shipId: draggedShip.id,
          };
        }
      }

      const shipIndex = newShips.findIndex(
        (ship) => ship.id === draggedShip.id
      );
      newShips[shipIndex] = {
        ...newShips[shipIndex],
        placed: true,
        position: { row: adjustedRow, col: adjustedCol },
      };

      setGrid(newGrid);
      setShips(newShips);
    }

    setDraggedShip(null);
    setDragOffset(0);
  };
  const validatePlacement = (rowIndex, colIndex, size, orientation) => {
    if (orientation === "horizontal") {
      if (colIndex + size > GRID_WIDTH) return false;
      for (let i = 0; i < size; i++) {
        if (grid[rowIndex][colIndex + i].isOccupied) return false;
      }
    } else {
      if (rowIndex + size > GRID_HEIGHT) return false;
      for (let i = 0; i < size; i++) {
        if (grid[rowIndex + i][colIndex].isOccupied) return false;
      }
    }
    return true;
  };

  const renderPlacedShips = () => {
    return ships
      .filter((ship) => ship.placed)
      .map((ship) => {
        const { row, col } = ship.position;
        return (
          <div
            key={ship.id}
            className="ship"
            style={{
              gridColumnStart:
                ship.orientation !== "horizontal" ? col + 1 : col + 1,
              gridColumnEnd:
                ship.orientation !== "horizontal"
                  ? col + 2
                  : col + ship.size + 1,
              gridRowStart:
                ship.orientation !== "horizontal" ? row + 1 : row + 1,
              gridRowEnd:
                ship.orientation !== "horizontal"
                  ? row + ship.size + 1
                  : row + 2,
              zIndex: 10,
            }}
          ></div>
        );
      });
  };

  return {
    grid,
    renderPlacedShips,
    clickedTile,
    handleTileClick,
    handleDrop,
    ships,
    handleDragStart,
    handleShipClick,
    handleRotate,
    selectedShip,
  };
};

export default BattleshipController;
