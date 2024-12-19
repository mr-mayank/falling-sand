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
import { GRID_HEIGHT, GRID_WIDTH, shipsData } from "../../constants/constants";

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
    Array<Array<{ isRevealed: boolean; shipId: any }>>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSavedGame = useCallback(async () => {
    try {
      const exportedKeyBase64 = localStorage.getItem(`${id}-key`);
      const encryptedShipsData = localStorage.getItem(`${id}-ships`);
      const encryptedGridData = localStorage.getItem(`${id}-grid`);
      const gameId = localStorage.getItem("game-id");

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
        localStorage.removeItem(`${id}-key`);
        localStorage.removeItem(`${id}-ships`);
        localStorage.removeItem(`${id}-grid`);
        localStorage.removeItem("bot-key");
        localStorage.removeItem("bot-ships");
        localStorage.removeItem("bot-grid");
        localStorage.removeItem("game-id");
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
          localStorage.removeItem(`${id}-key`);
          localStorage.removeItem(`${id}-ships`);
          localStorage.removeItem(`${id}-grid`);
          localStorage.removeItem("bot-key");
          localStorage.removeItem("bot-ships");
          localStorage.removeItem("bot-grid");
          localStorage.removeItem("game-id");
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

          setPlayerOneShips(decryptedShipsData);
          setPlayerOneGrid(decryptedGridData);
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

      setPlayerTwoShips(decryptedShipsData);
      setPlayerTwoGrid(
        decryptedGridData.reduce(
          (
            acc: Array<Array<{ isRevealed: boolean; shipId: any }>>,
            tile: {
              row: number;
              col: number;
              shipId: number;
              isRevealed: boolean;
            }
          ) => {
            if (!acc[tile.row]) {
              acc[tile.row] = [];
            }

            acc[tile.row][tile.col] = {
              isRevealed: tile.isRevealed,
              shipId: tile.shipId,
            };

            return acc;
          },
          Array(7)
            .fill(null)
            .map(() => [])
        )
      );
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
      localStorage.removeItem(`${id}-key`);
      localStorage.removeItem(`${id}-ships`);
      localStorage.removeItem(`${id}-grid`);
      localStorage.removeItem("bot-key");
      localStorage.removeItem("bot-ships");
      localStorage.removeItem("bot-grid");
      localStorage.removeItem("game-id");
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
  };
};

export default useBattleArenaController;
