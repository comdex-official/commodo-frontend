import { message } from "antd";
import axios from "axios";
import {
  ASSETS_SET, ASSET_STAT_MAP_SET, PAIRS_SET,
  PAIR_ID_SET, PAIR_SET
} from "../constants/asset";

export const setPairs = (list, pagination) => {
  return {
    type: PAIRS_SET,
    list,
    pagination,
  };
};

export const setPairId = (value) => {
  return {
    type: PAIR_ID_SET,
    value,
  };
};

export const setPair = (value) => {
  return {
    type: PAIR_SET,
    value,
  };
};

export const setAssets = (list, pagination) => {
  const assetHashMap = list.reduce((map, obj) => {
    map[obj?.id] = obj;
    return map;
  }, {});

  const assetDenomMap = list.reduce((map, obj) => {
    map[obj?.denom] = obj;
    return map;
  }, {});

  const assetNameMap = list.reduce((map, obj) => {
    map[obj?.name] = obj;
    return map;
  }, {});

  return {
    type: ASSETS_SET,
    list,
    map: assetHashMap,
    assetDenomMap: assetDenomMap,
    assetNameMap,
    pagination,
  };
};

export const fetchProofHeight = (rest, channel, callback) => {
  let url = `${rest}/ibc/core/channel/v1/channels/${channel}/ports/transfer`;
  const headers = {
    "Content-Type": "application/json",
  };

  axios
    .get(url, {
      headers,
    })
    .then((response) => {
      callback(null, response.data?.proof_height);
    })
    .catch((error) => {
      message.error(error?.message);
      callback(error?.message);
    });
};

export const setAssetStatMap = (assetId, value) => {
  return {
    type: ASSET_STAT_MAP_SET,
    assetId,
    value,
  };
};