import { combineReducers } from "redux";
import { MARKET_LIST_SET, SET_COINGEKO_PRICE } from "../constants/oracle";

const market = (
  state = {
    map: {},
    pagination: {},
  },
  action
) => {
  switch (action.type) {
    case MARKET_LIST_SET:
      return {
        ...state,
        map: action.map,
        pagination: action.pagination,
      };
    case SET_COINGEKO_PRICE:
      return {
        ...state,
        coingekoPrice: action.value,
      };
    default:
      return state;
  }
};

export default combineReducers({
  market,
});
