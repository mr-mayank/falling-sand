import React, { useRef, useState } from "react";
import UserIcon from "../../assets/icons/user-icon";
import { useUser } from "../../context/user-context";
import { useLocation, useNavigate } from "react-router-dom";
const UserDropdown = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<any>(null);

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const handleSignIn = (type: string) => {
    setIsDropdownOpen(false);
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
  const handleMouseLeave = (e: any) => {
    const dropdownElement = dropdownRef.current;
    const relatedTarget = e.relatedTarget;

    if (
      !dropdownElement?.contains(relatedTarget) &&
      !e.currentTarget.contains(relatedTarget)
    ) {
      setIsDropdownOpen(false);
    }
  };
  return (
    <div
      className="user-dropdown"
      style={{ position: "relative" }}
      onMouseLeave={(e) => handleMouseLeave(e)}
    >
      <button
        className="user-icon-button"
        onMouseEnter={() => setIsDropdownOpen(true)}
        aria-label="User Menu"
      >
        <UserIcon />
      </button>
      {isDropdownOpen && (
        <div
          onMouseEnter={() => setIsDropdownOpen(true)}
          className={`dropdown-menu`}
          id={`${isDropdownOpen ? "dropdown-open" : "dropdown"}`}
        >
          {user ? (
            <>
              <div className="user-info">
                {user?.name && <span className="user-name">{user.name}</span>}
                {user?.email && (
                  <span className="user-email">{user.email}</span>
                )}
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
