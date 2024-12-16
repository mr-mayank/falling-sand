import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/theme-context";
import SunIcon from "../assets/icons/sun-icon";
import MoonIcon from "../assets/icons/moon-icon";
import HomeIcon from "../assets/icons/home-icon";
import React, { ReactNode } from "react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

// Animated Background Component
const AnimatedBackground = () => {
  const { theme } = useTheme();

  return (
    <div className={`animated-background theme-${theme}`}>
      {[...Array(20)].map((_, index) => (
        <div
          key={index}
          className="floating-element"
          style={{
            animationDelay: `${Math.random() * 10}s`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
};

// Home Page Component
const HomePage = () => {
  const { theme } = useTheme();

  return (
    <div className={`home-container theme-${theme}`}>
      <AnimatedBackground />
      <div className="content">
        <ThemeToggle />
        <h1 className="glitch" data-text="Game Playground">
          Game Playground
        </h1>
        <div className="game-links">
          <Link to="/falling-sand" className="game-link">
            <div className="game-card">
              <h2>Falling Sand</h2>
              <p>Simulate particle interactions</p>
            </div>
          </Link>
          <Link to="/battleship" className="game-link">
            <div className="game-card">
              <h2>Battleship</h2>
              <p>Naval strategy game</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Game Layout Component with Home Button
const GameLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className={`game-layout theme-${theme}`}>
      <ThemeToggle />
      <button
        onClick={() => navigate("/")}
        className="home-button"
        aria-label="Return to Home"
      >
        <HomeIcon />
      </button>
      {children}
    </div>
  );
};

export { GameLayout, HomePage };
