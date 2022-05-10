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
    counterpartyChainId: "bombay-12",
    sourceChannelId: "channel-6",
    destChannelId: "channel-134",
    coinMinimalDenom: "uusd",
    ibcDenomHash:ibcDenoms["uusd"],
  },
  {
    counterpartyChainId: "test-core-1",
    sourceChannelId: "channel-2",
    destChannelId: "channel-72",
    coinMinimalDenom: "uxprt",
    ibcDenomHash:ibcDenoms["uxprt"],
  },
  {
    counterpartyChainId: "osmo-test-4",
    sourceChannelId: "channel-4",
    destChannelId: "channel-241",
    coinMinimalDenom: "uosmo",
    ibcDenomHash: ibcDenoms["uosmo"]
  },
  {
    counterpartyChainId: "bombay-12",
    sourceChannelId: "channel-6",
    destChannelId: "channel-134",
    coinMinimalDenom: "uluna",
    ibcDenomHash:ibcDenoms["uluna"]
  },
];