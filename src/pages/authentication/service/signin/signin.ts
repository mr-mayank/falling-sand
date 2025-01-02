import { useMutation } from "react-query";

import apiClient from "../../../../apis/api-client";
import {
  IAPIError,
  IAxiosResponse,
  ISignIn,
  ILinkData,
} from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

const signin = async (signIn: ISignIn) => {
  const result = await apiClient.post<ISignIn, IAxiosResponse<ILinkData>>(
    APIS_ROUTES.SIGNIN,
    signIn
  );

  return result.data.Data;
};

const useSignin = () =>
  useMutation<ILinkData, IAPIError, ISignIn>([API_MUTATION_KEY.SIGNUP], signin);

export default useSignin;
