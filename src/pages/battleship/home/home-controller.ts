import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/user-context";
import { useState } from "react";

const useHomeController = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const handlePlayVsFriend = () => {
    if (user) {
      setIsRoomModalVisible(true);
    } else {
      setIsLoginModalVisible(true);
    }
  };
  return {
    navigate,
    user,
    isRoomModalVisible,
    isLoginModalVisible,
    handlePlayVsFriend,
    setIsRoomModalVisible,
    setIsLoginModalVisible,
  };
};

export default useHomeController;
