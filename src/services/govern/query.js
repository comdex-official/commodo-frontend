import { QueryClientImpl } from "cosmjs-types/cosmos/gov/v1beta1/query";
import { createQueryClient } from "../helper";
import Long from 'long';

export const queryAllProposals = (
    callback
) => {
    createQueryClient((error, client) => {
        if (error) {
            callback(error);
            return;
        }

        const queryService = new QueryClientImpl(client);

        queryService
            .Proposals({ proposalStatus: 0, voter: "", depositor: "" })
            .then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};

export const queryProposal = (
    id,
    callback
) => {
    createQueryClient((error, client) => {
        if (error) {
            callback(error);
            return;
        }

        const queryService = new QueryClientImpl(client);

        queryService
            .Proposal({ proposalId: Long.fromNumber(id) })
            .then((result) => {
                callback(null, result);
            })
            .catch((error) => {
                callback(error?.message);
            });
    });
};
