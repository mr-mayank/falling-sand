import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Battleship from "./battleship";
import { GameLayout } from "../../components/home";
import BattleArena from "./arena";
import { useUser } from "../../context/user-context";
import LoginModal from "../../components/login-modal";
import "../../assets/css/game-modal.css";
import RoomListModal from "../../components/room-list-modal";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const handlePlayVsFriend = () => {
    if (user) {
      setIsRoomModalVisible(true);
    } else {
      setIsLoginModalVisible(true);
    }
  };

  return (
    <>
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
                  onClick={handlePlayVsFriend}
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

      <LoginModal
        isVisible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
      />

      <RoomListModal
        isVisible={isRoomModalVisible}
        onClose={() => setIsRoomModalVisible(false)}
      />
    </>
  );
};

export default Home;
