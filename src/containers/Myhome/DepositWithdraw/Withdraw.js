import * as PropTypes from "prop-types";
import { SvgIcon, TooltipIcon } from "../../../components/common";
import { connect } from "react-redux";
import { Button, Select } from "antd";
import "./index.less";
import { useEffect, useState } from "react";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import {
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../utils/coin";
import CustomInput from "../../../components/CustomInput";
import { ValidateInputNumber } from "../../../config/_validation";
import ActionButton from "./ActionButton";
import Details from "../../../components/common/Details";

const { Option } = Select;

const WithdrawTab = ({
  lang,
  dataInProgress,
  lendPosition,
  refreshLendPosition,
  pool,
  assetMap,
  balances,
  address,
}) => {
  const [assetList, setAssetList] = useState();
  const [amount, setAmount] = useState();
  const [validationError, setValidationError] = useState();

  const selectedAssetId = lendPosition?.assetId?.toNumber();

  useEffect(() => {
    if (pool?.poolId) {
      setAssetList([
        assetMap[pool?.mainAssetId?.toNumber()],
        assetMap[pool?.firstBridgedAssetId?.toNumber()],
        assetMap[pool?.secondBridgedAssetId?.toNumber()],
      ]);
    }
  }, [pool]);
  
  const onChange = (value) => {
    value = toDecimals(value).toString().trim();

    setAmount(value);
    setValidationError(
      ValidateInputNumber(
        getAmount(value),
        getDenomBalance(balances, assetMap[selectedAssetId]?.denom) || 0
      )
    );
  };

  return (
    <div className="details-wrapper">
      <div className="details-left commodo-card">
        <div className="deposit-head">
          <div className="deposit-head-left">
            {assetList?.length > 0 &&
              assetList?.map((item) => (
                <div className="assets-col mr-3" key={item?.denom}>
                  <div className="assets-icon">
                    <SvgIcon name={iconNameFromDenom(item?.denom)} />
                  </div>
                  {denomConversion(item?.denom)}
                </div>
              ))}
          </div>
        </div>
        <div className="assets-select-card mb-0">
          <div className="assets-left">
            <label className="left-label">
              Withdraw <TooltipIcon text="" />
            </label>
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
                suffixIcon={
                  <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                }
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
          <div className="assets-right">
            <div className="label-right">
              Available
              <span className="ml-1">
                {amountConversionWithComma(lendPosition?.amountIn?.amount || 0)}{" "}
                {denomConversion(assetMap[selectedAssetId]?.denom)}
              </span>
              <div className="max-half">
                <Button className="active">Max</Button>
              </div>
            </div>
            <div>
              <div className="input-select">
                <CustomInput
                  value={amount}
                  onChange={(event) => onChange(event.target.value)}
                  validationError={validationError}
                />
              </div>
              <small>$120.00</small>
            </div>
          </div>
        </div>
        <div className="assets-form-btn">
          <ActionButton
            name="Withdraw"
            lang={lang}
            disabled={!Number(amount) || dataInProgress || !selectedAssetId}
            amount={amount}
            address={address}
            lendId={lendPosition?.lendingId}
            denom={lendPosition?.amountIn?.denom}
            refreshData={() => refreshLendPosition()}
          />
        </div>
      </div>
      <div className="details-right">
        <div className="commodo-card">
          <Details asset={assetMap[pool?.firstBridgedAssetId?.toNumber()]}/>
          <div className="mt-5">
            <Details asset={assetMap[pool?.secondBridgedAssetId?.toNumber()]}/>
          </div>
        </div>
        <div className="commodo-card">
          <Details asset={assetMap[pool?.mainAssetId?.toNumber()]}/>
        </div>
      </div>
    </div>
  );
};

WithdrawTab.propTypes = {
  dataInProgress: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  refreshLendPosition: PropTypes.func.isRequired,
  address: PropTypes.string,
  assetMap: PropTypes.object,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  lendPosition: PropTypes.shape({
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
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    pool: state.lend.pool._,
    assetMap: state.asset._.map,
    balances: state.account.balances.list,
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(WithdrawTab);
