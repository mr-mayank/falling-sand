import { useMutation } from "react-query";

import apiClient from "../../../../apis/api-client";
import {
  IAPIError,
  IAxiosResponse,
  IKickPlayer,
  ILinkData,
} from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

const kickPlayer = async (kickPlayer: IKickPlayer) => {
  const result = await apiClient.post<IKickPlayer, IAxiosResponse<ILinkData>>(
    APIS_ROUTES.KICK_PLAYER,
    kickPlayer
  );

  return result.data.Data;
};

const useKickPlayer = () =>
  useMutation<ILinkData, IAPIError, IKickPlayer>(
    [API_MUTATION_KEY.KICK_PLAYER],
    kickPlayer
  );

export default useKickPlayer;
