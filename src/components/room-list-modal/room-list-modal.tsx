import React, { useState } from "react";
import { useTheme } from "../../context/theme-context";
import RefreshIcon from "../../assets/icons/refresh-icon";
import CreateRoomModal from "../create-room-modal";
import PasswordModal from "../password-modal";

interface Room {
  id: string;
  name: string;
  isPasswordProtected: boolean;
  players: number;
  maxPlayers: number;
  status: "waiting" | "in_progress";
}

interface RoomModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const RoomListModal: React.FC<RoomModalProps> = ({ isVisible, onClose }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([
    // Sample rooms data - replace with actual API data
    {
      id: "1",
      name: "Battle Room 1",
      isPasswordProtected: true,
      players: 1,
      maxPlayers: 2,
      status: "waiting",
    },
    {
      id: "2",
      name: "Battle Room 2",
      isPasswordProtected: false,
      players: 2,
      maxPlayers: 2,
      status: "in_progress",
    },
    // Add more sample rooms...
  ]);

  const handleCreateRoom = (roomData: {
    name: string;
    isPrivate: boolean;
    password?: string;
  }) => {
    console.log("Creating room:", roomData);
    // Add your room creation logic here
  };

  const handleJoinRoom = () => {
    if (selectedRoom?.isPasswordProtected) {
      setShowPasswordModal(true);
    } else {
      // Join room directly
      console.log("Joining room:", selectedRoom?.id);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    console.log("Joining room with password:", selectedRoom?.id, password);
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
      setRooms((prevRooms) => [
        ...prevRooms,
        {
          id: String(prevRooms.length + 1),
          name: `Battle Room ${prevRooms.length + 1}`,
          isPasswordProtected: Math.random() > 0.5,
          players: Math.floor(Math.random() * 2) + 1,
          maxPlayers: 2,
          status: Math.random() > 0.5 ? "waiting" : "in_progress",
        },
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              className={`refresh-button ${isRefreshing ? "refreshing" : ""}`}
              disabled={isRefreshing}
            >
              <RefreshIcon />
            </button>
          </div>
          <div className="rooms-list">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className={`room-item ${
                  selectedRoom?.id === room.id ? "selected" : ""
                }`}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="room-info">
                  <span className="room-name">
                    {room.isPasswordProtected && (
                      <span className="lock-icon">🔒 </span>
                    )}
                    {room.name}
                  </span>
                  <div className="room-stats">
                    <span className="room-players">
                      {room.players}/{room.maxPlayers}
                    </span>
                    <span className={`room-status ${room.status}`}>
                      {room.status === "waiting" ? "Waiting" : "In Progress"}
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
        roomName={selectedRoom?.name || ""}
      />
    </>
  );
};

export default RoomListModal;
