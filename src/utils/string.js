import { sha256, stringToPath } from "@cosmjs/crypto";
import AssetList from "../config/ibc_assets.json";
import { comdex, ibcDenoms } from "../config/network";
import { getExponent } from "./number";

const encoding = require("@cosmjs/encoding");

const getIbcDenomToDenomMap = () => {
  let myMap = {};

  for (let i = 0; i < AssetList?.tokens?.length; i++) {
    if (myMap[AssetList?.tokens[i].ibcDenomHash] === undefined) {
      myMap[AssetList?.tokens[i].ibcDenomHash] =
        AssetList?.tokens[i]?.coinMinimalDenom;
    }
  }

  return myMap;
};

let ibcDenomToDenomMap = getIbcDenomToDenomMap();

const getIbcDenomToCoinGeckoIdMap = () => {
  let myMap = {};

  for (let i = 0; i < AssetList?.tokens?.length; i++) {
    if (myMap[AssetList?.tokens[i].ibcDenomHash] === undefined) {
      myMap[AssetList?.tokens[i].ibcDenomHash] =
        AssetList?.tokens[i]?.coinGeckoId;
    }
  }

  return myMap;
};

let ibcDenomToCoingeckoIdMap = getIbcDenomToCoinGeckoIdMap();

export const decode = (hash) =>
  decodeURIComponent(hash.replace("#", "")) || undefined;

export const generateHash = (txBytes) =>
  encoding.toHex(sha256(txBytes)).toUpperCase();

export const ibcDenomToDenom = (key) => ibcDenomToDenomMap?.[key];

export const denomToCoingeckoTokenId = (key) => ibcDenomToCoingeckoIdMap?.[key];

const iconMap = {
  ucmdx: "cmdx-icon",
  ucmst: "cmst-icon",
  uharbor: "harbor-icon",
  // taking coinMinimalDenom to match ibc denom and fetch icon.
  [ibcDenoms["uatom"]]: "atom-icon",
  [ibcDenoms["uosmo"]]: "osmosis-icon",
  [ibcDenoms["uusdc"]]: "usdc-icon",
  [ibcDenoms["weth-wei"]]: "weth-icon",
  [ibcDenoms["ujuno"]]: "juno-icon",
  [ibcDenoms["wbtc-satoshi"]]: "wbtc-icon",
  [ibcDenoms["stuatom"]]: "statom-icon",
  [ibcDenoms["wmatic-wei"]]: "wmatic-icon",
  [ibcDenoms["dai-wei"]]: "dai-icon",
  [ibcDenoms["aevmos"]]: "evmos-icon",
  [ibcDenoms["wbnb-wei"]]: "wbnb-icon",
  [ibcDenoms["uluna"]]: "luna2-icon",
  [ibcDenoms["acanto"]]: "canto-icon",
  [ibcDenoms["uakt"]]: "akt-icon",
  [ibcDenoms["uxprt"]]: "xprt-icon",
  [ibcDenoms["stuosmo"]]: "stosmo-icon",
  [ibcDenoms["wftm-wei"]]: "wfmt-icon",
  [ibcDenoms["umntl"]]: "mntl-icon",
  [ibcDenoms["shib-wei"]]: "shib-icon",
  [ibcDenoms["uhuahua"]]: "huahua-icon",
  [ibcDenoms["gravity0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"]]:
    "gusdc-icon",
  [ibcDenoms["stkATOM"]]: "stkatom-icon",
  [ibcDenoms["gravity0x6B175474E89094C44Da98b954EedeAC495271d0F"]]: "gdai-icon",
  [ibcDenoms["stujuno"]]: "stujuno-icon",
  [ibcDenoms["stuluna"]]: "stuluna-icon",
  [ibcDenoms["stevmos"]]: "stevmos-icon",
};

export const iconNameFromDenom = (denom) => {
  if (denom) {
    return iconMap[denom];
  }
};

export const trimWhiteSpaces = (data) => data.split(" ").join("");

export const truncateString = (string, front, back) => {
  if (typeof string === "string") {
    return `${string?.substr(0, front)}...${string?.substr(
      string?.length - back,
      string?.length
    )}`;
  }
};

export const lowercaseFirstLetter = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1).toUpperCase();
};

//Considering input with given decimal point only.
export const toDecimals = (value, decimal) =>
  value.indexOf(".") >= 0
    ? value.substr(0, value.indexOf(".")) +
      value.substr(
        value.indexOf("."),
        Number(decimal)
          ? Number(getExponent(decimal)) + 1
          : comdex?.coinDecimals + 1 // characters from start to end (exclusive) that's why we add 1 here.
      )
    : value;

export const uniqueDenoms = (list, type) => {
  return [
    ...new Set(
      list && list.length > 0
        ? list.map((item) => (type === "in" ? item.denomIn : item.denomOut))
        : []
    ),
  ];
};

export const proposalStatusMap = {
  PROPOSAL_STATUS_UNSPECIFIED: "Nil",
  PROPOSAL_STATUS_DEPOSIT_PERIOD: "Deposit Period",
  PROPOSAL_STATUS_VOTING_PERIOD: "Voting Period",
  PROPOSAL_STATUS_PASSED: "Passed",
  PROPOSAL_STATUS_REJECTED: "Rejected",
  PROPOSAL_STATUS_FAILED: "Failed",
};

export const proposalOptionMap = {
  1: "Yes",
  2: "Abstain",
  3: "No",
  4: "No With Veto",
};

export const makeHdPath = (
  accountNumber = "0",
  addressIndex = "0",
  coinType = comdex?.coinType
) => {
  return stringToPath(
    "m/44'/" + coinType + "'/" + accountNumber + "'/0/" + addressIndex
  );
};

export const ucDenomToDenom = (denom) => {
  return denom?.slice(0, 1) + denom?.slice(2); //example uccmdx => ucmdx
};

export const stringTagParser = (input) => {
  const lines = input.split("\n");
  const output = [];
  lines.forEach((d, i) => {
    if (i > 0) {
      output.push(<br />);
    }
    output.push(d);
  });
  return output;
};

export const errorMessageMappingParser = (message) => {
  var str = message;

  var truncatedString = str?.match(/ibc\/\w{64}/g);

  for (var i = 0; i < truncatedString?.length; i++) {
    str = str.replace(
      truncatedString[i],
      " " + `${ibcDenomToDenom(truncatedString[i])}`
    );
  }
  return str;
};

export const getLastWord = (inputString) => {
  const parts = inputString.split(".");
  const text = parts[parts.length - 1];
  return text.replace(/([a-z])([A-Z])/g, "$1 $2");
};
