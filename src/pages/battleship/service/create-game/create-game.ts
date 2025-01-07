import { useMutation } from "react-query";

import apiClient from "../../../../apis/api-client";
import {
  IAPIError,
  IAxiosResponse,
  ILinkData,
  ICreateGame,
} from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

const createGame = async (createGame: ICreateGame) => {
  const result = await apiClient.post<ICreateGame, IAxiosResponse<ILinkData>>(
    APIS_ROUTES.CREATE_GAME,
    createGame
  );

  return result.data.Data;
};

const useCreateGame = () =>
  useMutation<ILinkData, IAPIError, ICreateGame>(
    [API_MUTATION_KEY.CREATE_GAME],
    createGame
  );

export default useCreateGame;
