import { useMutation } from "react-query";

import apiClient from "../../../../apis/api-client";
import { IAPIError, IAxiosResponse, IUpdateGameBoard } from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils/enum";

interface IUpdateBoard {
  turn: string;
}

const updateGameBoard = async (updateGameBoard: IUpdateGameBoard) => {
  const result = await apiClient.post<
    IUpdateGameBoard,
    IAxiosResponse<IUpdateBoard>
  >(APIS_ROUTES.UPDATE_GAME_BOARD, updateGameBoard);

  return result.data.Data;
};

const useUpdateGameBoard = () =>
  useMutation<IUpdateBoard, IAPIError, IUpdateGameBoard>(
    [API_MUTATION_KEY.UPDATE_GAME_BOARD],
    updateGameBoard
  );

export default useUpdateGameBoard;
