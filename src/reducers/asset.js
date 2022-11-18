import { combineReducers } from "redux";
import {
    ASSETS_SET, PAIRS_SET, PAIR_ID_SET, PAIR_SET
} from "../constants/asset";

const pairs = (
  state = {
    list: [],
    pagination: {},
  },
  action
) => {
  if (action.type === PAIRS_SET) {
    return {
      list: action.list,
      pagination: action.pagination,
    };
  }

  return state;
};

const _ = (
  state = {
    list: [],
    pagination: {},
    inProgress: false,
    map: {},
    assetDenomMap: {}
  },
  action
) => {
  if (action.type === ASSETS_SET) {
    return {
      ...state,
      list: action.list,
      pagination: action.pagination,
      map: action.map,
      assetDenomMap: action.assetDenomMap
      
    };
  }

  return state;
};

const pairId = (state = null, action) => {
  if (action.type === PAIR_ID_SET) {
    return action?.value || state;
  }

  return state;
};

const pair = (state = {}, action) => {
  if (action.type === PAIR_SET) {
    return action?.value || state;
  }

  return state;
};

export default combineReducers({
  pairs,
  pairId,
  pair,
  _,
});
