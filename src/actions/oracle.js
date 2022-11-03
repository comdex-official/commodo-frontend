import { MARKET_LIST_SET } from "../constants/oracle";

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