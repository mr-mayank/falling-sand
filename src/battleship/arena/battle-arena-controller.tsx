import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  decryptData,
  encryptData,
  generateKey,
  handleRandomPlacement,
} from "../../utils";
import { toast } from "react-toastify";
import { useTheme } from "../../context/theme-context";
import { ShipInterface } from "../../constants/interface";
import {
  GRID_HEIGHT,
  GRID_WIDTH,
  TOTAL_SHIP_SIZE,
  shipsData,
} from "../../constants/constants";

interface ShipInterfaceP2 {
  id: number;
  position: { row: number; col: number } | null;
  orientation: string;
  size: number;
}

interface Grid {
  shipId: number;
  isOccupied: boolean;
  isRevealed?: boolean;
}

const useBattleArenaController = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { theme } = useTheme();
  const [playerOneShips, setPlayerOneShips] = useState<ShipInterface[]>(
    shipsData.map((ship) => ({
      ...ship,
      placed: false,
      position: null,
      orientation: "horizontal",
    }))
  );
  const [playerOneGrid, setPlayerOneGrid] = useState<Grid[][]>(() =>
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => ({
        isOccupied: false,
        shipId: -1,
        isRevealed: false,
      }))
    )
  );
  const [playerTwoShips, setPlayerTwoShips] = useState<ShipInterfaceP2[]>([]);
  const [playerTwoGrid, setPlayerTwoGrid] = useState<
    Array<
      Array<{ isRevealed: boolean; shipId: number; row: number; col: number }>
    >
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clickedTileP1, setClickedTileP1] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [clickedTileP2, setClickedTileP2] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [canPlay, setCanPlay] = useState(true);

  let [botShipClicked, setBotShipClicked] = useState<
    {
      row: number;
      col: number;
    }[]
  >([]);

  const [totalShipsRevealed, setTotalShipsRevealed] = useState({
    playerOne: 0,
    playerTwo: 0,
  });

  console.log(playerOneGrid);

  const handlePlayerOneGridClick = async (
    rowIndex: number,
    colIndex: number
  ) => {
    if (!canPlay) {
      toast.error("Its not your turn", {
        autoClose: 100,
      });
      return;
    }
    if (playerOneGrid[rowIndex][colIndex].isRevealed) return;

    const keyBaseBot64 = localStorage.getItem("bot-key");

    if (!keyBaseBot64) return;

    setClickedTileP1({ row: rowIndex, col: colIndex });
    setTimeout(() => setClickedTileP1(null), 600);

    const newGrid = [...playerOneGrid];
    newGrid[rowIndex][colIndex].isRevealed = true;

    const exportedKeyBufferBot = Uint8Array.from(atob(keyBaseBot64), (c) =>
      c.charCodeAt(0)
    );

    const key = await window.crypto.subtle.importKey(
      "raw",
      exportedKeyBufferBot,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    const encryptedGridDataBot = await encryptData(newGrid, key);

    localStorage.setItem("bot-grid", encryptedGridDataBot);

    setPlayerOneGrid(newGrid);
    if (newGrid[rowIndex][colIndex].shipId !== -1) {
      setTotalShipsRevealed((prev) => ({
        ...prev,
        playerOne: prev.playerOne + 1,
      }));
    } else {
      setCanPlay(false);
      setTimeout(() => {
        handlePlayerTwoGridClick();
      }, 500);
    }
  };

  const endGameRedirection = (type: "home" | "new") => {
    clearSaveData(id);
    if (type === "home") {
      navigate("/");
    } else {
      navigate(`/battleship/create`);
    }
  };

  const isValidCoordinate = (row: number, col: number) => {
    return row >= 0 && row < 7 && col >= 0 && col < 9;
  };

  const getUnrevealedAdjacentCells = (
    row: number,
    col: number,
    grid: {
      isRevealed: boolean;
      shipId: number;
      row: number;
      col: number;
    }[][],
    adjcentTiles: {
      row: number;
      col: number;
    }[]
  ) => {
    const adjacentCells = [
      { row: row - 1, col }, // up
      { row: row + 1, col }, // down
      { row, col: col - 1 }, // left
      { row, col: col + 1 }, // right
    ];

    return adjacentCells.filter(
      (cell) =>
        isValidCoordinate(cell.row, cell.col) &&
        !grid[cell.row][cell.col].isRevealed &&
        !adjcentTiles.some(
          (tile) => tile.row === cell.row && tile.col === cell.col
        )
    );
  };

  const savePlayerTwoData = async (keyBase64: string, newGrid: any) => {
    const exportedKeyBuffer = Uint8Array.from(atob(keyBase64), (c) =>
      c.charCodeAt(0)
    );

    const key = await window.crypto.subtle.importKey(
      "raw",
      exportedKeyBuffer,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    const encryptedGridDataBot = await encryptData(newGrid, key);

    localStorage.setItem(`${id}-grid`, encryptedGridDataBot);
  };

  const getRandomUnrevealedCoordinates = (): { row: number; col: number } => {
    let row: number, col: number;
    do {
      row = Math.floor(Math.random() * 7);
      col = Math.floor(Math.random() * 9);
    } while (playerTwoGrid[row][col].isRevealed);
    return { row, col };
  };

  const handlePlayerTwoGridClick = async () => {
    const keyBase64 = localStorage.getItem(`${id}-key`);
    if (!keyBase64) return;

    const newGrid = [...playerTwoGrid];
    const adjcentTiles = [...botShipClicked];
    if (adjcentTiles.length === 0) {
      const { row, col } = getRandomUnrevealedCoordinates();
      newGrid[row][col].isRevealed = true;
      savePlayerTwoData(keyBase64, newGrid);
      setPlayerTwoGrid(newGrid);
      setClickedTileP2({ row, col });
      setTimeout(() => setClickedTileP2(null), 600);

      if (newGrid[row][col].shipId !== -1) {
        if (totalShipsRevealed.playerTwo + 1 === TOTAL_SHIP_SIZE) {
          setTotalShipsRevealed((prev) => ({
            ...prev,
            playerTwo: prev.playerTwo + 1,
          }));
        } else {
          const adjacentCells = getUnrevealedAdjacentCells(
            row,
            col,
            newGrid,
            adjcentTiles
          );
          botShipClicked = [...botShipClicked, ...adjacentCells];
          setBotShipClicked(botShipClicked);
          setTotalShipsRevealed((prev) => ({
            ...prev,
            playerTwo: prev.playerTwo + 1,
          }));
          setTimeout(() => {
            handlePlayerTwoGridClick();
          }, 600);
        }
      } else {
        setCanPlay(true);
      }
      return;
    } else {
      const { row, col } = adjcentTiles[0];
      newGrid[row][col].isRevealed = true;
      savePlayerTwoData(keyBase64, newGrid);
      const newAdjecent = adjcentTiles.filter(
        (item) => item.row !== row && item.col !== col
      );
      if (newGrid[row][col].shipId !== -1) {
        if (totalShipsRevealed.playerTwo + 1 === TOTAL_SHIP_SIZE) {
          setTotalShipsRevealed((prev) => ({
            ...prev,
            playerTwo: prev.playerTwo + 1,
          }));
        } else {
          const adjacentCells = getUnrevealedAdjacentCells(
            row,
            col,
            newGrid,
            newAdjecent
          );

          botShipClicked = [...newAdjecent, ...adjacentCells];
          setBotShipClicked(botShipClicked);
          setTotalShipsRevealed((prev) => ({
            ...prev,
            playerTwo: prev.playerTwo + 1,
          }));

          setTimeout(() => {
            handlePlayerTwoGridClick();
          }, 600);
        }
      } else {
        botShipClicked = newAdjecent;
        setBotShipClicked(botShipClicked);
        setCanPlay(true);
      }

      setPlayerTwoGrid(newGrid);
      setClickedTileP2({ row, col });
      setTimeout(() => setClickedTileP2(null), 600);
    }
  };

  const clearSaveData = (id: string | null | undefined) => {
    localStorage.removeItem("game-id");
    localStorage.removeItem(`${id}-key`);
    localStorage.removeItem(`${id}-ships`);
    localStorage.removeItem(`${id}-grid`);
    localStorage.removeItem("bot-key");
    localStorage.removeItem("bot-ships");
    localStorage.removeItem("bot-grid");
  };

  const loadSavedGame = useCallback(async () => {
    try {
      const gameId = localStorage.getItem("game-id");
      if (!gameId && gameId !== id) {
        toast.error("No saved game found");
        clearSaveData(gameId);
        navigate("/battleship");
        return;
      }
      const exportedKeyBase64 = localStorage.getItem(`${id}-key`);
      const encryptedShipsData = localStorage.getItem(`${id}-ships`);
      const encryptedGridData = localStorage.getItem(`${id}-grid`);

      const keyBaseBot64 = localStorage.getItem("bot-key");
      const encryptedShipsDataBot = localStorage.getItem("bot-ships");
      const encryptedGridDataBot = localStorage.getItem("bot-grid");

      if (
        !exportedKeyBase64 ||
        !encryptedShipsData ||
        !encryptedGridData ||
        !gameId
      ) {
        toast.error("No saved game found");
        clearSaveData(gameId);
        navigate("/battleship");
        return;
      }

      if (!keyBaseBot64 && !encryptedShipsDataBot && !encryptedGridDataBot) {
        const { newGrid, placedShips } = handleRandomPlacement(
          playerOneGrid,
          playerOneShips,
          "bot"
        );

        const key = await generateKey();

        const exportedKey = await window.crypto.subtle.exportKey("raw", key);
        const exportedKeyBaseBot64 = btoa(
          String.fromCharCode.apply(
            null,
            Array.from(new Uint8Array(exportedKey))
          )
        );

        const encryptedShipsDataBot = await encryptData(placedShips, key);
        const encryptedGridDataBot = await encryptData(newGrid, key);

        localStorage.setItem("bot-key", exportedKeyBaseBot64);
        localStorage.setItem("bot-ships", encryptedShipsDataBot);
        localStorage.setItem("bot-grid", encryptedGridDataBot);

        setPlayerOneGrid(newGrid);
        setPlayerOneShips(placedShips);
      } else {
        if (!keyBaseBot64 || !encryptedShipsDataBot || !encryptedGridDataBot) {
          toast.error("BOT data altered!!");
          clearSaveData(gameId);
          navigate("/battleship");
          return;
        } else {
          const exportedKeyBufferBot = Uint8Array.from(
            atob(keyBaseBot64),
            (c) => c.charCodeAt(0)
          );

          const key = await window.crypto.subtle.importKey(
            "raw",
            exportedKeyBufferBot,
            {
              name: "AES-GCM",
              length: 256,
            },
            true,
            ["encrypt", "decrypt"]
          );

          const decryptedShipsData = await decryptData(
            encryptedShipsDataBot,
            key
          );
          const decryptedGridData = await decryptData(
            encryptedGridDataBot,
            key
          );

          let shipRevealed = 0;

          for (let i = 0; decryptedGridData.length > i; i++) {
            shipRevealed += decryptedGridData[i].filter(
              (ship: { isRevealed: boolean; shipId: number }) =>
                ship.isRevealed && ship.shipId !== -1
            ).length;
          }

          setPlayerOneShips(decryptedShipsData);
          setPlayerOneGrid(decryptedGridData);

          setTotalShipsRevealed((prev) => ({
            ...prev,
            playerOne: shipRevealed,
          }));
        }
      }

      const exportedKeyBuffer = Uint8Array.from(atob(exportedKeyBase64), (c) =>
        c.charCodeAt(0)
      );
      const key = await window.crypto.subtle.importKey(
        "raw",
        exportedKeyBuffer,
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );

      const decryptedShipsData = await decryptData(encryptedShipsData, key);
      const decryptedGridData = await decryptData(encryptedGridData, key);

      let shipRevealed = 0;

      for (let i = 0; decryptedGridData.length > i; i++) {
        shipRevealed += decryptedGridData[i].filter(
          (ship: { isRevealed: boolean; shipId: number }) =>
            ship.isRevealed && ship.shipId !== -1
        ).length;
      }

      setPlayerTwoShips(decryptedShipsData);
      setPlayerTwoGrid(decryptedGridData);
      setTotalShipsRevealed((prev) => ({
        ...prev,
        playerTwo: shipRevealed,
      }));

      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error: Error | any) {
      if (error.name === "DataIntegrityError") {
        toast.error(
          "Data integrity check failed. The saved game may have been tampered with.",
          {
            autoClose: 2000,
          }
        );
      } else {
        toast.error("Failed to load game", {
          autoClose: 2000,
        });
      }
      clearSaveData(id);
      console.error("Error loading game:", error);
      navigate("/battleship");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    loadSavedGame();
  }, [loadSavedGame]);

  return {
    theme,
    playerTwoGrid,
    playerOneGrid,
    isLoading,
    playerTwoShips,
    clickedTileP1,
    clickedTileP2,
    canPlay,
    totalShipsRevealed,
    handlePlayerOneGridClick,
    endGameRedirection,
  };
};

export default useBattleArenaController;
