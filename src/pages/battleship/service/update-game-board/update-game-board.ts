import { useMutation } from "react-query";

import apiClient from "../../../../apis/api-client";
import {
  IAPIError,
  IAxiosResponse,
  IUpdateGameBoard,
  ILinkData,
} from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

const updateGameBoard = async (updateGameBoard: IUpdateGameBoard) => {
  const result = await apiClient.post<
    IUpdateGameBoard,
    IAxiosResponse<ILinkData>
  >(APIS_ROUTES.UPDATE_GAME_BOARD, updateGameBoard);

  return result.data.Data;
};

const useUpdateGameBoard = () =>
  useMutation<ILinkData, IAPIError, IUpdateGameBoard>(
    [API_MUTATION_KEY.UPDATE_GAME_BOARD],
    updateGameBoard
  );

export default useUpdateGameBoard;
