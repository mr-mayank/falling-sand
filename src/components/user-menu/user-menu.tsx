import React, { useState } from "react";
import UserIcon from "../../assets/icons/user-icon";
import { useUser } from "../../context/user-context";
import { useNavigate } from "react-router-dom";
const UserDropdown = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
  };

  const handleSignIn = (type: string) => {
    setIsDropdownOpen(false);
    navigate("/auth?" + type + "=true");
  };

  return (
    <div className="user-dropdown" style={{ position: "relative" }}>
      <button
        className="user-icon-button"
        onClick={toggleDropdown}
        aria-label="User Menu"
      >
        <UserIcon />
      </button>
      {isDropdownOpen && (
        <div className="dropdown-menu">
          {false ? (
            <>
              <div className="user-info">
                <span className="user-name">{"userName"}</span>
                <span className="user-email">{"userEmail"}</span>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                className="dropdown-item"
                onClick={() => handleSignIn("signin")}
              >
                Sign In
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleSignIn("signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
