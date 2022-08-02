import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { setBalanceRefresh } from "../../../actions/account";
import { Col, Row } from "../../../components/common";
import Details from "../../../components/common/Asset/Details";
import AssetStats from "../../../components/common/Asset/Stats";
import HealthFactor from "../../../components/HealthFactor";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getDenomBalance
} from "../../../utils/coin";
import { commaSeparator, marketPrice } from "../../../utils/number";
import ActionButton from "./ActionButton";
import "./index.less";

const CloseTab = ({
  lang,
  dataInProgress,
  borrowPosition,
  pool,
  assetMap,
  address,
  refreshBalance,
  setBalanceRefresh,
  markets,
  balances,
  pair,
}) => {
  const selectedAssetId = pair?.assetOut?.toNumber();

  const availableBalance =
    getDenomBalance(balances, borrowPosition?.amountOut?.denom) || 0;

  const handleRefresh = () => {
    setBalanceRefresh(refreshBalance + 1);
  };

  return (
    <div className="details-wrapper">
      <div className="details-left commodo-card">
        <Row>
          <Col sm="12" className="mt-2 mx-auto card-bottom-details">
            <Row>
              <Col>
                <label>Amount to be closed</label>
              </Col>
              <Col className="text-right">
                <div>
                  {amountConversionWithComma(borrowPosition?.updatedAmountOut)}{" "}
                  {denomConversion(borrowPosition?.amountOut?.denom)}
                </div>
                <small className="font-weight-light">
                  $
                  {commaSeparator(
                    Number(
                      amountConversion(borrowPosition?.updatedAmountOut) *
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
            <Row>
              <Col>
                <label>Available</label>
              </Col>
              <Col className="text-right">
                <div>
                  {amountConversionWithComma(availableBalance)}{" "}
                  {denomConversion(borrowPosition?.amountOut?.denom)}
                </div>
              </Col>
            </Row>
            <HealthFactor
              borrow={borrowPosition}
              pair={pair}
              pool={pool}
              inAmount={borrowPosition?.amountIn?.amount}
              outAmount={Number(borrowPosition?.updatedAmountOut)}
            />{" "}
            <AssetStats assetId={selectedAssetId} />
          </Col>
        </Row>
        <div className="assets-form-btn">
          <ActionButton
            name="Close"
            lang={lang}
            disabled={
              dataInProgress ||
              !selectedAssetId ||
              Number(availableBalance) <
                Number(borrowPosition?.updatedAmountOut)
            }
            amount={amountConversion(borrowPosition?.updatedAmountOut)}
            address={address}
            borrowId={borrowPosition?.borrowingId}
            denom={borrowPosition?.amountOut?.denom}
            refreshData={handleRefresh}
          />
        </div>
      </div>
      <div className="details-right">
        <div className="commodo-card">
          <Details
            asset={assetMap[pool?.firstBridgedAssetId?.toNumber()]}
            poolId={pool?.poolId}
            parent="borrow"
          />
          <div className="mt-5">
            <Details
              asset={assetMap[pool?.secondBridgedAssetId?.toNumber()]}
              poolId={pool?.poolId}
              parent="borrow"
            />
          </div>
        </div>
        <div className="commodo-card">
          <Details
            asset={assetMap[pool?.mainAssetId?.toNumber()]}
            poolId={pool?.poolId}
            parent="borrow"
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
    balances: state.account.balances.list,
    assetMap: state.asset._.map,
    lang: state.language,
    refreshBalance: state.account.refreshBalance,
    markets: state.oracle.market.list,
  };
};

const actionsToProps = {
  setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(CloseTab);
