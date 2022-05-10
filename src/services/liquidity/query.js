import { QueryClientImpl } from "comdex-codec/build/comdex/liquidity/v1beta1/query";
import Long from "long";
import { createQueryClient } from "../helper";

export const queryPoolsList = (
  offset,
  limit,
  countTotal,
  reverse,
  callback
) => {
  createQueryClient((error, client) => {
    if (error) {
      callback(error);
      return;
    }

    const queryService = new QueryClientImpl(client);

    queryService
      .LiquidityPools({
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
      .catch((error) => callback(error?.message));
  });
};

export const queryPool = (id, callback) => {
  createQueryClient((error, client) => {
    if (error) {
      callback(error);
      return;
    }

    const queryService = new QueryClientImpl(client);

    queryService
      .LiquidityPool({ poolId: Long.fromNumber(id) })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => callback(error?.message));
  });
};

export const queryPoolDeposits = (
  poolId,
  offset,
  limit,
  countTotal,
  reverse,
  callback
) => {
  createQueryClient((error, client) => {
    if (error) {
      callback(error);
      return;
    }

    const queryService = new QueryClientImpl(client);

    queryService
      .PoolBatchDepositMsgs({
        poolId,
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
      .catch((error) => callback(error?.message));
  });
};

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

export const queryUserPoolShare = (address,callback) => {
  createQueryClient((error, client) => {
    if (error) {
      callback(error);
      return;
    }

    const queryService = new QueryClientImpl(client);

    queryService
      .UserPoolsContribution({
        userAddress: address,
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => callback(error?.message));
  });
};