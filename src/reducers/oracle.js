import { combineReducers } from "redux";
import { COINGECKO_PRICES_SET, MARKET_LIST_SET } from "../constants/oracle";

const market = (
  state = {
    map: {},
    pagination: {},
    coingecko: {},
  },
  action
) => {
  if (action.type === MARKET_LIST_SET) {
    return {
      ...state,
      map: action.map,
      pagination: action.pagination,
    };
  }

  if (action.type === COINGECKO_PRICES_SET) {
    return {
      ...state,
      coingecko: action.value,
    };
  }

  return state;
};

export default combineReducers({
  market,
});
