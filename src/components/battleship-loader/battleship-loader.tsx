import React from "react";
import "../../assets/css/battleship-loader.css";
import { useTheme } from "../../context/theme-context";
import { useParams } from "react-router-dom";

const BattleshipLoader = () => {
  const { theme } = useTheme();
  const { id } = useParams();

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
      {id && <div className="loading-text">Preparing for Battle...</div>}
    </div>
  );
};

export default BattleshipLoader;
