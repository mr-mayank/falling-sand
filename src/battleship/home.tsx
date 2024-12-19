import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Battleship from "./battleship";
import { GameLayout } from "../components/home";
import BattleArena from "./arena";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="battle-home-container">
            <h1 className="battle-title">Battleship</h1>
            <p className="battle-description">
              Place your ship without showing your opponent and take turns
              guessing your opponent's ship locations.
            </p>
            <div className="buttons-container">
              <button
                className="battle-home-button play-vs-bot"
                onClick={() => navigate("/battleship/create")}
              >
                Play vs Bot
              </button>
              <button
                className="battle-home-button play-vs-friend"
                onClick={() => navigate("#")}
              >
                Play vs Friend
              </button>
            </div>
          </div>
        }
      />
      <Route
        path="create"
        element={
          <GameLayout>
            <Battleship />
          </GameLayout>
        }
      />
      <Route
        path=":id"
        element={
          <GameLayout>
            <BattleArena />
          </GameLayout>
        }
      />
    </Routes>
  );
};

export default Home;
