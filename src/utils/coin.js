import AssetList from "../config/ibc_assets.json";
import { comdex } from "../config/network";
import { DOLLAR_DECIMALS } from "../constants/common";
import { commaSeparator, getExponent } from "./number";
import { lowercaseFirstLetter } from "./string";

const getDenomToDisplaySymbolMap = () => {
  let myMap = {};

  for (let i = 0; i < AssetList?.tokens?.length; i++) {
    if (myMap[AssetList?.tokens[i].ibcDenomHash] === undefined) {
      myMap[AssetList?.tokens[i].ibcDenomHash] = AssetList?.tokens[i]?.symbol;
    }
  }

  return myMap;
};

let denomToDisplaySymbol = getDenomToDisplaySymbolMap();

export const getAmount = (selectedAmount, decimal) =>
  (selectedAmount * (decimal || 10 ** comdex.coinDecimals))
    .toFixed(0)
    .toString();

export const amountConversionWithComma = (amount, decimals) => {
  let finiteAmount = isFinite(Number(amount)) ? Number(amount) : 0;

  const result = Number(finiteAmount) / (decimals || 10 ** comdex.coinDecimals);

  return commaSeparator(
    result.toFixed(getExponent(decimals) || comdex.coinDecimals)
  );
};

export const commaSeparatorWithRounding = (amount, round) => {
  return commaSeparator(Number(amount).toFixed(getExponent(round) + 1));
};

export const amountConversion = (amount, decimals) => {
  let finiteAmount = isFinite(Number(amount)) ? Number(amount) : 0;

  const result = Number(finiteAmount) / (decimals || 10 ** comdex.coinDecimals);

  return result.toFixed(getExponent(decimals) || comdex.coinDecimals);
};

export const orderPriceConversion = (amount) => {
  const result = Number(amount) * 10 ** 18;
  return result.toFixed(0).toString();
};

export const denomConversion = (denom) => {
  if (denomToDisplaySymbol[denom]) {
    return denomToDisplaySymbol[denom];
  }

  if (denom && denom.substr(0, 1) === "u") {
    if (
      denom &&
      denom.substr(0, 2) === "uc" &&
      !(denom.substr(0, 3) === "ucm")
    ) {
      return (
        denom.substr(1, denom.length) &&
        lowercaseFirstLetter(denom.substr(1, denom.length))
      );
    }
    return (
      denom.substr(1, denom.length) &&
      denom.substr(1, denom.length).toUpperCase()
    );
  }
};

export const getDenomBalance = (balances, denom) =>
  balances &&
  balances.length > 0 &&
  balances.find((item) => item.denom === denom) &&
  balances.find((item) => item.denom === denom).amount;
