import {
  MsgCloseRequest,
  MsgCreateRequest,
  MsgDepositRequest,
  MsgDrawRequest,
  MsgRepayRequest,
  MsgWithdrawRequest,
} from "comdex-codec/build/comdex/vault/v1beta1/msg";
import {
  MsgCreatePool,
  MsgDepositWithinBatch,
  MsgSwapWithinBatch,
  MsgWithdrawWithinBatch,
  MsgBondPoolTokens,
  MsgUnbondPoolTokens,
} from "comdex-codec/build/comdex/liquidity/v1beta1/tx";
import {MsgPlaceBidRequest} from "comdex-codec/build/comdex/auction/v1beta1/msg";

import { Registry } from "@cosmjs/proto-signing";
import { defaultRegistryTypes } from "@cosmjs/stargate";

export const myRegistry = new Registry([
  ...defaultRegistryTypes,
  ["/comdex.vault.v1beta1.MsgCreateRequest", MsgCreateRequest],
  ["/comdex.vault.v1beta1.MsgDepositRequest", MsgDepositRequest],
  ["/comdex.vault.v1beta1.MsgWithdrawRequest", MsgWithdrawRequest],
  ["/comdex.vault.v1beta1.MsgDrawRequest", MsgDrawRequest],
  ["/comdex.vault.v1beta1.MsgRepayRequest", MsgRepayRequest],
  ["/comdex.vault.v1beta1.MsgCloseRequest", MsgCloseRequest],
  ["/comdex.liquidity.v1beta1.MsgSwapWithinBatch", MsgSwapWithinBatch],
  ["/comdex.liquidity.v1beta1.MsgCreatePool", MsgCreatePool],
  [
    "/comdex.liquidity.v1beta1.MsgDepositWithinBatch",
    MsgDepositWithinBatch,
  ],
  [
    "/comdex.liquidity.v1beta1.MsgWithdrawWithinBatch",
    MsgWithdrawWithinBatch,
  ],
  ["/comdex.liquidity.v1beta1.MsgBondPoolTokens", MsgBondPoolTokens],
  ["/comdex.liquidity.v1beta1.MsgUnbondPoolTokens", MsgUnbondPoolTokens],
  ["/comdex.auction.v1beta1.MsgPlaceBidRequest", MsgPlaceBidRequest]
]);
