import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/theme-context";
import FallingSand from "./falling-sand";
import { GameLayout, HomePage } from "./home";
import Home from "./battleship/home";
import Battleship from "./battleship";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/falling-sand"
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
                <Home />
              </GameLayout>
            }
          />
          <Route
            path="/battleship/create"
            element={
              <GameLayout>
                <Battleship />
              </GameLayout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
