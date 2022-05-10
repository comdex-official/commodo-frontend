import { sha256 } from "@cosmjs/crypto";
import { comdex } from "../config/network";
import { denomConversion } from "./coin";
import { calculatePoolShare } from "./calculations";
import { ibcDenoms } from "../config/network";

const encoding = require("@cosmjs/encoding");

export const decode = (hash) =>
  decodeURIComponent(hash.replace("#", "")) || undefined;

export const generateHash = (txBytes) =>
  encoding.toHex(sha256(txBytes)).toUpperCase();

export const ibcDenomToDenom = (key) => {
  switch (key) {
    case ibcDenoms["uatom"]:
      return "uatom";
    case ibcDenoms["uusd"]:
      return "uust";
    case ibcDenoms["uluna"]:
      return "uluna";
    case ibcDenoms["uxprt"]:
      return "uxprt";
    case ibcDenoms["uosmo"]:
      return "uosmo";
    default:
      return "";
  }
};

export const denomToSymbol = (key) => {
  switch (key) {
    case "uatom":
    case ibcDenoms["uatom"]:
      return "ATOM";
    case "udvpn":
      return "DVPN";
    case "uusd":
    case "uust":
    case ibcDenoms["uusd"]:
      return "USD";
    case "uxprt":
    case ibcDenoms["uxprt"]:
      return "XPRT";
    case "uluna":
    case ibcDenoms["uluna"]:
      return "LUNA";
    case "uosmo":
    case ibcDenoms["uosmo"]:
      return "OSMO";
    case "ucmdx":
      return "CMDX";
    case "ucgold":
      return "XAU";
    case "ucsilver":
      return "XAG";
    case "ucoil":
      return "OIL";
    default:
      return "cosmos";
  }
};

export const iconNameFromDenom = (key) => {
  switch (key) {
    case "ucgold":
      return "gold-icon";
    case "ucsilver":
      return "silver-icon";
    case "ucoil":
      return "crude-oil";
    case "uatom":
    case ibcDenoms["uatom"]:
      return "atom-icon";
    case "ucmdx":
      return "comdex-icon";
    case "uust":
    case ibcDenoms["uusd"]:
      return "ust-icon";
    case "uusd":
      return "ust-icon";
    case "uxprt":
    case ibcDenoms["uxprt"]:
      return "xprt-icon";
    case "uluna":
    case ibcDenoms["uluna"]:
      return "luna-icon";
    case "uosmo":
    case ibcDenoms["uosmo"]:
      return "osmosis-icon";
    default:
      return "";
  }
};

export const trimWhiteSpaces = (data) => data.split(" ").join("");

export const truncateString = (string, front, back) =>
  `${string.substr(0, front)}...${string.substr(
    string.length - back,
    string.length
  )}`;

export const lowercaseFirstLetter = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1).toUpperCase();
};

//Considering input with given decimal point only.
export const toDecimals = (value, decimal = comdex.coinDecimals) =>
  value.indexOf(".") >= 0
    ? value.substr(0, value.indexOf(".")) +
      value.substr(value.indexOf("."), decimal + 1)
    : value;

export const showTotalAssetCount = (asset) => {
  return `${(asset && calculatePoolShare(asset)) || 0} ${denomConversion(
    asset?.denom || ""
  )}`;
};

export const showUserAssetCount = (assetShare, denom) => {
  return `${assetShare} ${denomConversion(denom) || ""}`;
};

export const uniqueDenoms = (list, type) => {
  return [
    ...new Set(
      list && list.length > 0
        ? list.map((item) => (type === "in" ? item.denomIn : item.denomOut))
        : []
    ),
  ];
};