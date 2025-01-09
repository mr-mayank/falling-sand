import { useQuery } from "react-query";

import apiClient from "../../../../apis/api-client";
import { IAPIError, IAxiosResponse, IRoomsData } from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

interface IGetAllRoomsData {
  items: IRoomsData[];
  count: number;
}

const getAllRooms = async () => {
  const result = await apiClient.get<null, IAxiosResponse<IGetAllRoomsData>>(
    APIS_ROUTES.GET_ALL_ROOMS
  );

  return result.data.Data;
};

const useGetAllRooms = (isRoomModalVisible: boolean) =>
  useQuery<IGetAllRoomsData, IAPIError>(
    [API_MUTATION_KEY.GET_ALL_ROOMS],
    getAllRooms,
    {
      cacheTime: 0,
      enabled: isRoomModalVisible,
    }
  );

export default useGetAllRooms;
