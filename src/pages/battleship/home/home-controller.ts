import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/user-context";
import { useEffect, useState } from "react";
import { useGetAllRooms } from "../service";
import { IRoomsData } from "../../../types";

const useHomeController = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [allRoomsData, setAllRoomsData] = useState<IRoomsData[]>([]);
  const getAllRooms = useGetAllRooms(isRoomModalVisible);

  const handlePlayVsFriend = () => {
    if (user) {
      setIsRoomModalVisible(true);
    } else {
      setIsLoginModalVisible(true);
    }
  };

  const handleRefreshRoomList = () => {
    getAllRooms.refetch();
  };

  useEffect(() => {
    if (getAllRooms.isSuccess && getAllRooms.data) {
      if (getAllRooms.data.items.length > 0) {
        setAllRoomsData(getAllRooms.data.items);
      } else {
        setAllRoomsData([]);
      }
    }
  }, [getAllRooms.isSuccess, getAllRooms.data]);

  return {
    navigate,
    user,
    isRoomModalVisible,
    isLoginModalVisible,
    allRoomsData,
    handlePlayVsFriend,
    setIsRoomModalVisible,
    setIsLoginModalVisible,
    handleRefreshRoomList,
  };
};

export default useHomeController;
