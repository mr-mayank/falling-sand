import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/theme-context";
import FallingSand from "./falling-sand/falling-sand";
import Battleship from "./battleship/battleship";
import { GameLayout, HomePage } from "./home/home";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/grid"
              element={
                <GameLayout>
                  <FallingSand />
                </GameLayout>
              }
            />
            <Route
              path="/battleship"
              element={
                <GameLayout>
                  <Battleship />
                </GameLayout>
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
