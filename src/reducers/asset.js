import { combineReducers } from "redux";
import {
  ASSETS_SET,
  ASSET_STAT_MAP_SET,
  PAIRS_SET,
  PAIR_ID_SET,
  PAIR_SET,
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
    assetDenomMap: {},
    assetNameMap: {},
  },
  action
) => {
  if (action.type === ASSETS_SET) {
    return {
      ...state,
      list: action.list,
      pagination: action.pagination,
      map: action.map,
      assetDenomMap: action.assetDenomMap,
      assetNameMap: action.assetNameMap,
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

const assetStatMap = (state = {}, action) => {
  if (action.type === ASSET_STAT_MAP_SET) {
    return {
      ...state,
      [action.assetId]: action?.value,
    };
  }

  return state;
};

export default combineReducers({
  pairs,
  pairId,
  pair,
  _,
  assetStatMap,
});
