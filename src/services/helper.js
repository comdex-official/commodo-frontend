import { SigningStargateClient } from "@cosmjs/stargate";
import { comdex } from "../config/network";
import { myRegistry } from "./registry";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClient, createProtobufRpcClient } from "@cosmjs/stargate";

export const createQueryClient = (callback) => {
  return newQueryClientRPC(comdex.rpc, callback);
};

export const newQueryClientRPC = (rpc, callback) => {
  Tendermint34Client.connect(rpc)
    .then((tendermintClient) => {
      const queryClient = new QueryClient(tendermintClient);
      const rpcClient = createProtobufRpcClient(queryClient);
      callback(null, rpcClient);
    })
    .catch((error) => {
      callback(error?.message);
    });
};

export const KeplrWallet = async (chainID = comdex.chainId) => {
  await window.keplr.enable(chainID);
  const offlineSigner = window.getOfflineSigner(chainID);
  const accounts = await offlineSigner.getAccounts();
  return [offlineSigner, accounts];
};

export const signAndBroadcastTransaction = async (
  transaction,
  address,
  callback
) => {
  const [offlineSigner, accounts] = await KeplrWallet(comdex.chainId);
  if (address !== accounts[0].address) {
    const error = "Connected account is not active in Keplr";
    callback(error);
    return;
  }

  SigningStargateClient.connectWithSigner(comdex.rpc, offlineSigner, {
    registry: myRegistry,
  })
    .then((client) => {
      client
        .signAndBroadcast(
          address,
          [transaction.message],
          transaction.fee,
          transaction.memo
        )
        .then((result) => {
          callback(null, result);
        })
        .catch((error) => {
          callback(error?.message);
        });
    })
    .catch((error) => {
      callback(error?.message);
    });
};

export const aminoSignIBCTx = (config, transaction, callback) => {
  (async () => {
    (await window.keplr) && window.keplr.enable(config.chainId);
    const offlineSigner =
      window.getOfflineSignerOnlyAmino &&
      window.getOfflineSignerOnlyAmino(config.chainId);
    const client = await SigningStargateClient.connectWithSigner(
      config.rpc,
      offlineSigner
    );

    client
      .sendIbcTokens(
        transaction.msg?.value?.sender,
        transaction.msg?.value?.receiver,
        transaction.msg?.value?.token,
        transaction.msg?.value?.source_port,
        transaction.msg?.value?.source_channel,
        transaction.msg?.value?.timeout_height,
        transaction.msg?.value?.timeout_timestamp,
        transaction.fee,
        transaction.memo
      )
      .then((result) => {
        if (result?.code !== undefined && result.code !== 0) {
          callback(result.log || result.rawLog);
        } else {
          callback(null, result);
        }
      })
      .catch((error) => {
        callback(error?.message);
      });
  })();
};
