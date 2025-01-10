import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/theme-context";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/user-context";
import { useGetGame, useKickPlayer, useLeaveGame } from "../service";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";

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
    navigate(`/battleship/${id}`);
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
    const newSocket = io(process.env.REACT_APP_API_URL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Join the game room
    socket.emit("joinGame", { playerId: user?.id, gameId: id });

    // Listen for player updates
    socket.on("playerJoined", () => {
      getGame.refetch();
    });

    socket.on("playerLeft", ({ playerId }: { playerId: string }) => {
      if (playerId === gameRoomDetails?.player1.id) {
        toast("Host has left the Game ");
        navigate("/battleship");
      } else {
        getGame.refetch();
      }
    });

    socket.on("playerKicked", ({ kickedPlayerId }) => {
      if (kickedPlayerId === user?.id) {
        toast("You have been kicked from the game");
        navigate("/battleship");
      } else {
        getGame.refetch();
      }
    });

    return () => {
      socket.off("playerJoined");
      socket.off("playerLeft");
      socket.off("playerKicked");
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, gameRoomDetails?.player1.id]);

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
