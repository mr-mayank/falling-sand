import React, { useState, useEffect, CSSProperties } from "react";
import "../../assets/css/game-result-modal.css";

interface FireworkType {
  id: number;
  left: number;
  targetHeight: number;
  shootDuration: number;
  type: string;
  sparkCount: number;
  color: string;
  isExploding: boolean;
}

interface GameResultModalProps {
  isWin: boolean;
  onHome: () => void;
  onNewGame: () => void;
  theme?: "light" | "dark";
}

const GameResultModal: React.FC<GameResultModalProps> = ({
  isWin,
  onHome,
  onNewGame,
  theme = "light",
}) => {
  const [fireworks, setFireworks] = useState<FireworkType[]>([]);
  const [showModal, setShowModal] = useState(false);

  const colors = [
    "#ff3333",
    "#33ff33",
    "#3333ff",
    "#ffff33",
    "#ff33ff",
    "#33ffff",
    "#ff9933",
    "#ff3399",
    "#ffffff",
  ];

  const createFirework = () => {
    const shootDuration = 0.8 + Math.random() * 0.3;
    const targetHeight = 30 + Math.random() * 20;

    const newFirework = {
      id: Date.now(),
      left: 20 + Math.random() * 60,
      targetHeight,
      shootDuration,
      type: ["circle", "chrysanthemum", "willow"][
        Math.floor(Math.random() * 3)
      ],
      sparkCount: 32 + Math.floor(Math.random() * 16),
      color: colors[Math.floor(Math.random() * colors.length)],
      isExploding: false,
    };

    setFireworks((prev) => [...prev, newFirework]);

    // Trigger explosion at the peak
    setTimeout(() => {
      setFireworks((prev) =>
        prev.map((fw) =>
          fw.id === newFirework.id ? { ...fw, isExploding: true } : fw
        )
      );
    }, shootDuration * 1000); // Full shoot duration for the peak

    // Remove firework after complete animation
    setTimeout(() => {
      setFireworks((prev) => prev.filter((fw) => fw.id !== newFirework.id));
    }, shootDuration * 1000 + 1500);
  };

  useEffect(() => {
    setShowModal(true);
    if (isWin) {
      // Initial burst
      for (let i = 0; i < 7; i++) {
        setTimeout(() => createFirework(), i * 200);
      }

      // Continuous fireworks
      const interval = setInterval(() => {
        if (Math.random() > 0.2) {
          createFirework();
        }
      }, 300);

      return () => clearInterval(interval);
    }

    //eslint-disable-next-line
  }, [isWin]);

  const renderFirework = (firework: FireworkType) => {
    const sparks = [];
    for (let i = 0; i < firework.sparkCount; i++) {
      const angle = (360 / firework.sparkCount) * i;
      sparks.push(
        <div
          key={i}
          className="trail"
          style={
            {
              transform: `rotate(${angle}deg)`,
              "--spark-color": firework.color,
            } as CSSProperties
          }
        >
          <div
            className="sparkle"
            style={{ "--spark-color": firework.color } as CSSProperties}
          />
        </div>
      );
    }

    const customStyle: CSSProperties = {
      left: `${firework.left}%`,
      "--shoot-duration": `${firework.shootDuration}s`,
      "--target-height": firework.targetHeight,
      backgroundColor: firework.color,
    } as CSSProperties;

    return (
      <div
        key={firework.id}
        className={`firework ${
          firework.isExploding ? "firework-exploding" : "firework-shooting"
        }`}
        style={customStyle}
      >
        {firework.isExploding && <div className="spark">{sparks}</div>}
      </div>
    );
  };

  return (
    <div
      className={`modal-container ${showModal ? "show" : ""}`}
      data-theme={theme}
    >
      <div className="modal-backdrop">
        {isWin && fireworks.map(renderFirework)}
      </div>

      <div className="modal-content">
        <div className="modal-icon">
          {isWin ? (
            <div className="trophy">🏆</div>
          ) : (
            <div className="skull">💀</div>
          )}
        </div>

        <div className="modal-text">
          <h2 className={`modal-title ${isWin ? "win" : "lose"}`}>
            {isWin ? "VICTORY!" : "DEFEAT!"}
          </h2>
          <p className="modal-subtitle">
            {isWin
              ? "Congratulations! You've won the battle!"
              : "Better luck next time, Captain!"}
          </p>
        </div>

        <div className="modal-buttons">
          <button onClick={onHome} className="home-button1">
            Home
          </button>
          <button
            onClick={onNewGame}
            className={`new-game-button ${isWin ? "win" : "lose"}`}
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultModal;
