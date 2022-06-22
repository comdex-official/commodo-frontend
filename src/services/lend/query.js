import { QueryClientImpl } from "comdex-codec/build/comdex/lend/v1beta1/query";
import Long from "long";
import { createQueryClient } from "../helper";

export const queryLendPools = (
    offset,
    limit,
    countTotal,
    reverse,
    callback
) => {
    createQueryClient((error, rpcClient) => {
        if (error) {
            callback(error);
            return;
        }

        new QueryClientImpl(rpcClient)
            .QueryPools({
                pagination: {
                    key: "",
                    offset: Long.fromNumber(offset),
                    limit: Long.fromNumber(limit),
                    countTotal: countTotal,
                    reverse: reverse,
                },
            })
            .then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};