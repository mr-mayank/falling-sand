import React from "react";
import useCreateRoomModalController from "./create-room-modal-controller";

interface CreateRoomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (roomData: {
    name: string;
    isPrivate: boolean;
    password?: string;
  }) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
}) => {
  const {
    roomName,
    isPrivate,
    password,
    error,
    handleSubmit,
    setRoomName,
    setIsPrivate,
    setPassword,
    setError,
    onModalClose,
  } = useCreateRoomModalController({ onClose, onSubmit });

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content create-room-modal">
        <button className="modal-close" onClick={onModalClose}>
          ×
        </button>
        <h2>Create New Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="roomName">Room Name</label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
                setError("");
              }}
              placeholder="Enter room name"
              className={error && !roomName ? "error" : ""}
            />
          </div>

          <div className="form-group radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="roomType"
                checked={!isPrivate}
                onChange={() => setIsPrivate(false)}
              />
              Public Room
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="roomType"
                checked={isPrivate}
                onChange={() => setIsPrivate(true)}
              />
              Private Room
            </label>
          </div>

          {isPrivate && (
            <div className="form-group">
              <label htmlFor="password">Room Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter room password"
                className={error && !password ? "error" : ""}
              />
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          <div className="modal-buttons">
            <button type="submit" className="modal-button create-button">
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
