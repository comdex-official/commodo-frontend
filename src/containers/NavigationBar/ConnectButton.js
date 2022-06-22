import * as PropTypes from "prop-types";
import { Button, message, Dropdown } from "antd";
import { SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import { decode } from "js-base64";
import {
  setAccountAddress,
  setAccountName,
  showAccountConnectModal,
} from "../../actions/account";
import DisConnectModal from "../DisConnectModal";
import React, { useEffect } from "react";
import variables from "../../utils/variables";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DOLLAR_DECIMALS,
} from "../../constants/common";
import {
  setAccountBalances,
  setPoolBalance,
  setcAssetBalance,
  setAssetBalance,
  setDebtBalance,
  setCollateralBalance,
} from "../../actions/account";
import { queryAllBalances } from "../../services/bank/query";
import Lodash from "lodash";
import { queryVaultList } from "../../services/vault/query";
import { setAccountVaults } from "../../actions/account";
import ConnectModal from "../Modal";
import { marketPrice } from "../../utils/number";
import { queryMarketList } from "../../services/oracle/query";
import { setMarkets } from "../../actions/oracle";
import { fetchKeplrAccountName } from "../../services/keplr";
import { comdex } from "../../config/network";
import { amountConversionWithComma, getDenomBalance } from "../../utils/coin";
import {queryAssets} from "../../services/asset/query";
import {setAssets} from "../../actions/asset";

const ConnectButton = ({
  setAccountAddress,
  address,
  setAccountBalances,
  lang,
  setAssetBalance,
  setcAssetBalance,
  setPoolBalance,
  markets,
  refreshBalance,
  setMarkets,
  setAccountName,
  balances,
                         setAssets,
}) => {
  useEffect(() => {
    const savedAddress = localStorage.getItem("ac");
    const userAddress = savedAddress ? decode(savedAddress) : address;

    fetchMarkets();

    if (userAddress) {
      setAccountAddress(userAddress);

      fetchKeplrAccountName().then((name) => {
        setAccountName(name);
      });

      fetchBalances(address);
    }
  }, [address, refreshBalance]);

  useEffect(() => {
    fetchBalances(
      address,
      (DEFAULT_PAGE_NUMBER - 1) * DEFAULT_PAGE_SIZE,
      DEFAULT_PAGE_SIZE,
      true,
      false
    );
  }, [markets]);
  ``;

  useEffect(()=>{
    queryAssets((DEFAULT_PAGE_NUMBER - 1) * DEFAULT_PAGE_SIZE,
        DEFAULT_PAGE_SIZE,
        true,
        false, (error, result)=>{
      if(error){
        message.error(error);
        return;
      }

      if(result?.assets?.length>0){
        setAssets(result?.assets)
      }
    })
  },[])

  const fetchBalances = (address) => {
    queryAllBalances(address, (error, result) => {
      if (error) {
        return;
      }

      setAccountBalances(result.balances, result.pagination);
      calculateAssetBalance(result.balances);
      calculatecAssetBalance(result.balances);
    });
  };

  const fetchMarkets = (offset, limit, isTotal, isReverse) => {
    queryMarketList(offset, limit, isTotal, isReverse, (error, result) => {
      if (error) {
        return;
      }

      setMarkets(result.markets, result.pagination);
    });
  };

  const calculatecAssetBalance = (balances) => {
    const cAssets = balances.filter(
      (item) =>
        item.denom.substr(0, 2) === "uc" && !(item.denom.substr(0, 3) === "ucm")
    );
    const value = cAssets.map((item) => {
      return marketPrice(markets, item.denom) * item.amount;
    });

    setcAssetBalance(Lodash.sum(value));
  };

  const getPrice = (denom) => {
    return marketPrice(markets, denom) || 0;
  };

  const calculateAssetBalance = (balances) => {
    const assetBalances = balances.filter(
      (item) =>
        item.denom.substr(0, 4) === "ibc/" ||
        item.denom === comdex.coinMinimalDenom
    );

    const value = assetBalances.map((item) => {
      return getPrice(item.denom) * item.amount;
    });

    setAssetBalance(Lodash.sum(value));
  };

  const WalletConnectedDropdown = <ConnectModal />;

  return (
    <>
      {address ? (
        <div className="connected_div">
          <div className="connected_left">
            <div className="testnet-top">
              <SvgIcon name="cmdx-icon" />{" "}
              {amountConversionWithComma(
                getDenomBalance(balances, comdex.coinMinimalDenom) || 0,
                DOLLAR_DECIMALS
              )}
            </div>
          </div>
          <DisConnectModal />
        </div>
      ) : (
        <div>
          <Dropdown
            overlay={WalletConnectedDropdown}
            placement="bottomRight"
            trigger={["click"]}
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
  setAccountAddress: PropTypes.func.isRequired,
  showAccountConnectModal: PropTypes.func.isRequired,
  setAccountBalances: PropTypes.func.isRequired,
  setAccountName: PropTypes.func.isRequired,
  setAssetBalance: PropTypes.func.isRequired,
  setAccountVaults: PropTypes.func.isRequired,
  setcAssetBalance: PropTypes.func.isRequired,
  setCollateralBalance: PropTypes.func.isRequired,
  setDebtBalance: PropTypes.func.isRequired,
  setMarkets: PropTypes.func.isRequired,
  setPoolBalance: PropTypes.func.isRequired,
  address: PropTypes.string,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.string,
    })
  ),
  show: PropTypes.bool,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    show: state.account.showModal,
    markets: state.oracle.market.list,
    refreshBalance: state.account.refreshBalance,
    balances: state.account.balances.list,
  };
};

const actionsToProps = {
  showAccountConnectModal,
  setAccountAddress,
  setAccountBalances,
  setPoolBalance,
  setcAssetBalance,
  setAssetBalance,
  setAccountVaults,
  setDebtBalance,
  setCollateralBalance,
  setMarkets,
  setAccountName,
  setAssets,
};

export default connect(stateToProps, actionsToProps)(ConnectButton);
