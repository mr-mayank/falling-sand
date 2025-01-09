import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/theme-context";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/user-context";
import { useGetGame } from "../service";

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
  const { user } = useUser();
  const getGame = useGetGame(id);

  const handleCopyLink = () => {
    const gameUrl = window.location.href;
    navigator.clipboard.writeText(gameUrl);
    setShowUrlTooltip(true);
    setTimeout(() => setShowUrlTooltip(false), 2000);
  };

  const handleLeaveGame = () => {
    navigate("/battleship");
  };

  const handleStartGame = () => {
    navigate(`/battleship/${id}`);
  };
  const handleCopyHover = () => setShowUrlTooltip(true);
  const handleCopyLeave = () => setShowUrlTooltip(false);
  const handleKickPlayer = () => {
    setShowKickConfirm(false);
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
