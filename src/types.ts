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

export interface ISignUp {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
}

export interface ILinkData {
  id: string;
  username: string;
  email: string;
  token: string;
}
