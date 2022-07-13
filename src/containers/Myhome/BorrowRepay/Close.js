import * as PropTypes from "prop-types";
import { Col, Row } from "../../../components/common";
import { connect } from "react-redux";
import { Progress } from "antd";
import "./index.less";
import { setBalanceRefresh } from "../../../actions/account";
import { useState } from "react";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
} from "../../../utils/coin";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { commaSeparator, marketPrice } from "../../../utils/number";
import ActionButton from "./ActionButton";

const CloseTab = ({
  lang,
  dataInProgress,
  borrowPosition,
  pool,
  assetMap,
  balances,
  address,
  refreshBalance,
  setBalanceRefresh,
  markets,
  pair,
}) => {
  const [amount, setAmount] = useState();
  const selectedAssetId = pair?.assetOut?.toNumber();


  const handleRefresh = () => {
    setBalanceRefresh(refreshBalance + 1);
    setAmount();
  };

  return (
    <div className="details-wrapper">
      <div className="details-left commodo-card">
        <Row>
          <Col sm="12" className="mt-2 mx-auto card-bottom-details">
            <Row>
              <Col>
                <label>Amount to be closed</label>
                <p className="remaining-infotext mt-1">
                  You don’t have enough funds to repay the full amount
                </p>
              </Col>
              <Col className="text-right">
                <div>
                  {amountConversionWithComma(borrowPosition?.amountOut?.amount)}{" "}
                  {denomConversion(borrowPosition?.amountOut?.denom)}
                </div>
                <small className="font-weight-light">
                  $
                  {commaSeparator(
                    Number(
                      amountConversion(borrowPosition?.amountOut?.amount) *
                        marketPrice(
                          markets,
                          assetMap[selectedAssetId]?.denom
                        ) || 0
                    ),
                    DOLLAR_DECIMALS
                  )}
                </small>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Current Health Factor</label>
              </Col>
              <Col className="text-right">90%</Col>
            </Row>
            <Row className="pb-2">
              <Col>
                <Progress className="commodo-progress" percent={30} />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Liquidation Threshold</label>
              </Col>
              <Col className="text-right">80%</Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Liquidation Penalty</label>
              </Col>
              <Col className="text-right">5%</Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn">
          <ActionButton
            name="Close"
            lang={lang}
            disabled={dataInProgress || !selectedAssetId}
            amount={amountConversion(borrowPosition?.amountOut?.amount)}
            address={address}
            borrowId={borrowPosition?.borrowingId}
            denom={borrowPosition?.amountOut?.denom}
            refreshData={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};

CloseTab.propTypes = {
  dataInProgress: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  setBalanceRefresh: PropTypes.func.isRequired,
  address: PropTypes.string,
  assetMap: PropTypes.object,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  borrowPosition: PropTypes.shape({
    lendingId: PropTypes.shape({
      low: PropTypes.number,
    }),
    amountIn: PropTypes.shape({
      denom: PropTypes.string,
      amount: PropTypes.string,
    }),
  }),
  pair: PropTypes.shape({
    id: PropTypes.shape({
      low: PropTypes.number,
    }),
    assetIn: PropTypes.shape({
      low: PropTypes.number,
    }),
    amountOut: PropTypes.shape({
      low: PropTypes.number,
    }),
  }),
  pool: PropTypes.shape({
    poolId: PropTypes.shape({
      low: PropTypes.number,
    }),
    firstBridgedAssetId: PropTypes.shape({
      low: PropTypes.number,
    }),
    secondBridgedAssetId: PropTypes.shape({
      low: PropTypes.number,
    }),
  }),
  refreshBalance: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    pool: state.lend.pool._,
    pair: state.lend.pair,
    assetMap: state.asset._.map,
    balances: state.account.balances.list,
    lang: state.language,
    refreshBalance: state.account.refreshBalance,
    markets: state.oracle.market.list,
  };
};

const actionsToProps = {
  setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(CloseTab);
