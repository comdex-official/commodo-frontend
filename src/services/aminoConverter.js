export const customAminoTypes = {
  "/comdex.lend.v1beta1.MsgLend": {
    aminoType: "comdex/lend/MsgLend",
    toAmino: ({ lender, assetId, poolId, appId, amount }) => {
      return {
        lender: lender,
        pool_id: String(poolId),
        asset_id: String(assetId),
        app_id: String(appId),
        amount: amount,
      };
    },
    fromAmino: ({ lender, pool_id, asset_id, app_id, amount }) => {
      return {
        lender: lender,
        assetId: Number(asset_id),
        poolId: Number(pool_id),
        appId: Number(app_id),
        amount: amount,
      };
    },
  },
  "/comdex.lend.v1beta1.MsgDeposit": {
    aminoType: "comdex/lend/MsgDeposit",
    toAmino: ({ lender, lendId, amount }) => {
      return {
        lender: lender,
        lend_id: String(lendId),
        amount: amount,
      };
    },
    fromAmino: ({ lender, lend_id, amount }) => {
      return {
        lender: lender,
        lendId: Number(lend_id),
        amount: amount,
      };
    },
  },
  "/comdex.lend.v1beta1.MsgWithdraw": {
    aminoType: "comdex/lend/MsgWithdraw",
    toAmino: ({ lender, lendId, amount }) => {
      return {
        lender: lender,
        lend_id: String(lendId),
        amount: amount,
      };
    },
    fromAmino: ({ lender, lend_id, amount }) => {
      return {
        lender: lender,
        lendId: Number(lend_id),
        amount: amount,
      };
    },
  },
  "/comdex.lend.v1beta1.MsgCloseLend": {
    aminoType: "comdex/lend/MsgCloseLend",
    toAmino: ({ lender, lendId }) => {
      return {
        lender: lender,
        lend_id: String(lendId),
      };
    },
    fromAmino: ({ lender, lend_id }) => {
      return {
        lender: lender,
        lendId: Number(lend_id),
      };
    },
  },
  "/comdex.lend.v1beta1.MsgBorrow": {
    aminoType: "comdex/lend/MsgBorrow",
    toAmino: ({
      borrower,
      lendId,
      pairId,
      isStableBorrow,
      amountIn,
      amountOut,
    }) => {
      return {
        borrower: borrower,
        lend_id: String(lendId),
        pair_id: String(pairId),
        is_stable_borrow: isStableBorrow,
        amount_in: amountIn,
        amount_out: amountOut,
      };
    },
    fromAmino: ({
      borrower,
      lend_id,
      pair_id,
      is_stable_borrow,
      amount_in,
      amount_out,
    }) => {
      return {
        borrower: borrower,
        lendId: Number(lend_id),
        pairId: Number(pair_id),
        isStableBorrow: is_stable_borrow,
        amountIn: amount_in,
        amountOut: amount_out,
      };
    },
  },
};
