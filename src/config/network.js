import AssetList from "../config/ibc_assets.json";
import { envConfig } from "./envConfig";

const getIbcDenomsMap = () => {
  let myMap = {};

  for (let i = 0; i < AssetList?.tokens?.length; i++) {
    if (myMap[AssetList?.tokens[i].coinMinimDenom] === undefined) {
      myMap[AssetList?.tokens[i].coinMinimalDenom] =
        AssetList?.tokens[i]?.ibcDenomHash;
    }
  }

  return myMap;
};

export const comdex = {
  chainId: envConfig?.chainId,
  chainName: envConfig?.chainName,
  rpc: envConfig?.rpc,
  rest: envConfig?.rest,
  explorerUrlToTx: envConfig?.explorerUrlToTx,
  walletUrlForStaking: envConfig?.walletUrlForStaking,
  coinDenom: envConfig?.coinDenom,
  coinMinimalDenom: envConfig?.coinMinimalDenom,
  coinDecimals: envConfig?.coinDecimals,
  prefix: envConfig?.prefix,
  coinType: envConfig?.coinDenom,
};

export const ibcDenoms = getIbcDenomsMap() || {};

export const cmst = {
  coinDenom: "CMST",
  coinMinimalDenom: "ucmst",
  coinDecimals: 6,
};

export const harbor = {
  coinDenom: "HARBOR",
  coinMinimalDenom: "uharbor",
  coinDecimals: 6,
};

export const assetTransitTypeId = {
  main: 1,
  first: 2,
  second: 3,
};
