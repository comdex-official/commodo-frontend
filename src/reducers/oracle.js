import { combineReducers } from "redux";
import { MARKET_LIST_SET } from "../constants/oracle";

const markets = [
  {
    rates: "300000",
    script_id: "1",
    symbol: "CMDX",
  },
  {
    rates: "800000",
    script_id: "2",
    symbol: "ATOM",
  },
  {
    rates: "1000000",
    script_id: "3",
    symbol: "OSMO",
  },
  {
    rates: "1000000",
    script_id: "4",
    symbol: "CMST",
  },
  {
    rates: "50000",
    script_id: "5",
    symbol: "HARBOR",
  },
];

const market = (
  state = {
    list: markets,
    pagination: {},
  },
  action
) => {
  if (action.type === MARKET_LIST_SET) {
    return {
      ...state,
      list: action.list,
      pagination: action.pagination,
    };
  }

  return state;
};

export default combineReducers({
  market,
});
