import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/theme-context";
import FallingSand from "./pages/falling-sand";
import { GameLayout, HomePage } from "./components/home";
import Home from "./pages/battleship/home";
import { UserProvider } from "./context/user-context";
import Auth from "./pages/authentication/auth";

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/auth"
              element={
                <GameLayout>
                  <Auth />
                </GameLayout>
              }
            />
            <Route
              path="/falling-sand"
              element={
                <GameLayout>
                  <FallingSand />
                </GameLayout>
              }
            />
            <Route
              path="/battleship/*"
              element={
                <GameLayout>
                  <Home />
                </GameLayout>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
