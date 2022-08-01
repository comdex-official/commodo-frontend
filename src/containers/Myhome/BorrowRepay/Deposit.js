import { Button, Select } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setBalanceRefresh } from "../../../actions/account";
import { Col, Row, SvgIcon, TooltipIcon } from "../../../components/common";
import CustomRow from "../../../components/common/Asset/CustomRow";
import Details from "../../../components/common/Asset/Details";
import CustomInput from "../../../components/CustomInput";
import HealthFactor from "../../../components/HealthFactor";
import { ValidateInputNumber } from "../../../config/_validation";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { queryLendPosition } from "../../../services/lend/query";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount
} from "../../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  marketPrice
} from "../../../utils/number";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import ActionButton from "./ActionButton";
import "./index.less";

const { Option } = Select;

const DepositTab = ({
  lang,
  dataInProgress,
  borrowPosition,
  pool,
  assetMap,
  assetRatesStatsMap,
  address,
  refreshBalance,
  setBalanceRefresh,
  refreshBorrowPosition,
  markets,
  pair,
}) => {
  const [amount, setAmount] = useState();
  const [validationError, setValidationError] = useState();
  const [assetList, setAssetList] = useState();
  const [lend, setLendPosition] = useState();

  const selectedAssetId = pair?.assetIn?.toNumber();
  const availableBalance = lend?.availableToBorrow || 0;

  // Collateral deposited value * Max LTV of collateral minus already Borrowed asset value

  useEffect(() => {
    if (pool?.poolId) {
      setAssetList([
        assetMap[pool?.mainAssetId?.toNumber()],
        assetMap[pool?.firstBridgedAssetId?.toNumber()],
        assetMap[pool?.secondBridgedAssetId?.toNumber()],
      ]);
    }
  }, [pool]);

  useEffect(() => {
    if (borrowPosition?.lendingId) {
      queryLendPosition(borrowPosition?.lendingId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }
        if (result?.lend?.poolId) {
          setLendPosition(result?.lend);
        }
      });
    }
  }, [borrowPosition]);

  const handleInputChange = (value) => {
    value = toDecimals(value).toString().trim();

    setAmount(value);
    setValidationError(ValidateInputNumber(getAmount(value), availableBalance));
  };

  const handleMaxClick = () => {
    return handleInputChange(amountConversion(availableBalance));
  };

  const handleRefresh = () => {
    refreshBorrowPosition();
    setBalanceRefresh(refreshBalance + 1);
    setAmount();
  };

  let currentLTV = Number(
    ((Number(borrowPosition?.amountOut?.amount) *
      marketPrice(markets, borrowPosition?.amountOut?.denom)) /
      (Number(
        amount
          ? Number(borrowPosition?.amountIn?.amount) + Number(getAmount(amount))
          : borrowPosition?.amountIn?.amount
      ) *
        marketPrice(markets, borrowPosition?.amountIn?.denom))) *
      100
  );

  return (
    <div className="details-wrapper">
      <div className="details-left commodo-card">
        <CustomRow assetList={assetList} />
        <div className="assets-select-card mb-3">
          <div className="assets-left">
            <label className="left-label">
              Asset <TooltipIcon text="" />
            </label>
            <div className="assets-select-wrapper">
              <div className="assets-select-wrapper">
                <Select
                  className="assets-select"
                  dropdownClassName="asset-select-dropdown"
                  defaultValue="1"
                  placeholder={
                    <div className="select-placeholder">
                      <div className="circle-icon">
                        <div className="circle-icon-inner" />
                      </div>
                      Select
                    </div>
                  }
                  defaultActiveFirstOption={true}
                >
                  <Option key="1">
                    <div className="select-inner">
                      <div className="svg-icon">
                        <div className="svg-icon-inner">
                          <SvgIcon
                            name={iconNameFromDenom(
                              assetMap[selectedAssetId]?.denom
                            )}
                          />
                        </div>
                      </div>
                      <div className="name">
                        {denomConversion(assetMap[selectedAssetId]?.denom)}
                      </div>
                    </div>
                  </Option>
                </Select>
              </div>
            </div>
          </div>
          <div className="assets-right">
            <div className="label-right">
              Depositable
              <span className="ml-1">
                {amountConversionWithComma(availableBalance)}{" "}
                {denomConversion(assetMap[selectedAssetId]?.denom)}
              </span>
              <div className="max-half">
                <Button className="active" onClick={handleMaxClick}>
                  Max
                </Button>
              </div>
            </div>
            <div>
              <div className="input-select">
                <CustomInput
                  value={amount}
                  onChange={(event) => handleInputChange(event.target.value)}
                  validationError={validationError}
                />{" "}
              </div>
              <small>
                $
                {commaSeparator(
                  Number(
                    amount *
                      marketPrice(markets, assetMap[selectedAssetId]?.denom) ||
                      0
                  ),
                  DOLLAR_DECIMALS
                )}{" "}
              </small>{" "}
            </div>
          </div>
        </div>
        <Row>
          <Col sm="12" className="mt-3 mx-auto card-bottom-details">
            <HealthFactor
              borrow={borrowPosition}
              pair={pair}
              inAmount={
                amount
                  ? Number(borrowPosition?.amountIn?.amount) +
                    Number(getAmount(amount))
                  : borrowPosition?.amountIn?.amount
              }
              outAmount={borrowPosition?.amountOut?.amount}
            />
            <Row>
              <Col sm="12" className="mt-3 mx-auto card-bottom-details">
                <Row className="mt-2">
                  <Col>
                    <label>Current LTV</label>
                  </Col>
                  <Col className="text-right">
                    {(isFinite(currentLTV) ? currentLTV : 0).toFixed(
                      DOLLAR_DECIMALS
                    )}
                    %
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <label>Max LTV</label>
                  </Col>
                  <Col className="text-right">
                    {Number(
                      decimalConversion(
                        assetRatesStatsMap[pair?.assetIn]?.uOptimal
                      ) * 100
                    ).toFixed(DOLLAR_DECIMALS)}
                    %
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn">
          <ActionButton
            name="Deposit"
            lang={lang}
            disabled={!Number(amount) || dataInProgress || !selectedAssetId}
            amount={amount}
            address={address}
            borrowId={borrowPosition?.borrowingId}
            denom={borrowPosition?.amountIn?.denom}
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

DepositTab.propTypes = {
  dataInProgress: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  refreshBorrowPosition: PropTypes.func.isRequired,
  setBalanceRefresh: PropTypes.func.isRequired,
  address: PropTypes.string,
  assetMap: PropTypes.object,
  assetRatesStatsMap: PropTypes.object,
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
    lang: state.language,
    refreshBalance: state.account.refreshBalance,
    markets: state.oracle.market.list,
    assetRatesStatsMap: state.lend.assetRatesStats.map,
  };
};

const actionsToProps = {
  setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(DepositTab);