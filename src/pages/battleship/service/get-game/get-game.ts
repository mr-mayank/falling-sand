import { useQuery } from "react-query";

import apiClient from "../../../../apis/api-client";
import { IAPIError, IAxiosResponse } from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

interface GameRoom {
  id: string;
  name: string;
  isPrivate: boolean;
  player1: {
    id: string;
    name: string;
  };
  player2?: {
    id: string;
    name: string;
  };
  status: string;
}
const getGame = async (id?: string) => {
  const result = await apiClient.get<null, IAxiosResponse<GameRoom>>(
    `${APIS_ROUTES.GET_GAME}/${id}`
  );

  return result.data.Data;
};

const useGetGame = (id?: string) =>
  useQuery<GameRoom, IAPIError>(
    [API_MUTATION_KEY.GET_GAME],
    () => getGame(id),
    {
      cacheTime: 0,
      enabled: !!id,
    }
  );

export default useGetGame;
