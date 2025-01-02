import { QueryClient } from "react-query";

import { IAPIError } from "./types";
import { toast } from "react-toastify";

const onError = (error: unknown) => {
  const response = (error as IAPIError).response;

  if (response && response.Error) {
    toast.error(response.Error.message);
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      onError,
    },
    mutations: {
      onError,
    },
  },
});

export default queryClient;
