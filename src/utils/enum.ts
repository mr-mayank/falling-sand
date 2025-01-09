export const USER_ACCESS_KEY = {
  TOKEN: "gameAccessToken",
};

export const API_MUTATION_KEY = {
  SIGNUP: "signup",
  SIGNIN: "signin",
  GET_USER_DETAILS: "get-user-details",
  CREATE_GAME: "create-game",
  GET_ALL_ROOMS: "get-all-rooms",
  GET_GAME: "get-game",
  JOIN_GAME: "join-game",
  LEAVE_GAME: "leave-game",
  UPDATE_GAME_BOARD: "update-game-board",
  KICK_PLAYER: "kick-player",
};

export const APIS_ROUTES = {
  SIGNUP: "/auth-service/v1/auth/signup",
  SIGNIN: "/auth-service/v1/auth/signin",
  GET_USER_DETAILS: "/auth-service/v1/auth/get-user-details",
  CREATE_GAME: "/battleship/v1/create",
  GET_ALL_ROOMS: "/battleship/v1/get-all-rooms",
  GET_GAME: "/battleship/v1/get-game",
  JOIN_GAME: "/battleship/v1/join",
  LEAVE_GAME: "/battleship/v1/leave",
  UPDATE_GAME_BOARD: "/battleship/v1/update-board",
  KICK_PLAYER: "/battleship/v1/kick",
  START_GAME: "battleship/v1/start",
};
