import { useQuery } from "react-query";

import apiClient from "../../../apis/api-client";
import { IAPIError, IAxiosResponse, IUserDetails } from "../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../utils/enum";

const getUserDetails = async () => {
  const result = await apiClient.get<null, IAxiosResponse<IUserDetails>>(
    APIS_ROUTES.GET_USER_DETAILS
  );

  return result.data.Data;
};

const useGetUserDetails = () =>
  useQuery<IUserDetails, IAPIError>(
    [API_MUTATION_KEY.GET_USER_DETAILS],
    getUserDetails,
    {
      cacheTime: 0,
    }
  );

export default useGetUserDetails;
