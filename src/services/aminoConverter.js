export const customAminoTypes = {
  "/comdex.lend.v1beta1.MsgLend": {
    aminoType: "comdex/lend/MsgLend",
    toAmino: ({ lender, assetId, poolId, amount }) => {
      return {
        lender: lender,
        pool_id: String(poolId),
        asset_id: String(assetId),
        amount: amount,
      };
    },
    fromAmino: ({ lender, pool_id, asset_id, amount }) => {
      return {
        lender: lender,
        assetId: Number(asset_id),
        poolId: Number(pool_id),
        amount: amount,
      };
    },
  },
};
