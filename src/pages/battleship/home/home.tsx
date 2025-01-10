import React from "react";
import { Routes, Route } from "react-router-dom";
import Battleship from "../battleship";
import { GameLayout } from "../../../components/home";
import BattleArena from "../arena";
import LoginModal from "../components/login-modal";
import RoomListModal from "../components/room-list-modal";
import "../../../assets/css/game-modal.css";
import useHomeController from "./home-controller";
import LaunchPage from "../launch-page";

const Home = () => {
  const {
    navigate,
    isRoomModalVisible,
    isLoginModalVisible,
    allRoomsData,
    handlePlayVsFriend,
    setIsRoomModalVisible,
    setIsLoginModalVisible,
    handleRefreshRoomList,
  } = useHomeController();

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

        <Route
          path="launch/:id"
          element={
            <GameLayout>
              <LaunchPage />
            </GameLayout>
          }
        />
      </Routes>

      <LoginModal
        isVisible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
      />

      <RoomListModal
        allRoomsData={allRoomsData}
        isVisible={isRoomModalVisible}
        handleRefreshRoomList={handleRefreshRoomList}
        onClose={() => setIsRoomModalVisible(false)}
      />
    </>
  );
};

export default Home;
