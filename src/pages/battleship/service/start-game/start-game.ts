import { useMutation } from "react-query";

import apiClient from "../../../../apis/api-client";
import {
  IAPIError,
  IAxiosResponse,
  IStartGame,
  ILinkData,
} from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

const startGame = async (startGame: IStartGame) => {
  const result = await apiClient.post<IStartGame, IAxiosResponse<ILinkData>>(
    APIS_ROUTES.START_GAME,
    startGame
  );

  return result.data.Data;
};

const useStartGame = () =>
  useMutation<ILinkData, IAPIError, IStartGame>(
    [API_MUTATION_KEY.CREATE_GAME],
    startGame
  );

export default useStartGame;
