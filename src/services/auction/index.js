import { QueryClientImpl } from "comdex-codec/build/comdex/auction/v1beta1/query";
import Long from "long";
import { APP_ID } from "../../constants/common";
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

export const queryDutchAuctionList = (
  offset,
  limit,
  countTotal,
  reverse,
  callback
) => {
  getQueryService((error, queryService) => {
    if (error) {
      callback(error);
      return;
    }

    queryService
      .QueryDutchLendAuctions({
        appId: Long.fromNumber(APP_ID),
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

export const queryDutchBiddingList = (
  bidder,
  offset,
  limit,
  countTotal,
  reverse,
  history,
  callback) => {
  getQueryService((error, queryService) => {
    if (error) {
      callback(error);
      return;
    }

    queryService
      .QueryDutchLendBiddings({
        bidder,
        appId: Long.fromNumber(APP_ID),
        pagination: {
          key: "",
          offset: Long.fromNumber(offset),
          limit: Long.fromNumber(limit),
          countTotal: countTotal,
          reverse: reverse,
        },
        history: history,
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};

export const querySingleDutchLendAuction = (
  auctionId,
  auctionMappingId,
  callback) => {
  getQueryService((error, queryService) => {
    if (error) {
      callback(error);
      return;
    }

    queryService
      .QueryDutchLendAuction({
        appId: Long.fromNumber(APP_ID),
        auctionId: Long.fromNumber(auctionId),
        auctionMappingId: Long.fromNumber(auctionMappingId),
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error?.message);
      });
  });
};
