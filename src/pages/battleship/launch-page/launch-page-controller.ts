import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/theme-context";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/user-context";
import {
  useGetGame,
  useKickPlayer,
  useLeaveGame,
  useStartGame,
} from "../service";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";
import GameSocketService from "../../../apis/socketService";

interface GameRoom {
  id: string;
  name: string;
  isPrivate: boolean;
  player1: {
    id: string;
    name: string;
  };
  player2?: {
    id?: string;
    name?: string;
  };
  status: string;
}
const useLaunchPageController = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showUrlTooltip, setShowUrlTooltip] = useState(false);
  const [showKickConfirm, setShowKickConfirm] = useState(false);
  const [gameRoomDetails, setGameRoomDetails] = useState<GameRoom | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUser();
  const getGame = useGetGame(id);
  const leaveGame = useLeaveGame();
  const startGame = useStartGame();
  const kickPlayer = useKickPlayer();

  const handleCopyLink = () => {
    const gameUrl = window.location.href;
    navigator.clipboard.writeText(gameUrl);
    setShowUrlTooltip(true);
    setTimeout(() => setShowUrlTooltip(false), 2000);
  };

  const handleLeaveGame = () => {
    leaveGame.mutate({
      roomID: gameRoomDetails?.name || "",
      player: user?.id || "",
    });
  };

  const handleStartGame = () => {
    if (gameRoomDetails?.status === "waiting") {
      startGame.mutate({
        roomID: id || "",
        player: user?.id || "",
      });
    }
  };
  const handleCopyHover = () => setShowUrlTooltip(true);
  const handleCopyLeave = () => setShowUrlTooltip(false);
  const handleKickPlayer = () => {
    setShowKickConfirm(false);
    kickPlayer.mutate({
      roomID: gameRoomDetails?.name || "",
      player: gameRoomDetails?.player2?.id || "",
    });
  };

  useEffect(() => {
    if (getGame.isSuccess && getGame.data) {
      setGameRoomDetails({
        ...gameRoomDetails,
        id: getGame.data.id,
        name: getGame.data.name,
        player1: getGame.data.player1 && {
          id: getGame.data.player1.id,
          name: getGame.data.player1.name,
        },
        player2: getGame.data.player2 && {
          id: getGame?.data?.player2?.id,
          name: getGame?.data?.player2?.name,
        },
        isPrivate: getGame.data.isPrivate,
        status: getGame.data.status,
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getGame.isSuccess, getGame.data]);

  useEffect(() => {
    if (kickPlayer.isSuccess) {
      socket?.emit("kickPlayer", {
        kickedPlayerId: gameRoomDetails?.player2?.id,
        gameId: id,
      });
      setShowKickConfirm(false);
      getGame.refetch();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kickPlayer.isSuccess, kickPlayer.data]);

  useEffect(() => {
    if (leaveGame.isSuccess) {
      socket?.emit("leaveGame", { playerId: user?.id, gameId: id });

      navigate("/battleship");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaveGame.isSuccess, leaveGame.data]);

  useEffect(() => {
    const socketService = GameSocketService.getInstance();
    const socket = socketService.connect(process.env.REACT_APP_API_URL || "");
    setSocket(socket);

    // Set current game information
    if (user?.id && id) {
      socketService.setCurrentGame(id, user.id);
    }

    return () => {
      // Only disconnect if we're actually leaving the game
      // (not just navigating to create page)
      if (!window.location.pathname.includes("/create/")) {
        socketService.disconnect();
      }
    };

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (startGame.isSuccess) {
      const socketService = GameSocketService.getInstance();
      // Use cleanDisconnect to keep socket alive but remove game-specific listeners
      socketService.cleanDisconnect();

      socket?.emit("startGame", {
        gameId: id,
      });

      navigate(`/battleship/multiplayer/create/${id}`);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startGame.isSuccess]);

  useEffect(() => {
    if (startGame.isError) {
      console.log(startGame.error);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startGame.isError]);

  useEffect(() => {
    if (!socket) return;

    const socketService = GameSocketService.getInstance();
    socketService.joinGame(user?.id || "", id || "");

    socketService.onPlayerJoined(() => {
      getGame.refetch();
    });

    socketService.onGameStarted(() => {
      navigate(`/battleship/multiplayer/create/${id}`);
    });

    socketService.onPlayerLeft(({ playerId, message, reason }) => {
      if (playerId === gameRoomDetails?.player1.id) {
        toast(
          reason === "afk"
            ? "Host has been disconnected due to inactivity"
            : "Host has left the Game"
        );
        navigate("/battleship");
      } else {
        if (reason === "afk") {
          toast("Player has been disconnected due to inactivity");
        }
        getGame.refetch();
      }
    });

    socketService.onPlayerKicked(({ kickedPlayerId }) => {
      if (kickedPlayerId === user?.id) {
        toast("You have been kicked from the game");
        navigate("/battleship");
      } else {
        getGame.refetch();
      }
    });

    return () => {
      socketService.removeAllListeners();
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, gameRoomDetails?.player1.id, user?.id, id]);

  const isHost = user?.id === gameRoomDetails?.player1.id;
  const canStartGame = gameRoomDetails?.player2 && isHost;
  return {
    theme,
    gameRoomDetails,
    showUrlTooltip,
    showKickConfirm,
    isHost,
    canStartGame,
    handleCopyLink,
    handleLeaveGame,
    handleStartGame,
    handleCopyHover,
    handleCopyLeave,
    handleKickPlayer,
    setShowKickConfirm,
  };
};

export default useLaunchPageController;
