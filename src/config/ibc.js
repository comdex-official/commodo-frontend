import { ibcDenoms } from "./network";

export const ibcAssetsInfo = [
  {
    counterpartyChainId: "theta-testnet-001",
    //cosmos
    sourceChannelId: "channel-8",
    destChannelId: "channel-498",
    coinMinimalDenom: "uatom",
    ibcDenomHash: ibcDenoms["uatom"],
  },
  {
    counterpartyChainId: "test-core-1",
    sourceChannelId: "channel-2",
    destChannelId: "channel-72",
    coinMinimalDenom: "uxprt",
    ibcDenomHash: ibcDenoms["uxprt"],
  },
  {
    counterpartyChainId: "osmo-test-4",
    sourceChannelId: "channel-7",
    destChannelId: "channel-351",
    coinMinimalDenom: "uosmo",
    ibcDenomHash: ibcDenoms["uosmo"],
  },
];
