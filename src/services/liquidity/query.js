import { QueryClientImpl } from "comdex-codec/build/comdex/liquidity/v1beta1/query";
import { createQueryClient } from "../helper";

export const queryParams = (callback) => {
  createQueryClient((error, client) => {
    if (error) {
      callback(error);
      return;
    }

    const queryService = new QueryClientImpl(client);

    queryService
      .Params()
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => callback(error?.message));
  });
};
