import React, { useState } from "react";
import { shipsData, GRID_WIDTH, GRID_HEIGHT } from "../constants/constants";
import { useTheme } from "../context/theme-context";
import DeleteIcon from "../assets/icons/delete-icon";
import cryptoRandomString from "crypto-random-string";
import { toast } from "react-toastify";

interface TileInterface {
  row: number;
  col: number;
}

interface ShipInterface {
  id: number;
  placed: boolean;
  position: { row: number; col: number } | null;
  orientation: string;
  size: number;
}

const BattleshipController = () => {
  const { theme } = useTheme();

  const [grid, setGrid] = useState(() =>
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => ({
        isOccupied: false,
        shipId: -1,
      }))
    )
  );
  const [clickedTile, setClickedTile] = useState<TileInterface | null>(null);
  const [draggedShip, setDraggedShip] = useState<ShipInterface | null>(null);
  const [ships, setShips] = useState<ShipInterface[]>(
    shipsData.map((ship) => ({
      ...ship,
      placed: false,
      position: null,
      orientation: "horizontal",
    }))
  );
  const [selectedShip, setSelectedShip] = useState<ShipInterface | null>(null);
  const handleShipClick = (ship: ShipInterface) => {
    if (ship.id === selectedShip?.id) {
      setSelectedShip(null);
      return;
    }
    setSelectedShip(ship);
    return;
  };

  const [dragOffset, setDragOffset] = useState(0);

  const handleRotate = (e: { stopPropagation: () => void }) => {
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

  const handlePlacedShipClick = (shipID: number) => {
    if (selectedShip?.id === shipID) {
      setSelectedShip(null);
    } else {
      const selectedShip = ships.find((ship) => ship.id === shipID);
      setSelectedShip(selectedShip ? selectedShip : null);
    }
  };

  const handleDeletePlacedShip = (shipID: number) => {
    const newShips = ships.map((ship) =>
      ship.id === shipID
        ? {
            ...ship,
            placed: false,
            position: null,
            orientation: "horizontal",
          }
        : ship
    );
    const newGrid = grid.map((row) =>
      row.map((tile) =>
        tile.shipId === shipID
          ? { ...tile, isOccupied: false, shipId: -1 }
          : tile
      )
    );
    setShips(newShips);
    setGrid(newGrid);
    setSelectedShip(null);
  };

  const handleTileClick = (rowIndex: number, colIndex: number) => {
    setClickedTile({ row: rowIndex, col: colIndex });
    setTimeout(() => setClickedTile(null), 600);
  };

  const handleRandomPlacement = () => {
    const newGrid = grid.map((row) =>
      row.map(() => ({
        isOccupied: false,
        shipId: -1,
      }))
    );

    const newShips = ships.map((ship) => ({
      ...ship,
      placed: false,
      position: null,
      orientation: "horizontal",
    }));

    const tryPlaceShip = (ship: ShipInterface): ShipInterface => {
      for (let attempts = 0; attempts < 100; attempts++) {
        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        const maxRow =
          orientation === "horizontal" ? GRID_HEIGHT : GRID_HEIGHT - ship.size;
        const maxCol =
          orientation === "horizontal" ? GRID_WIDTH - ship.size : GRID_WIDTH;

        const row = Math.floor(Math.random() * maxRow);
        const col = Math.floor(Math.random() * maxCol);

        if (validatePlacement(row, col, ship.size, orientation, newGrid)) {
          // Place the ship on the grid
          if (orientation === "horizontal") {
            for (let i = 0; i < ship.size; i++) {
              newGrid[row][col + i] = {
                isOccupied: true,
                shipId: ship.id,
              };
            }
          } else {
            for (let i = 0; i < ship.size; i++) {
              newGrid[row + i][col] = {
                isOccupied: true,
                shipId: ship.id,
              };
            }
          }

          return {
            ...ship,
            placed: true,
            position: { row, col },
            orientation,
          };
        }
      }

      // If unable to place after 100 attempts, return ship as unplaced.
      return ship;
    };

    const placedShips = newShips.map((ship) => tryPlaceShip(ship));

    setGrid(newGrid);
    setShips(placedShips);
  };

  const handleDragStart = (
    ship: ShipInterface,
    event: React.DragEvent<HTMLDivElement>
  ) => {
    //@ts-ignore
    const rect = event.target.getBoundingClientRect();
    let offset = Math.round(
      (event.clientX - rect.left) / (rect.width / ship.size)
    );

    setDragOffset(offset);
    setDraggedShip(ship);
  };

  const saveShipPlacement = () => {
    const isNotAllPlaced = ships.some((ship) => ship.placed === false);

    if (isNotAllPlaced) {
      toast.error("Please place all the ships before saving");
      return;
    }

    const generateRandomId = () => {
      return cryptoRandomString({ length: 10, type: "url-safe" });
    };
  };

  const handleDrop = (rowIndex: number, colIndex: number) => {
    if (!draggedShip) return;

    const { size, orientation } = draggedShip;
    let adjustedCol = colIndex;
    let adjustedRow = rowIndex;

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
            ? colIndex - dragOffset
            : size % 2 !== 0 && dragOffset >= Math.round(size / 2)
            ? colIndex - dragOffset + 1
            : colIndex - dragOffset;
      }
    } else {
      if (rowIndex <= size) {
        adjustedRow =
          rowIndex - dragOffset === 0
            ? rowIndex - dragOffset + 1
            : size % 2 !== 0 && dragOffset >= Math.round(size / 2)
            ? rowIndex - dragOffset + 1
            : rowIndex - dragOffset;
      } else {
        adjustedRow =
          dragOffset === size
            ? rowIndex - dragOffset
            : size % 2 !== 0 && dragOffset >= Math.round(size / 2)
            ? rowIndex - dragOffset + 1
            : rowIndex - dragOffset;
      }
    }

    // Validate placement
    if (validatePlacement(adjustedRow, adjustedCol, size, orientation, grid)) {
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
      if (shipIndex !== -1) {
        newShips[shipIndex] = {
          ...newShips[shipIndex],
          placed: true,
          position: { row: adjustedRow, col: adjustedCol },
        };
      }

      setGrid(newGrid);
      setShips(newShips);
    }

    setSelectedShip(null);
    setDraggedShip(null);
    setDragOffset(0);
  };
  const validatePlacement = (
    rowIndex: number,
    colIndex: number,
    size: number,
    orientation: string,
    newGrid: {
      isOccupied: boolean;
      shipId: number;
    }[][]
  ) => {
    if (orientation === "horizontal") {
      if (colIndex + size > GRID_WIDTH) return false;

      for (let i = 0; i < size; i++) {
        const tile = newGrid[rowIndex]?.[colIndex + i];
        if (!tile || tile.isOccupied) return false;
      }
    } else {
      if (rowIndex + size > GRID_HEIGHT) return false;

      for (let i = 0; i < size; i++) {
        const tile = newGrid[rowIndex + i]?.[colIndex];
        if (!tile || tile.isOccupied) return false;
      }
    }

    return true;
  };

  const renderPlacedShips = () => {
    return ships
      .filter((ship) => ship.placed && ship.position)
      .map((ship) => {
        const { row, col } = ship.position!;
        return (
          <div
            key={ship.id}
            className="ship"
            onClick={(e) => {
              e.preventDefault();
              handlePlacedShipClick(ship.id);
            }}
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
          >
            {selectedShip && selectedShip.id === ship.id && (
              <div
                className="delete-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeletePlacedShip(ship.id);
                }}
              >
                <DeleteIcon />
              </div>
            )}
          </div>
        );
      });
  };

  return {
    grid,
    theme,
    renderPlacedShips,
    clickedTile,
    handleTileClick,
    handleDrop,
    ships,
    handleDragStart,
    handleShipClick,
    handleRotate,
    handleRandomPlacement,
    selectedShip,
    saveShipPlacement,
  };
};

export default BattleshipController;
