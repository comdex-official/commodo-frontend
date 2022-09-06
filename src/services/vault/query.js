import { QueryClientImpl } from "comdex-codec/build/comdex/vault/v1beta1/query";
import { createQueryClient } from "../helper";

let myClient = null;

const getQueryService = (callback) => {
  if (myClient) {
    const queryService = new QueryClientImpl(myClient);

    return callback(null, queryService);
  } else {
    createQueryClient((error, client) => {
      if (error) {
        return callback(error);
      }

      myClient = client;
      const queryService = new QueryClientImpl(client);

      return callback(null, queryService);
    });
  }
};

export const queryVault = (id, callback) => {
  getQueryService((error, queryService) => {
    if (error) {
      callback(error);
      return;
    }

    queryService
      .QueryVault({
        id,
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};
