import { COINGECKO_PRICES_SET, MARKET_LIST_SET } from "../constants/oracle";

export const setMarkets = (list, pagination) => {
  const map = list.reduce((map, obj) => {
    map[obj?.assetId] = obj;
    return map;
  }, {});

  return {
    type: MARKET_LIST_SET,
    map,
    pagination,
  };
};

export const setCoinPrices = (value) => {
  return {
    type: COINGECKO_PRICES_SET,
    value,
  };
};