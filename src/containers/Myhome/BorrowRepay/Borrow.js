import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../../components/common";
import { connect } from "react-redux";
import { Button, List, Select, Input, Tooltip } from "antd";
import "./index.less";
import AssetStats from "../../../components/common/Asset/Stats";
import { setBalanceRefresh } from "../../../actions/account";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../utils/coin";
import { commaSeparator, marketPrice } from "../../../utils/number";
import { DEFAULT_FEE, DOLLAR_DECIMALS } from "../../../constants/common";
import CustomInput from "../../../components/CustomInput";
import { useState } from "react";
import { ValidateInputNumber } from "../../../config/_validation";
import { comdex } from "../../../config/network";
import ActionButton from "./ActionButton";

const { Option } = Select;

const BorrowTab = ({
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
}) => {
  const [amount, setAmount] = useState();
  const [validationError, setValidationError] = useState();

  const selectedAssetId = 3;
  const availableBalance =
    getDenomBalance(balances, borrowPosition?.amountOut?.denom) || 0;
  //TODO update available balance

  const handleInputChange = (value) => {
    value = toDecimals(value).toString().trim();

    setAmount(value);
    setValidationError(ValidateInputNumber(getAmount(value), availableBalance));
  };

  const handleMaxClick = () => {
    if (assetMap[selectedAssetId]?.denom === comdex.coinMinimalDenom) {
      return Number(availableBalance) > DEFAULT_FEE
        ? handleInputChange(amountConversion(availableBalance - DEFAULT_FEE))
        : handleInputChange();
    } else {
      return handleInputChange(amountConversion(availableBalance));
    }
  };

  const handleRefresh = () => {
    setBalanceRefresh(refreshBalance + 1);
    setAmount();
  };

  return (
    <div className="details-wrapper">
      <div className="details-left commodo-card">
        <div className="assets-select-card mb-3">
          <div className="assets-left">
            <label className="left-label">
              Borrow <TooltipIcon text="" />
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
              Available
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
            <AssetStats assetId={selectedAssetId} />
          </Col>
        </Row>
        <div className="assets-form-btn">
          <ActionButton
            name="Borrow"
            lang={lang}
            disabled={!Number(amount) || dataInProgress || !selectedAssetId}
            amount={amount}
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

BorrowTab.propTypes = {
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

export default connect(stateToProps, actionsToProps)(BorrowTab);
