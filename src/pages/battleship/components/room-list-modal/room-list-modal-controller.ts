import { useEffect, useState } from "react";
import { useTheme } from "../../../../context/theme-context";
import { useCreateGame, useJoinGame } from "../../service";
import { useUser } from "../../../../context/user-context";
import { IRoomsData } from "../../../../types";
import { useNavigate } from "react-router-dom";

const useRoomListController = (onClose: () => void) => {
  const { theme } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<IRoomsData | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const createRoom = useCreateGame();
  const joinRoom = useJoinGame();

  const handleCreateRoom = (roomData: {
    name: string;
    isPrivate: boolean;
    password?: string;
  }) => {
    createRoom.mutate({
      roomID: roomData.name,
      password: roomData.password,
      status: "waiting",
      player1: user?.id || "",
    });
  };

  const handleJoinRoom = () => {
    if (selectedRoom?.password) {
      setShowPasswordModal(true);
    } else {
      joinRoom.mutate({
        roomID: selectedRoom?.roomID || "",
        player: user?.id || "",
      });
    }
  };

  const handlePasswordSubmit = (password: string) => {
    console.log("Joining room with password:", selectedRoom?._id, password);
    setShowPasswordModal(false);
    onClose();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update rooms with new data
      // In real implementation, you would fetch from your API
      //   setRooms((prevRooms) => [
      //     ...prevRooms,
      //     {
      //       id: String(prevRooms.length + 1),
      //       name: `Battle Room ${prevRooms.length + 1}`,
      //       isPasswordProtected: Math.random() > 0.5,
      //       players: Math.floor(Math.random() * 2) + 1,
      //       maxPlayers: 2,
      //       status: Math.random() > 0.5 ? "waiting" : "active",
      //     },
      //   ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (createRoom.isSuccess) {
      navigate(`/battleship/launch/${createRoom.data.id}`);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createRoom.isSuccess, createRoom.data]);

  useEffect(() => {
    if (joinRoom.isSuccess) {
      navigate(`/battleship/launch/${joinRoom.data.id}`);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinRoom.isSuccess, joinRoom.data]);

  return {
    theme,
    searchQuery,
    setSearchQuery,
    selectedRoom,
    setSelectedRoom,
    showPasswordModal,
    setShowPasswordModal,
    isRefreshing,
    showCreateModal,
    setShowCreateModal,
    handleCreateRoom,
    handleJoinRoom,
    handlePasswordSubmit,
    handleRefresh,
  };
};

export default useRoomListController;
