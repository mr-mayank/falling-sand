import React from "react";
import { Route, Routes } from "react-router-dom";
import Arena from "./arena";
import CreateBase from "./create-base";

const Multiplayer = () => {
  return (
    <Routes>
      <Route path="/create/:id" element={<CreateBase />} />
      <Route path="/start/:id" element={<Arena />} />
    </Routes>
  );
};

export default Multiplayer;
