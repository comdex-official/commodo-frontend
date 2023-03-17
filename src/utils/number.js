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

  // if (denom === "ucmst") {
  //   return 1;
  // }

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

export const getExponent = (number) => {
  let count = 0;
  while (number > 1) {
    number = number / 10;
    count++;
  }

  return count;
};

export const detectBestDecimalsDisplay = (
  price,
  minDecimal = 2,
  minPrice = 1,
  maxDecimal
) => {
  if (price && price > minPrice) return minDecimal;
  let decimals = minDecimal;
  if (price !== undefined) {
    // Find out the number of leading floating zeros via regex
    const priceSplit = price.toString().split(".");
    if (priceSplit.length === 2 && priceSplit[0] === "0") {
      const leadingZeros = priceSplit[1].match(/^0+/);
      decimals += leadingZeros ? leadingZeros[0].length + 1 : 1;
    }
  }
  if (maxDecimal && decimals > maxDecimal) decimals = maxDecimal;
  return decimals;
};

export const formateNumberDecimalsAuto = ({
  price,
  maxDecimal,
  unit,
  minDecimal,
  minPrice,
}) => {
  minDecimal = minDecimal ? minDecimal : 2;
  minPrice = minPrice ? minPrice : 1;
  let res =
    formateNumberDecimals(
      price,
      detectBestDecimalsDisplay(price, minDecimal, minPrice, maxDecimal)
    ) + (unit ? unit : "");
  return res;
};

export const formateNumberDecimals = (price, decimals = 2) => {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: decimals,
  }).format(price);
};