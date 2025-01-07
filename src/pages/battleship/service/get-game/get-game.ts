import { useQuery } from "react-query";

import apiClient from "../../../../apis/api-client";
import { IAPIError, IAxiosResponse, IRoomsData } from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

const getGame = async (id: string) => {
  const result = await apiClient.get<null, IAxiosResponse<IRoomsData>>(
    `${APIS_ROUTES.GET_GAME}/${id}`
  );

  return result.data.Data;
};

const useGetGame = (id: string) =>
  useQuery<IRoomsData, IAPIError>(
    [API_MUTATION_KEY.GET_GAME],
    () => getGame(id),
    {
      cacheTime: 0,
    }
  );

export default useGetGame;
