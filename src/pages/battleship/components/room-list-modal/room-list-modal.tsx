import React from "react";
import RefreshIcon from "../../../../assets/icons/refresh-icon";
import CreateRoomModal from "../create-room-modal";
import PasswordModal from "../password-modal";
import { IRoomsData } from "../../../../types";
import useRoomListController from "./room-list-modal-controller";

interface RoomModalProps {
  allRoomsData: IRoomsData[];
  isVisible: boolean;
  onClose: () => void;
}

const RoomListModal: React.FC<RoomModalProps> = ({
  allRoomsData,
  isVisible,
  onClose,
}) => {
  const {
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
  } = useRoomListController(onClose);

  const filteredRooms = allRoomsData.filter((room) =>
    room.roomID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isVisible) return null;

  return (
    <>
      <div className={`modal-overlay theme-${theme}`}>
        <div className="modal-content room-modal">
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
          <h2>Available Rooms</h2>
          {allRoomsData.length > 0 ? (
            <>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="room-search"
                />
                <button
                  onClick={handleRefresh}
                  className={`refresh-button ${
                    isRefreshing ? "refreshing" : ""
                  }`}
                  disabled={isRefreshing}
                >
                  <RefreshIcon />
                </button>
              </div>
              <div className="rooms-list">
                {filteredRooms.map((room) => (
                  <div
                    key={room._id}
                    className={`room-item ${
                      selectedRoom?._id === room._id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="room-info">
                      <span className="room-name">
                        {room.password && (
                          <span className="lock-icon">🔒 </span>
                        )}
                        {room.roomID}
                      </span>
                      <div className="room-stats">
                        <span className="room-players">
                          {room.player1 && room.player2 ? "2/2" : "1/2"}
                        </span>
                        <span className={`room-status ${room.status}`}>
                          {room.status === "waiting"
                            ? "Waiting"
                            : "In Progress"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-buttons">
                <button
                  className="modal-button create-button"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Room
                </button>

                <button
                  className="modal-button join-button"
                  disabled={!selectedRoom}
                  onClick={handleJoinRoom}
                >
                  Join Room
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="no-rooms-message">
                <p>No rooms available</p>
              </div>
              <div className="modal-buttons">
                <button
                  className="modal-button create-button"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Room
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <CreateRoomModal
        isVisible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRoom}
      />

      <PasswordModal
        isVisible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        roomName={selectedRoom?.roomID || ""}
      />
    </>
  );
};

export default RoomListModal;
