import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/theme-context";

interface PasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  roomName: string;
}
const PasswordModal: React.FC<PasswordModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  roomName,
}) => {
  const { theme } = useTheme();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isVisible) {
      setPassword("");
      setError("");
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    onSubmit(password);
  };

  if (!isVisible) return null;

  return (
    <div className={`modal-overlay theme-${theme}`}>
      <div className="modal-content password-modal modal-room-password">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Enter Room Password</h2>
        <p className="room-name-display">Room: {roomName}</p>
        <form onSubmit={handleSubmit}>
          <div className="password-input-container">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter password"
              className={`password-input ${error ? "error" : ""}`}
              autoFocus
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="modal-buttons">
            <button
              type="button"
              className="modal-button cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="modal-button submit-button">
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
