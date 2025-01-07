import { useMutation } from "react-query";

import apiClient from "../../../../apis/api-client";
import {
  IAPIError,
  IAxiosResponse,
  IJoinGame,
  ILinkData,
} from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

const joinGame = async (joinGame: IJoinGame) => {
  const result = await apiClient.post<IJoinGame, IAxiosResponse<ILinkData>>(
    APIS_ROUTES.JOIN_GAME,
    joinGame
  );

  return result.data.Data;
};

const useJoinGame = () =>
  useMutation<ILinkData, IAPIError, IJoinGame>(
    [API_MUTATION_KEY.JOIN_GAME],
    joinGame
  );

export default useJoinGame;
