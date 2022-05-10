import { QueryServiceClientImpl } from "comdex-codec/build/comdex/auction/v1beta1/querier";
import Long from "long";
import { createQueryClient } from "../helper";

export const queryActionList = (
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
      .QueryAuctions({
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

export const queryBiddingList = (bidder, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryServiceClientImpl(rpcClient)
      .QueryBiddings({
        bidder,
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryAuctionParams = (callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryServiceClientImpl(rpcClient)
      .QueryParams()
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => callback(error?.message));
  });
};
