import { Button, Dropdown, message } from "antd";
import { decode, encode } from "js-base64";
import Lodash from "lodash";
import * as PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  setAccountAddress,
  setAccountBalances,
  setAccountName,
  setAccountVaults,
  setAssetBalance,
  setPoolBalance,
  showAccountConnectModal,
} from "../../actions/account";
import { setAssets } from "../../actions/asset";
import { setAssetRatesStats, setUserLends } from "../../actions/lend";
import { setCoingekoPrice, setMarkets } from "../../actions/oracle";
import { cmst, comdex, harbor } from "../../config/network";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../../constants/common";
import { queryAssets } from "../../services/asset/query";
import { queryAllBalances } from "../../services/bank/query";
import { fetchKeplrAccountName, initializeChain } from "../../services/keplr";
import {
  QueryAssetRatesParams,
  queryUserLends,
} from "../../services/lend/query";
import {
  fetchCoingeckoPrices,
  queryMarketList,
} from "../../services/oracle/query";
import { amountConversion } from "../../utils/coin";
import { marketPrice } from "../../utils/number";
import variables from "../../utils/variables";
import DisConnectModal from "../DisConnectModal";
import ConnectModal from "../Modal";

const ConnectButton = ({
  setAccountAddress,
  address,
  setAccountBalances,
  lang,
  setAssetBalance,
  markets,
  refreshBalance,
  setMarkets,
  setAccountName,
  setAssets,
  setAssetRatesStats,
  balances,
  assetDenomMap,
  setCoingekoPrice,
  setUserLends,
}) => {
  const [addressFromLocal, setAddressFromLocal] = useState();

  useEffect(() => {
    let addressAlreadyExist = localStorage.getItem("ac");
    addressAlreadyExist = addressAlreadyExist
      ? decode(addressAlreadyExist)
      : "";
    setAddressFromLocal(addressAlreadyExist);
  }, []);

  useEffect(() => {
    if (addressFromLocal) {
      initializeChain((error, account) => {
        if (error) {
          message.error(error);
          return;
        }
        setAccountAddress(account.address);
        fetchKeplrAccountName().then((name) => {
          setAccountName(name);
        });
        localStorage.setItem("ac", encode(account.address));
        localStorage.setItem("loginType", "keplr");
      });
    }
  }, [addressFromLocal]);

  useEffect(() => {
    const savedAddress = localStorage.getItem("ac");
    const userAddress = savedAddress ? decode(savedAddress) : address;

    if (userAddress) {
      setAccountAddress(userAddress);

      fetchKeplrAccountName().then((name) => {
        setAccountName(name);
      });
    }
  }, [address, refreshBalance]);

  useEffect(() => {
    fetchMarkets();
    fetchCoingeckoPrice();
  }, []);

  const fetchBalances = useCallback(
    (address) => {
      queryAllBalances(address, (error, result) => {
        if (error) {
          return;
        }
        setAccountBalances(result.balances, result.pagination);
      });
    },
    [setAccountBalances]
  );

  useEffect(() => {
    if (address) {
      fetchBalances(address);
    }
  }, [address, refreshBalance, markets, fetchBalances]);

  useEffect(() => {
    queryAssets(
      (DEFAULT_PAGE_NUMBER - 1) * DEFAULT_PAGE_SIZE,
      DEFAULT_PAGE_SIZE * 2,
      true,
      false,
      (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        if (result?.assets?.length > 0) {
          setAssets(result?.assets);
        }
      }
    );

    QueryAssetRatesParams((error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      if (result?.AssetRatesParams?.length > 0) {
        setAssetRatesStats(result?.AssetRatesParams);
      }
    });
  }, []);

  useEffect(() => {
    if (balances?.length > 0) {
      calculateAssetBalance(balances);
    }
  }, [balances]);

  const fetchMarkets = (offset, limit, isTotal, isReverse) => {
    queryMarketList(offset, limit, isTotal, isReverse, (error, result) => {
      if (error) {
        return;
      }

      setMarkets(result.timeWeightedAverage, result.pagination);
    });
  };

  useEffect(() => {
    if (address) {
      fetchUserLends();
    }
  }, [address]);

  const fetchUserLends = () => {
    queryUserLends(address, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setUserLends(result?.lends || []);
    });
  };

  const fetchCoingeckoPrice = () => {
    fetchCoingeckoPrices((error, result) => {
      if (error) {
        return;
      }
      if (result) {
        setCoingekoPrice(result);
      }
    });
  };

  const getPrice = (denom) => {
    return marketPrice(markets, denom, assetDenomMap[denom]?.id) || 0;
  };

  const calculateAssetBalance = (balances) => {
    const assetBalances = balances.filter(
      (item) =>
        item.denom.substr(0, 4) === "ibc/" ||
        item.denom === comdex.coinMinimalDenom ||
        item.denom === cmst.coinMinimalDenom ||
        item.denom === harbor.coinMinimalDenom
    );

    const value = assetBalances.map((item) => {
      return (
        getPrice(item.denom) *
        amountConversion(item.amount, assetDenomMap[item?.denom]?.decimals)
      );
    });

    setAssetBalance(Lodash.sum(value));
  };

  const items = [{ label: <ConnectModal />, key: "item-1" }];

  return (
    <>
      {address ? (
        <div className="connected_div">
          <DisConnectModal />
        </div>
      ) : (
        <div>
          <Dropdown
            menu={{ items }}
            placement="bottomRight"
            trigger={["click"]}
            overlayClassName="dropconnect-overlay"
          >
            <Button shape="round" type="primary" className="btn-filled">
              {variables[lang].connect_wallet}
            </Button>
          </Dropdown>
        </div>
      )}
    </>
  );
};

ConnectButton.propTypes = {
  lang: PropTypes.string.isRequired,
  refreshBalance: PropTypes.number.isRequired,
  setAssetRatesStats: PropTypes.func.isRequired,
  setAccountAddress: PropTypes.func.isRequired,
  showAccountConnectModal: PropTypes.func.isRequired,
  setAccountBalances: PropTypes.func.isRequired,
  setAccountName: PropTypes.func.isRequired,
  setAssetBalance: PropTypes.func.isRequired,
  setAccountVaults: PropTypes.func.isRequired,
  setMarkets: PropTypes.func.isRequired,
  setPoolBalance: PropTypes.func.isRequired,
  setUserLends: PropTypes.func.isRequired,
  address: PropTypes.string,
  assetDenomMap: PropTypes.object,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  markets: PropTypes.object,
  show: PropTypes.bool,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    balances: state.account.balances.list,
    show: state.account.showModal,
    markets: state.oracle.market,
    refreshBalance: state.account.refreshBalance,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

const actionsToProps = {
  showAccountConnectModal,
  setAccountAddress,
  setAccountBalances,
  setPoolBalance,
  setAssetBalance,
  setAccountVaults,
  setMarkets,
  setAccountName,
  setAssets,
  setAssetRatesStats,
  setCoingekoPrice,
  setUserLends,
};

export default connect(stateToProps, actionsToProps)(ConnectButton);
