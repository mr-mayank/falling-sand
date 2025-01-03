import React, { useState } from "react";

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
  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }

    if (isPrivate && !password.trim()) {
      setError("Password is required for private rooms");
      return;
    }

    onSubmit({
      name: roomName,
      isPrivate,
      ...(isPrivate && { password }),
    });

    // Reset form
    setRoomName("");
    setIsPrivate(false);
    setPassword("");
    setError("");
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content create-room-modal">
        <button className="modal-close" onClick={onClose}>
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
