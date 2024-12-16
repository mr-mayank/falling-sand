import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="battle-home-container">
      <h1 className="battle-title">Battleship</h1>
      <p className="battle-description">
        Place your ship without showing your opponent and take turns guessing
        your opponent's ship locations.
      </p>
      <div className="buttons-container">
        <button
          className="battle-home-button play-vs-bot"
          onClick={() => navigate(`/battleship/create`)}
        >
          Play vs Bot
        </button>
        <button
          className="battle-home-button play-vs-friend"
          onClick={() => navigate(`#`)}
        >
          Play vs Friend
        </button>
      </div>
    </div>
  );
};

export default Home;
