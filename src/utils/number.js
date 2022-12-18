import { Decimal } from "@cosmjs/math";
import { DOLLAR_DECIMALS } from "../constants/common";
import { denomToCoingeckoTokenId } from "./string";

export const formatNumber = (number) => {
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(DOLLAR_DECIMALS) + "K";
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(DOLLAR_DECIMALS) + "M";
  } else if (number < 1000) {
    return number;
  }
};

export const commaSeparator = (value) => {
  const array = value.toString().split(".");
  const stringWithComma = array[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (array[1]) {
    return stringWithComma.concat(".", array[1]);
  }

  return stringWithComma;
};

export const decimalConversion = (data) => {
  if (Number(data) < 0) {
    return "0";
  }

  return Decimal.fromAtomics(data || "0", 18).toString();
};

export const marketPrice = (marketsMap, denom, assetId) => {
  const value = marketsMap?.map && marketsMap?.map[assetId]

  if (denom === "ucmst") {
    return 1;
  }

  if (value && value?.twa && value?.isPriceActive) {
    return value?.twa?.toNumber() / 1000000;
  }

  else if (marketsMap?.coingekoPrice) {
    let price = marketsMap?.coingekoPrice[denomToCoingeckoTokenId(denom)];
    if (price) {
      return price?.usd;
    }
  }

  return 0;
};

export const getAccountNumber = (value) => {
  return value === "" ? "0" : value;
};
