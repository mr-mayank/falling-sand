import React, { useEffect, useState } from "react";
import { shipsData, GRID_WIDTH, GRID_HEIGHT } from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/theme-context";
import DeleteIcon from "../assets/icons/delete-icon";
import cryptoRandomString from "crypto-random-string";
import { toast } from "react-toastify";
import {
  encryptData,
  generateKey,
  handleRandomPlacement,
  validatePlacement,
} from "../utils";
import { ShipInterface } from "../constants/interface";

interface TileInterface {
  row: number;
  col: number;
}

const BattleshipController = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

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
  const [loadPrevDataModal, setLoadPrevDataModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleRandomBtnClick = () => {
    const { newGrid, placedShips } = handleRandomPlacement(
      grid,
      ships,
      "player"
    );

    setGrid(newGrid);
    setShips(placedShips);
  };

  const saveShipPlacement = async () => {
    const isNotAllPlaced = ships.some((ship) => ship.placed === false);

    if (isNotAllPlaced) {
      toast.error("Please place all the ships before saving");
      return;
    }

    try {
      const gameId = cryptoRandomString({ length: 10, type: "url-safe" });

      const shipsData = ships.map((ship) => ({
        id: ship.id,
        position: ship.position,
        orientation: ship.orientation,
        size: ship.size,
      }));

      const gridData = grid.flatMap((row, rowIndex) =>
        row.map((tile, colIndex) => ({
          row: rowIndex,
          col: colIndex,
          shipId: tile.shipId,
          isRevealed: false,
        }))
      );

      const key = await generateKey();

      const exportedKey = await window.crypto.subtle.exportKey("raw", key);
      const exportedKeyBase64 = btoa(
        String.fromCharCode.apply(null, Array.from(new Uint8Array(exportedKey)))
      );

      const encryptedShipsData = await encryptData(shipsData, key);
      const encryptedGridData = await encryptData(gridData, key);

      localStorage.setItem("game-id", gameId);
      localStorage.setItem(`${gameId}-key`, exportedKeyBase64);
      localStorage.setItem(`${gameId}-ships`, encryptedShipsData);
      localStorage.setItem(`${gameId}-grid`, encryptedGridData);

      toast.success("Game saved successfully!", {
        autoClose: 1000,
      });
      navigate(`/battleship/${gameId}`);
    } catch (error) {
      console.error("Error saving game:", error);
      toast.error("Failed to save game");
    }
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

  const clearSaveData = (id: string) => {
    localStorage.removeItem("game-id");
    localStorage.removeItem(`${id}-key`);
    localStorage.removeItem(`${id}-ships`);
    localStorage.removeItem(`${id}-grid`);
    localStorage.removeItem("bot-key");
    localStorage.removeItem("bot-ships");
    localStorage.removeItem("bot-grid");
  };

  const handleLoadGame = () => {
    const id = localStorage.getItem("game-id");
    id && navigate(`/battleship/${id}`);
  };

  const handleStartNewGame = () => {
    const id = localStorage.getItem("game-id");
    id && clearSaveData(id);
    setLoadPrevDataModal(false);
  };

  useEffect(() => {
    const id = localStorage.getItem("game-id");
    if (id) {
      const exportedKeyBase64 = localStorage.getItem(`${id}-key`);
      const encryptedShipsData = localStorage.getItem(`${id}-ships`);
      const encryptedGridData = localStorage.getItem(`${id}-grid`);
      const keyBaseBot64 = localStorage.getItem("bot-key");
      const encryptedShipsDataBot = localStorage.getItem("bot-ships");
      const encryptedGridDataBot = localStorage.getItem("bot-grid");

      if (
        exportedKeyBase64 ||
        encryptedShipsData ||
        encryptedGridData ||
        keyBaseBot64 ||
        encryptedShipsDataBot ||
        encryptedGridDataBot
      ) {
        if (
          exportedKeyBase64 &&
          encryptedShipsData &&
          encryptedGridData &&
          keyBaseBot64 &&
          encryptedShipsDataBot &&
          encryptedGridDataBot
        ) {
          setLoadPrevDataModal(true);
        }
      } else {
        clearSaveData(id);
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    handleRandomBtnClick,
    selectedShip,
    saveShipPlacement,
    loadPrevDataModal,
    handleLoadGame,
    handleStartNewGame,
    isLoading,
  };
};

export default BattleshipController;