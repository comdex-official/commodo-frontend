import { QueryClientImpl } from "comdex-codec/build/comdex/lend/v1beta1/query";
import Long from "long";
import { APP_ID } from "../../constants/common";
import { createQueryClient } from "../helper";

export const queryLendPools = (
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

    new QueryClientImpl(rpcClient)
      .QueryPools({
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

export const queryLendPool = (poolId, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryPool({ id: Long.fromNumber(poolId) })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryAssetStats = (assetId, poolId, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryAssetStats({
        assetId: Long.fromNumber(assetId),
        poolId: Long.fromNumber(poolId),
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryUserLends = (address, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryAllLendByOwner({ owner: address })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryLendPosition = (id, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryLend({ id: Long.fromNumber(id) })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryBorrowPosition = (id, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryBorrow({ id: Long.fromNumber(id) })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryAssetRatesStats = (callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryAssetRatesStats({})
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryModuleBalance = (poolId, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryModuleBalance({ poolId: Long.fromNumber(poolId) })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryUserPoolLends = (address, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryAllLendByOwner({
        owner: address,
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryAssetPairs = (assetId, poolId, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryAssetToPairMapping({
        assetId: Long.fromNumber(assetId),
        poolId: Long.fromNumber(poolId),
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryLendPair = (id, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryPair({
        id: Long.fromNumber(id),
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryUserBorrows = (address, callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryAllBorrowByOwner({ owner: address })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryDepositStats = (callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryDepositStats()
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryUserDepositStats = (callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryUserDepositStats()
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryBorrowStats = (callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryBorrowStats()
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const queryAuctionMippingIdParams = (callback) => {
  createQueryClient((error, rpcClient) => {
    if (error) {
      callback(error);
      return;
    }

    new QueryClientImpl(rpcClient)
      .QueryAuctionParams({
        appId: Long.fromNumber(APP_ID),
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => callback(error?.message));
  });
};