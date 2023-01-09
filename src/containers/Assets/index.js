import { Button, Table } from "antd";
import Lodash from "lodash";
import * as PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import {
  Col,
  NoDataIcon,
  Row,
  SvgIcon,
  TooltipIcon
} from "../../components/common";
import AssetList from "../../config/ibc_assets.json";
import { cmst, comdex, harbor } from "../../config/network";
import { DOLLAR_DECIMALS } from "../../constants/common";
import { getChainConfig } from "../../services/keplr";
import { amountConversion, denomConversion } from "../../utils/coin";
import { commaSeparator, marketPrice } from "../../utils/number";
import { iconNameFromDenom } from "../../utils/string";
import Deposit from "./DepositModal";
import "./index.less";
import Withdraw from "./WithdrawModal";

const Assets = ({
  assetBalance,
  balances,
  markets,
  assetDenomMap,
  refreshBalance,
}) => {
  const dispatch = useDispatch();

  const handleBalanceRefresh = () => {
    dispatch({
      type: "BALANCE_REFRESH_SET",
      value: refreshBalance + 1,
    });

    updatePrices();
  };

  const data = [
    {
      title: (
        <>
          Total Asset Balance <TooltipIcon text="Value of total Asset" />
        </>
      ),
      counts: `$${commaSeparator(
        Number(assetBalance || 0).toFixed(DOLLAR_DECIMALS)
      )}`,
    },
  ];

  const columns = [
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: 180,
    },
    {
      title: "No. of Tokens",
      dataIndex: "noOfTokens",
      key: "noOfTokens",
      width: 150,
      render: (tokens) => (
        <>
          {commaSeparator(Number(tokens || 0))}
        </>
      ),
    },
    {
      title: "Oracle Price",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price) => (
        <>
          <p>${commaSeparator(Number(price || 0).toFixed(DOLLAR_DECIMALS))}</p>
        </>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (balance) => (
        <>
          <p>
            $
            {commaSeparator(
              Number(balance?.value || 0).toFixed(DOLLAR_DECIMALS)
            )}
          </p>
        </>
      ),
    },
    {
      title: "IBC Deposit",
      dataIndex: "ibcdeposit",
      key: "ibcdeposit",
      width: 150,
      align: "center",
      render: (value) => {
        if (value) {
          return value?.depositUrlOverride ? (
            <Button type="primary" size="small" className="external-btn">
              <a
                href={value?.depositUrlOverride}
                target="_blank"
                rel="noreferrer"
              >
                Deposit{" "}
                <span className="hyperlink-icon">
                  {" "}
                  <SvgIcon name="hyperlink" />
                </span>
              </a>
            </Button>
          ) : (
            <Deposit
              chain={value}
              balances={balances}
              handleRefresh={handleBalanceRefresh}
            />
          );
        }
      },
    },
    {
      title: "IBC Withdraw",
      dataIndex: "ibcwithdraw",
      key: "ibcwithdraw",
      width: 150,
      align: "center",
      render: (value) => {
        if (value) {
          return value?.withdrawUrlOverride ? (
            <Button type="primary" size="small" className="external-btn">
              <a
                href={value?.withdrawUrlOverride}
                target="_blank"
                rel="noreferrer"
              >
                Withdraw{" "}
                <span className="hyperlink-icon">
                  {" "}
                  <SvgIcon name="hyperlink" />
                </span>
              </a>
            </Button>
          ) : (
            <Withdraw
              chain={value}
              balances={balances}
              handleRefresh={handleBalanceRefresh}
            />
          );
        }
      },
    },
  ];

  const getPrice = (denom) => {
    return marketPrice(markets, denom, assetDenomMap[denom]?.id) || 0;
  };

  let ibcBalances = AssetList?.tokens?.map((token) => {
    const ibcBalance = balances.find(
      (item) => item.denom === token?.ibcDenomHash
    );

    const value =
      getPrice(ibcBalance?.denom) *
      amountConversion(
        ibcBalance?.amount,
        assetDenomMap[ibcBalance?.denom]?.decimals
      );

    return {
      chainInfo: getChainConfig(token),
      coinMinimalDenom: token?.coinMinimalDenom,
      balance: {
        amount: ibcBalance?.amount
          ? amountConversion(
              ibcBalance.amount,
              assetDenomMap[ibcBalance?.denom]?.decimals
            )
          : 0,
        value: value || 0,
        denom: ibcBalance?.denom,
      },
      sourceChannelId: token.comdexChannel,
      destChannelId: token.channel,
      ibcDenomHash: token?.ibcDenomHash,
      explorerUrlToTx: token?.explorerUrlToTx,
      depositUrlOverride: token?.depositUrlOverride,
      withdrawUrlOverride: token?.withdrawUrlOverride,
    };
  });

  const nativeCoin = balances.filter(
    (item) => item.denom === comdex?.coinMinimalDenom
  )[0];
  const nativeCoinValue = getPrice(nativeCoin?.denom) * nativeCoin?.amount;

  const cmstCoin = balances.filter(
    (item) => item.denom === cmst?.coinMinimalDenom
  )[0];
  const cmstCoinValue = getPrice(cmstCoin?.denom) * cmstCoin?.amount;

  const harborCoin = balances.filter(
    (item) => item.denom === harbor?.coinMinimalDenom
  )[0];
  const harborCoinValue = getPrice(harborCoin?.denom) * harborCoin?.amount;

  const currentChainData = [
    {
      key: comdex.chainId,
      asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name={iconNameFromDenom(comdex?.coinMinimalDenom)} />
            </div>{" "}
            {denomConversion(comdex?.coinMinimalDenom)}{" "}
          </div>
        </>
      ),
      noOfTokens: nativeCoin?.amount ? amountConversion(nativeCoin.amount) : 0,
      price: getPrice(comdex?.coinMinimalDenom),
      amount: {
        value: amountConversion(nativeCoinValue || 0),
      },
    },
    {
      key: cmst.coinMinimalDenom,
      asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name={iconNameFromDenom(cmst?.coinMinimalDenom)} />
            </div>{" "}
            {denomConversion(cmst?.coinMinimalDenom)}{" "}
          </div>
        </>
      ),
      noOfTokens: cmstCoin?.amount ? amountConversion(cmstCoin.amount) : 0,
      price: getPrice(cmst?.coinMinimalDenom),
      amount: {
        value: amountConversion(cmstCoinValue || 0),
      },
    },
    {
      key: harbor.coinMinimalDenom,
      asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name={iconNameFromDenom(harbor?.coinMinimalDenom)} />
            </div>{" "}
            {denomConversion(harbor?.coinMinimalDenom)}{" "}
          </div>
        </>
      ),
      noOfTokens: harborCoin?.amount ? amountConversion(harborCoin.amount) : 0,
      price: getPrice(harbor?.coinMinimalDenom),
      amount: {
        value: amountConversion(harborCoinValue || 0),
      },
    },
  ];

  const tableIBCData =
    ibcBalances &&
    ibcBalances.map((item) => {
      return {
        key: item?.coinMinimalDenom,
        asset: (
          <>
            <div className="assets-with-icon">
              <div className="assets-icon">
                <SvgIcon name={iconNameFromDenom(item?.ibcDenomHash)} />
              </div>{" "}
              {denomConversion(item?.ibcDenomHash)}{" "}
            </div>
          </>
        ),
        noOfTokens: Number(item?.balance?.amount || 0)?.toFixed(
          comdex?.coinDecimals
        ),
        price: getPrice(item?.ibcDenomHash),
        amount: item.balance,
        ibcdeposit: item,
        ibcwithdraw: item,
      };
    });

  const tableData = Lodash.concat(currentChainData, tableIBCData);

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="asset-wrapper">
            <div className="commodo-card assets-upper">
              <div className="assets-upper-left">Asset</div>
              <div className="assets-upper-right">
                <div className="mr-2">
                  Total Asset Balance
                  {/* <TooltipIcon text="Value of total Asset" /> */}
                </div>
                {commaSeparator(
                  Number(assetBalance || 0).toFixed(DOLLAR_DECIMALS)
                )}{" "}
                USD
              </div>
            </div>
            <div className="commodo-card py-3 bg-none">
              <div className="card-content">
                <Table
                  className="custom-table auction-table"
                  dataSource={tableData}
                  columns={columns}
                  pagination={false}
                  scroll={{ x: "100%", y: "calc(100vh - 280px)" }}
                  locale={{ emptyText: <NoDataIcon /> }}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Assets.propTypes = {
  lang: PropTypes.string.isRequired,
  refreshBalance: PropTypes.number.isRequired,
  assetBalance: PropTypes.number,
  assetDenomMap: PropTypes.object,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  markets: PropTypes.object,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    assetBalance: state.account.balances.asset,
    balances: state.account.balances.list,
    markets: state.oracle.market,
    refreshBalance: state.account.refreshBalance,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

export default connect(stateToProps)(Assets);
