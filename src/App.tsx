import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { ThemeProvider } from "./context/theme-context";
import FallingSand from "./pages/falling-sand";
import { GameLayout, HomePage } from "./components/home";
import Home from "./pages/battleship/home/home";
import NotAccess from "./components/not-access";
import { UserProvider } from "./context/user-context";
import Auth from "./pages/authentication/auth";
import queryClient from "./query-client";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
              
              <Route
                path="/not-access"
                element={
                  <GameLayout>
                    <NotAccess />
                  </GameLayout>
                }
              />

            </Routes>
          </Router>
        </ThemeProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
