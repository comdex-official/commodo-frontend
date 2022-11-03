import { Decimal } from "@cosmjs/math";
import { cmst } from "../config/network";
import { DOLLAR_DECIMALS } from "../constants/common";
import { denomToSymbol } from "./string";

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

export const marketPrice = (array, denom) => {
  if (denom === cmst?.coinMinimalDenom) {
    return 1;
  }

  const value = array?.filter((item) => item.symbol === denomToSymbol(denom));

  if (value && value[0]) {
    return value[0] && value[0].rates / 1000000;
  }

  return 0;
};

export const getAccountNumber = (value) => {
  return value === "" ? "0" : value;
};

export const getPoolPrice = (
  oraclePrice,
  oracleAssetDenom,
  firstAsset,
  secondAsset
) => {
  let x = firstAsset?.amount,
    y = secondAsset?.amount,
    xPoolPrice,
    yPoolPrice;

  if (oracleAssetDenom === firstAsset?.denom) {
    yPoolPrice = (x / y) * oraclePrice;
    xPoolPrice = (y / x) * yPoolPrice;
  } else {
    xPoolPrice = (y / x) * oraclePrice;
    yPoolPrice = (x / y) * xPoolPrice;
  }

  return { xPoolPrice, yPoolPrice };
};
