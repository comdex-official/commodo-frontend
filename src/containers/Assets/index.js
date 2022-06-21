import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { connect } from "react-redux";
import {List, message, Table} from "antd";
import Deposit from "./DepositModal";
import Withdraw from "./WithdrawModal";
import {ibcAssetsInfo} from "../../config/ibc";
import {commaSeparator, marketPrice} from "../../utils/number";
import {embedChainInfo} from "../../config/chain";
import {amountConversion, amountConversionWithComma, denomConversion} from "../../utils/coin";
import {cmst, comdex, harbor} from "../../config/network";
import {iconNameFromDenom} from "../../utils/string";
import Lodash from "lodash";
import {DOLLAR_DECIMALS} from "../../constants/common";
import "./index.less";

const Assets = ({ assetBalance, balances, markets }) => {
  const data = [
    {
      title: <>Total Asset Balance <TooltipIcon text="Value of total Asset" /></>,
      counts: `$${amountConversionWithComma(assetBalance, DOLLAR_DECIMALS)}`
    }
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
      dataIndex: "no_of_tokens",
      key: "no_of_tokens",
      width: 150,
      render: (tokens) => (
          <>
            <p>{commaSeparator(Number(tokens || 0))}</p>
          </>
      ),
    },
    {
      title: "Oracle Price",
      dataIndex: "oracle_price",
      key: "oracle_price",
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
                  amountConversion(balance?.value || 0, DOLLAR_DECIMALS)
              )}
            </p>
          </>
      ),
    },
    {
      title: "IBC Deposit",
      dataIndex: "ibc_deposit",
      key: "ibc_deposit",
      width: 150,
      align: "center",
      render: (value) => {
        if (value) {
          return <Deposit chain={value} />;
        }
      },
    },
    {
      title: "IBC Withdraw",
      dataIndex: "ibc_withdraw",
      key: "ibc_withdraw",
      width: 150,
      align: "center",
      render: (value) => {
        if (value) {
          return <Withdraw chain={value} />;
        }
      },
    }
  ];

  const getPrice = (denom) => {
    return marketPrice(markets, denom) || 0;
  };

  let ibcBalances = ibcAssetsInfo.map((channelInfo) => {
    const chainInfo = embedChainInfo.filter(
        (item) => item.chainId === channelInfo.counterpartyChainId
    )[0];

    const originCurrency =
        chainInfo &&
        chainInfo.currencies.find(
            (cur) => cur.coinMinimalDenom === channelInfo.coinMinimalDenom
        );

    if (!originCurrency) {
      message.info(
          `Unknown currency ${channelInfo.coinMinimalDenom} for ${channelInfo.counterpartyChainId}`
      );
    }

    const ibcBalance = balances.find(
        (item) => item.denom === channelInfo?.ibcDenomHash
    );
    const value = getPrice(ibcBalance?.denom) * ibcBalance?.amount;

    return {
      chainInfo: chainInfo,
      denom: originCurrency?.coinMinimalDenom,
      balance: {
        amount: ibcBalance?.amount ? amountConversion(ibcBalance.amount) : 0,
        value: value || 0,
      },
      ibc: ibcBalance,
      sourceChannelId: channelInfo.sourceChannelId,
      destChannelId: channelInfo.destChannelId,
      isUnstable: channelInfo.isUnstable,
      currency: originCurrency,
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
            <div className="assets-withicon">
              <div className="assets-icon">
                <SvgIcon name={iconNameFromDenom(comdex?.coinMinimalDenom)} />
              </div>{" "}
              {denomConversion(comdex?.coinMinimalDenom)}{" "}
            </div>
          </>
      ),
      no_of_tokens: nativeCoin?.amount ? amountConversion(nativeCoin.amount) : 0,
      oracle_price: getPrice(comdex?.coinMinimalDenom),
      amount: {
        value: nativeCoinValue || 0,
      },
    },
    {
      key: cmst.coinMinimalDenom,
      asset: (
          <>
            <div className="assets-withicon">
              <div className="assets-icon">
                <SvgIcon name={iconNameFromDenom(cmst?.coinMinimalDenom)} />
              </div>{" "}
              {denomConversion(cmst?.coinMinimalDenom)}{" "}
            </div>
          </>
      ),
      no_of_tokens: cmstCoin?.amount ? amountConversion(cmstCoin.amount) : 0,
      oracle_price: getPrice(cmst?.coinMinimalDenom),
      amount: {
        value: cmstCoinValue || 0,
      },
    },
    {
      key: harbor.coinMinimalDenom,
      asset: (
          <>
            <div className="assets-withicon">
              <div className="assets-icon">
                <SvgIcon name={iconNameFromDenom(harbor?.coinMinimalDenom)} />
              </div>{" "}
              {denomConversion(harbor?.coinMinimalDenom)}{" "}
            </div>
          </>
      ),
      no_of_tokens: harborCoin?.amount ? amountConversion(harborCoin.amount) : 0,
      oracle_price: getPrice(harbor?.coinMinimalDenom),
      amount: {
        value: harborCoinValue || 0,
      },
    },
  ];

  const tableIBCData =
      ibcBalances &&
      ibcBalances.map((item) => {
        return {
          key: item.denom,
          asset: (
              <>
                <div className="assets-withicon">
                  <div className="assets-icon">
                    <SvgIcon
                        name={iconNameFromDenom(item.currency?.coinMinimalDenom)}
                    />
                  </div>{" "}
                  {item.currency?.coinDenom}{" "}
                </div>
              </>
          ),
          no_of_tokens: item?.balance?.amount,
          oracle_price: getPrice(item.currency?.coinMinimalDenom),
          amount: item.balance,
          ibc_deposit: item,
          ibc_withdraw: item,
        };
      });

  const tableData = Lodash.concat(currentChainData, tableIBCData);

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="asset-wrapper">
            <div className="commodo-card myhome-upper d-block">
              <div className="myhome-upper-left w-100">
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 1,
                    lg: 1,
                    xl: 1,
                    xxl: 1,
                  }}
                  dataSource={data}
                  renderItem={item => (
                    <List.Item>
                      <div>
                        <p>{item.title}</p>
                        <h3>{item.counts}</h3>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
            <div className="commodo-card py-3 bg-none">
              <div className="card-content">
                <Table
                  className="custom-table liquidation-table"
                  dataSource={tableData}
                  columns={columns}
                  pagination={false}
                  scroll={{ x: "100%", y: "calc(100vh - 280px)" }}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Assets.propTypes = {lang: PropTypes.string.isRequired,
  assetBalance: PropTypes.number,
  balances: PropTypes.arrayOf(
      PropTypes.shape({
        denom: PropTypes.string.isRequired,
        amount: PropTypes.string,
      })
  ),
  markets: PropTypes.arrayOf(
      PropTypes.shape({
        rates: PropTypes.string,
        symbol: PropTypes.string,
        script_id: PropTypes.string,
      })
  ),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    assetBalance: state.account.balances.asset,
    balances: state.account.balances.list,
    markets: state.oracle.market.list,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Assets);
