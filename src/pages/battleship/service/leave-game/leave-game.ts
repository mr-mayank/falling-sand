import { useMutation } from "react-query";

import apiClient from "../../../../apis/api-client";
import {
  IAPIError,
  IAxiosResponse,
  ILeaveGame,
  ILinkData,
} from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

const leaveGame = async (leaveGame: ILeaveGame) => {
  const result = await apiClient.post<ILeaveGame, IAxiosResponse<ILinkData>>(
    APIS_ROUTES.LEAVE_GAME,
    leaveGame
  );

  return result.data.Data;
};

const useLeaveGame = () =>
  useMutation<ILinkData, IAPIError, ILeaveGame>(
    [API_MUTATION_KEY.LEAVE_GAME],
    leaveGame
  );

export default useLeaveGame;
