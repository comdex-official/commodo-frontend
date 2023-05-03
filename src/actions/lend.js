import { assetTransitTypeId } from "../config/network";
import {
  ASSET_RATES_STATES_SET,
  PAIR_SET,
  POOLS_LIQUIDITY_LIST_SET,
  POOLS_SET,
  POOL_BALANCE_FETCH_IN_PROGRESS,
  POOL_LENDS_SET,
  POOL_SET,
  POOL_TOKEN_SUPPLY_SET,
  SECOND_RESERVE_COIN_DENOM_SET,
  SPOT_PRICE_SET,
  USER_BORROWS_SET,
  USER_LENDS_SET
} from "../constants/lend";

export const setPools = (list, pagination) => {
  list?.map((item) => {
    const assetTransitMap = item?.assetData?.reduce((map, obj) => {
      map[obj?.assetTransitType] = obj;
      return map;
    }, {});

    let transitAssetIds = {
      main: assetTransitMap[assetTransitTypeId["main"]]?.assetId,
      first: assetTransitMap[assetTransitTypeId["first"]]?.assetId,
      second: assetTransitMap[assetTransitTypeId["second"]]?.assetId,
    };

    return (item["transitAssetIds"] = transitAssetIds);
  });

  return {
    type: POOLS_SET,
    list,
    pagination,
  };
};

export const setPool = (value) => {
  const assetTransitMap = value?.assetData?.reduce((map, obj) => {
    map[obj?.assetTransitType] = obj;
    return map;
  }, {});

  let transitAssetIds = {
    main: assetTransitMap[assetTransitTypeId["main"]]?.assetId,
    first: assetTransitMap[assetTransitTypeId["first"]]?.assetId,
    second: assetTransitMap[assetTransitTypeId["second"]]?.assetId,
  };

  value["transitAssetIds"] = transitAssetIds;

  return {
    type: POOL_SET,
    value,
  };
};

export const setFetchBalanceInProgress = (value) => {
  return {
    type: POOL_BALANCE_FETCH_IN_PROGRESS,
    value,
  };
};

export const setSpotPrice = (value) => {
  return {
    type: SPOT_PRICE_SET,
    value,
  };
};

export const setSecondReserveCoinDenom = (value) => {
  return {
    type: SECOND_RESERVE_COIN_DENOM_SET,
    value,
  };
};

export const setPoolTokenSupply = (value) => {
  return {
    type: POOL_TOKEN_SUPPLY_SET,
    value,
  };
};

export const setPoolLiquidityList = (value, index) => {
  return {
    type: POOLS_LIQUIDITY_LIST_SET,
    value,
    index,
  };
};

export const setAssetRatesStats = (list, pagination) => {
  const statsHashMap = list.reduce((map, obj) => {
    map[obj?.assetId] = obj;
    return map;
  }, {});

  return {
    type: ASSET_RATES_STATES_SET,
    map: statsHashMap,
    pagination,
  };
};

export const setUserLends = (list) => {
  const assetIdToLendMap = list.reduce((map, obj) => {
    map[obj?.assetId] = obj;
    return map;
  }, {});

  return {
    type: USER_LENDS_SET,
    list,
    assetIdToLendMap,
  };
};

export const setPoolLends = (list) => {
  return {
    type: POOL_LENDS_SET,
    list,
  };
};

export const setUserBorrows = (list) => {
  const borrowToLendMap = list.reduce((map, obj) => {
    map[obj?.lendingId?.toNumber()] = obj;
    return map;
  }, {});

  const pairIdToBorrowMap = list.reduce((map, obj) => {
    map[obj?.pairId] = obj;
    return map;
  }, {});

  return {
    type: USER_BORROWS_SET,
    list,
    borrowToLendMap,
    pairIdToBorrowMap,
  };
};

export const setPair = (value) => {
  return {
    type: PAIR_SET,
    value,
  };
};
