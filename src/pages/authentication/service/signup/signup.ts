import { useMutation } from "react-query";

import apiClient from "../../../../apis/api-client";
import {
  IAPIError,
  IAxiosResponse,
  ISignUp,
  ILinkData,
} from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

const signup = async (signUp: ISignUp) => {
  const result = await apiClient.post<ISignUp, IAxiosResponse<ILinkData>>(
    APIS_ROUTES.SIGNUP,
    signUp
  );

  return result.data.Data;
};

const useSignup = () =>
  useMutation<ILinkData, IAPIError, ISignUp>([API_MUTATION_KEY.SIGNUP], signup);

export default useSignup;
