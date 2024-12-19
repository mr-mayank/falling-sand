import React from "react";
import "../../assets/css/battleship-loader.css";
import { useTheme } from "../../context/theme-context";

const BattleshipLoader = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`loader-container ${
        theme === "dark" ? "theme-dark" : "theme-light"
      }`}
    >
      <div className="ocean">
        <div className="submarine-wrapper">
          <div className="submarine-body">
            <div className="window"></div>
            <div className="engine"></div>
            <div className="light"></div>
          </div>
          <div className="helix"></div>
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
          <div className="bubble bubble-3"></div>
        </div>
      </div>
      <div className="loading-text">Preparing for Battle...</div>
    </div>
  );
};

export default BattleshipLoader;
