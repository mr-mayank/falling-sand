export interface IAPIError {
  response: {
    Status: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    Error?: {
      message: string;
      name: string;
      code?: string;
      errorCode?: string;
    };
  };
  status: number;
}

export interface IAxiosResponse<T> {
  data: {
    Data: T;
    Status: string;
  };
}

export interface ISignIn {
  username: string;
  password: string;
}

export interface ICreateGame {
  roomID: string;
  status: string;
  player1: string;
  password?: string;
}

export interface IJoinGame {
  roomID: string;
  player: string;
  password?: string;
}

export interface IKickPlayer {
  roomID: string;
  player: string;
}

export interface ILeaveGame {
  roomID: string;
  player: string;
}

export interface IStartGame {
  roomID: string;
  player: string;
}

export interface IUpdateGameBoard {
  roomID: string;
  player: string;
  board: string;
}

export interface ISignUp {
  username: string;
  password: string;
  email?: string;
}

export interface ILinkData {
  id: string;
  username: string;
  email: string;
  token: string;
}

export interface IUserDetails {
  id: string;
  name: string;
  email: string;
}

export interface IRoomsData {
  roomID: string;
  player1: string;
  player2: string;
  status: string;
  password: string;
  _id: string;
}
