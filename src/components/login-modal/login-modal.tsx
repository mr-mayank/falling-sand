import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/theme-context";

interface LoginModalProps {
  isVisible: boolean;
  onClose: () => void;
}
const LoginModal: React.FC<LoginModalProps> = ({ isVisible, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const location = useLocation();

  if (!isVisible) return null;

  const handleSignIn = (type: string) => {
    const urlParams = new URLSearchParams(location.search);
    if (
      location.pathname !== "/auth" &&
      location.pathname !== "/auth?signin=true" &&
      location.pathname !== "/auth?signup=true" &&
      location.pathname.length > 1
    ) {
      navigate("/auth?" + type + "=true&redirect=" + location.pathname);
    } else if (urlParams.get("redirect")) {
      navigate(
        "/auth?" + type + "=truer&redirect=" + urlParams.get("redirect")
      );
    } else {
      navigate("/auth?" + type + "=true");
    }
  };

  return (
    <div className={`modal-overlay theme-${theme}`}>
      <div className="modal-content login-modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Authentication Required</h2>
        <p>You need to be logged in to play against a friend.</p>
        <div className="modal-buttons">
          <button
            className="modal-button signin-button"
            onClick={() => handleSignIn("signin")}
          >
            Sign In
          </button>
          <button
            className="modal-button create-account-button"
            onClick={() => handleSignIn("signup")}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
