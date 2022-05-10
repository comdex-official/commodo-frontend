import { QueryServiceClientImpl } from "comdex-codec/build/comdex/market/v1beta1/querier";
import Long from "long";
import { createQueryClient } from "../helper";

export const queryMarketList = (
  offset,
  limit,
  countTotal,
  reverse,
  callback
) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryServiceClientImpl(rpcClient)
      .QueryMarkets({
        pagination: {
          key: "",
          offset: Long.fromNumber(offset),
          limit: Long.fromNumber(limit),
          countTotal: countTotal,
          reverse: reverse,
        },
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};
