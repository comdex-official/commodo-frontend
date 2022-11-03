import { combineReducers } from "redux";
import { MARKET_LIST_SET } from "../constants/oracle";

const market = (
  state = {
    map: {},
    pagination: {},
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

  return state;
};

export default combineReducers({
  market,
});
