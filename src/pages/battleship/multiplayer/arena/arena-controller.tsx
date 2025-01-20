import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { decryptData, encryptData } from "../../../../utils";
import { toast } from "react-toastify";
import { useTheme } from "../../../../context/theme-context";
import {
  GRID_HEIGHT,
  GRID_WIDTH,
  TOTAL_SHIP_SIZE,
} from "../../../../constants/constants";
import { useUser } from "../../../../context/user-context";
import { useGetGame, useUpdateGameBoard } from "../../service";
import { Socket } from "socket.io-client";
import GameSocketService from "../../../../apis/socketService";

interface Grid {
  shipId: number;
  isOccupied: boolean;
  isRevealed?: boolean;
}

const useArenaController = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const { theme } = useTheme();

  const [playerOneGrid, setPlayerOneGrid] = useState<Grid[][]>(() =>
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => ({
        isOccupied: false,
        shipId: -1,
        isRevealed: false,
      }))
    )
  );

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

  const [currentMove, setCurrentMove] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [canPlay, setCanPlay] = useState(true);

  const [totalShipsRevealed, setTotalShipsRevealed] = useState<{
    playerOne: number;
    playerTwo: number;
  }>({
    playerOne: 0,
    playerTwo: 0,
  });

  const [playerIds, setPlayerIds] = useState<{
    playerOne: string;
    playerTwo: string;
  }>({
    playerOne: "",
    playerTwo: "",
  });

  const [exportedKeyBase64, setExportedKeyBase64] = useState<string | null>();
  const [socket, setSocket] = useState<Socket | null>(null);

  const getGame = useGetGame(id);
  const updateGameBoard = useUpdateGameBoard();

  const endGameRedirection = (type: "home" | "new") => {
    if (type === "home") {
      navigate("/");
    } else {
      navigate(`/battleship/create`);
    }
  };

  const handlePlayerOneGridClick = useCallback(
    async (rowIndex: number, colIndex: number) => {
      if (!canPlay) {
        toast.error("Its not your turn", {
          autoClose: 1000,
        });
        return;
      }
      if (playerOneGrid[rowIndex][colIndex].isRevealed) return;

      setClickedTileP1({ row: rowIndex, col: colIndex });

      setTimeout(() => setClickedTileP1(null), 600);

      const newGrid = [...playerOneGrid];
      newGrid[rowIndex][colIndex].isRevealed = true;

      const exportedKeyBufferPlayer =
        exportedKeyBase64 &&
        Uint8Array.from(atob(exportedKeyBase64), (c) => c.charCodeAt(0));

      const key =
        exportedKeyBufferPlayer &&
        (await window.crypto.subtle.importKey(
          "raw",
          exportedKeyBufferPlayer,
          {
            name: "AES-GCM",
            length: 256,
          },
          true,
          ["encrypt", "decrypt"]
        ));

      const encryptedGridDataPlayer = key && (await encryptData(newGrid, key));
      setPlayerOneGrid(newGrid);

      if (encryptedGridDataPlayer) {
        if (newGrid[rowIndex][colIndex].shipId !== -1) {
          const status =
            totalShipsRevealed.playerOne + 1 === TOTAL_SHIP_SIZE
              ? "complete"
              : false;
          setTotalShipsRevealed((prev) => ({
            ...prev,
            playerOne: prev.playerOne + 1,
          }));
          updateGameBoard.mutate({
            roomID: id || "",
            player: user?.id || "",
            board: encryptedGridDataPlayer,
            turn: playerIds.playerTwo,
            status: status,
          });
          setCurrentMove({ row: rowIndex, col: colIndex });
        } else {
          updateGameBoard.mutate({
            roomID: id || "",
            player: user?.id || "",
            board: encryptedGridDataPlayer,
            turn: playerIds.playerOne,
          });
          setCurrentMove({ row: rowIndex, col: colIndex });
        }
      }
    },

    [
      canPlay,
      playerOneGrid,
      exportedKeyBase64,
      totalShipsRevealed.playerOne,
      updateGameBoard,
      id,
      user?.id,
      playerIds.playerTwo,
      playerIds.playerOne,
    ]
  );

  useEffect(() => {
    if (updateGameBoard.isSuccess && updateGameBoard.data && currentMove) {
      socket?.emit("makeMove", {
        move: currentMove,
        playerId: user?.id || "",
        gameId: id || "",
        turn: updateGameBoard.data.turn,
      });

      setCurrentMove(null);
    }
  }, [
    updateGameBoard.isSuccess,
    updateGameBoard.data,
    socket,
    currentMove,
    user?.id,
    id,
  ]);

  useEffect(() => {
    if (updateGameBoard.isError) {
      console.log("updateGameBoard.isError", updateGameBoard.error);
    }
    //eslint-disable-next-line
  }, [updateGameBoard.isError]);

  const handlePlayerTwoGridClick = (row: number, col: number) => {
    if (playerTwoGrid[+row][+col].isRevealed) return;

    setClickedTileP2({ row, col });
    setTimeout(() => setClickedTileP2(null), 600);

    const newGrid = [...playerTwoGrid];
    newGrid[row][col].isRevealed = true;

    if (newGrid[row][col].shipId !== -1) {
      setTotalShipsRevealed((prev) => ({
        ...prev,
        playerTwo: prev.playerTwo + 1,
      }));
    }
    setPlayerTwoGrid(newGrid);
  };

  const loadSavedGame = useCallback(
    async (
      exportedKeyBase64: string,
      gameBoard: string,
      player: "player1" | "player2"
    ) => {
      try {
        const exportedKeyBuffer = Uint8Array.from(
          atob(exportedKeyBase64),
          (c) => c.charCodeAt(0)
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

        const decryptedGridData = await decryptData(gameBoard, key);

        let shipRevealed = 0;

        for (let i = 0; decryptedGridData.length > i; i++) {
          shipRevealed += decryptedGridData[i].filter(
            (ship: { isRevealed: boolean; shipId: number }) =>
              ship.isRevealed && ship.shipId !== -1
          ).length;
        }

        if (player === "player1") {
          setPlayerOneGrid(decryptedGridData);
          setTotalShipsRevealed((prev) => ({
            ...prev,
            playerOne: shipRevealed,
          }));
        } else {
          setPlayerTwoGrid(decryptedGridData);
          setTotalShipsRevealed((prev) => ({
            ...prev,
            playerTwo: shipRevealed,
          }));
        }
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

        console.error("Error loading game:", error);
        navigate("/battleship");
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (getGame.isSuccess && getGame.data) {
      if (getGame.data.status === "waiting") {
        setCanPlay(false);
      }
      if (
        !(
          getGame.data.player1.id === user?.id ||
          getGame.data?.player2?.id === user?.id
        )
      ) {
        toast.error("You are not part of this game");
        navigate("/battleship");
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      if (getGame.data.status === "finished") {
        endGameRedirection("home");
      }

      if (getGame.data.player1.id === user?.id) {
        if (getGame.data.gameBoard1 && getGame.data.key1) {
          loadSavedGame(getGame.data.key1, getGame.data.gameBoard1, "player2");
        }
        if (getGame.data.gameBoard2 && getGame.data.key2) {
          loadSavedGame(getGame.data.key2, getGame.data.gameBoard2, "player1");
        }
        setExportedKeyBase64(getGame.data.key2 || null);
        setPlayerIds({
          playerOne: getGame.data.player2?.id || "",
          playerTwo: getGame.data.player1?.id || "",
        });
      } else if (getGame.data.player2?.id === user?.id) {
        if (getGame.data.gameBoard2 && getGame.data.key2) {
          loadSavedGame(getGame.data.key2, getGame.data.gameBoard2, "player2");
        }
        if (getGame.data.gameBoard1 && getGame.data.key1) {
          loadSavedGame(getGame.data.key1, getGame.data.gameBoard1, "player1");
        }
        setExportedKeyBase64(getGame.data.key1 || null);
        setPlayerIds({
          playerOne: getGame.data.player1.id || "",
          playerTwo: getGame.data.player2?.id || "",
        });
      }

      if (getGame.data.turn === user?.id) {
        setCanPlay(true);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      const socketService = GameSocketService.getInstance();
      const socket =
        socketService.getSocket() ||
        socketService.connect(process.env.REACT_APP_API_URL || "");
      setSocket(socket);

      if (user?.id && id) {
        // Ensure we're still part of the game
        socketService.setCurrentGame(id, user.id);
        socket.emit("reconnect_player", { playerId: user.id, gameId: id });
      }

      return () => {
        // Don't disconnect socket when component unmounts
        // Socket will be handled by the service
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGame.isSuccess, getGame.data, user?.id]);

  useEffect(() => {
    if (!socket) return;

    const socketService = GameSocketService.getInstance();
    socketService.joinGame(user?.id || "", id || "");

    socketService.onCreateComplete(({ playerId }) => {
      if (user?.id !== playerId) {
        if (playerId !== getGame.data?.player1.id) {
          toast(
            !getGame.data?.player2?.name
              ? "player 2"
              : getGame.data?.player2.name + "has placed ship"
          );
        } else {
          toast(
            !getGame.data?.player1?.name
              ? "player 2"
              : getGame.data?.player1.name + "has placed ship"
          );
        }
      }
      setCanPlay(false);
      getGame.remove();
    });

    socketService.onMovePlayed((data) => {
      if (user?.id !== data.playerId) {
        handlePlayerTwoGridClick(data.move.row, data.move.col);
      }
      setCanPlay(data.turn === user?.id);
    });
    return () => {
      socketService.removeAllListeners();
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, getGame.data, user?.id, id, playerTwoGrid]);

  return {
    theme,
    playerTwoGrid,
    playerOneGrid,
    isLoading,
    clickedTileP1,
    clickedTileP2,
    canPlay,
    handlePlayerOneGridClick,
    endGameRedirection,
    playerOne:
      getGame.data?.player1.id === user?.id
        ? getGame.data?.player2?.name
        : getGame.data?.player1?.name,
    playerTwo:
      getGame.data?.player2?.id === user?.id
        ? getGame.data?.player2?.name
        : getGame.data?.player1?.name,
    isWin:
      totalShipsRevealed?.playerOne === TOTAL_SHIP_SIZE ||
      totalShipsRevealed?.playerTwo === TOTAL_SHIP_SIZE
        ? totalShipsRevealed?.playerOne === TOTAL_SHIP_SIZE
          ? true
          : totalShipsRevealed?.playerTwo === TOTAL_SHIP_SIZE
          ? false
          : null
        : null,
  };
};

export default useArenaController;
