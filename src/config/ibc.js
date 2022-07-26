import { ibcDenoms } from "./network";

export const ibcAssetsInfo = [
  {
    counterpartyChainId: "theta-testnet-001",
    //cosmos
    sourceChannelId: "channel-1",
    destChannelId: "channel-308",
    coinMinimalDenom: "uatom",
    ibcDenomHash: ibcDenoms["uatom"],
  },
  {
    counterpartyChainId: "osmo-test-4",
    sourceChannelId: "channel-1",
    destChannelId: "channel-346",
    coinMinimalDenom: "uosmo",
    ibcDenomHash: ibcDenoms["uosmo"],
  },
];
