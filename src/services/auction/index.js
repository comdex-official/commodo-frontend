import { QueryClientImpl } from "comdex-codec/build/comdex/auction/v1beta1/querier";
import Long from "long";
import { createQueryClient } from "../helper";

export const queryAuctionParams = (callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryParams()
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => callback(error?.message));
  });
};
