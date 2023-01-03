import { Select } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NoDataIcon, SvgIcon } from "../../../components/common";
import CustomRow from "../../../components/common/Asset/CustomRow";
import Details from "../../../components/common/Asset/Details";
import {
  amountConversionWithComma,
  denomConversion
} from "../../../utils/coin";
import { iconNameFromDenom } from "../../../utils/string";
import ActionButton from "./ActionButton";
import "./index.less";

const { Option } = Select;

const CloseTab = ({
  lang,
  lendPosition,
  pool,
  assetMap,
  address,
  assetDenomMap,
  borrowToLendMap,
}) => {
  const [assetList, setAssetList] = useState();
  const [amount, setAmount] = useState();

  const selectedAssetId = lendPosition?.assetId?.toNumber();
  const availableBalance = lendPosition?.availableToBorrow || 0;

  useEffect(() => {
    if (pool?.poolId) {
      setAssetList([
        assetMap[pool?.transitAssetIds?.main?.toNumber()],
        assetMap[pool?.transitAssetIds?.first?.toNumber()],
        assetMap[pool?.transitAssetIds?.second?.toNumber()],
      ]);
    }
  }, [pool]);

  let isBorrowPositionOpen =
    !!borrowToLendMap[lendPosition?.lendingId]?.borrowingId?.toNumber();

  return (
    <div className="details-wrapper">
      <div className="details-left commodo-card">
        <CustomRow assetList={assetList} poolId={pool?.poolId?.low} />
        <div className="assets-select-card mb-0">
          <div className="assets-left">
            <label className="left-label">Close Position</label>
            <div className="assets-select-wrapper">
              <Select
                className="assets-select"
                popupClassName="asset-select-dropdown"
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
                showArrow={false}
                disabled
                suffixIcon={
                  <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                }
                notFoundContent={<NoDataIcon />}
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
                {amountConversionWithComma(
                  availableBalance,
                  assetMap[selectedAssetId]?.decimals
                )}{" "}
                {denomConversion(assetMap[selectedAssetId]?.denom)}
              </span>
            </div>
          </div>
        </div>
        <div className="assets-form-btn">
          <ActionButton
            name="Close"
            lang={lang}
            amount={amount}
            disabled={isBorrowPositionOpen}
            address={address}
            lendId={lendPosition?.lendingId}
            denom={lendPosition?.amountIn?.denom}
            assetDenomMap={assetDenomMap}
            tooltipText={isBorrowPositionOpen ? "Borrowing position open" : ""}
          />
        </div>
      </div>
      <div className="details-right">
        <div className="commodo-card">
          <Details
            asset={assetMap[pool?.transitAssetIds?.first?.toNumber()]}
            poolId={pool?.poolId}
            parent="lend"
          />
          <div className="mt-5">
            <Details
              asset={assetMap[pool?.transitAssetIds?.second?.toNumber()]}
              poolId={pool?.poolId}
              parent="lend"
            />
          </div>
        </div>
        <div className="commodo-card">
          <Details
            asset={assetMap[pool?.transitAssetIds?.main?.toNumber()]}
            poolId={pool?.poolId}
            parent="lend"
          />
        </div>
      </div>
    </div>
  );
};

CloseTab.propTypes = {
  dataInProgress: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  assetMap: PropTypes.object,
  assetDenomMap: PropTypes.object,
  borrowToLendMap: PropTypes.object,
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
    lang: state.language,
    assetDenomMap: state.asset._.assetDenomMap,
    borrowToLendMap: state.lend.borrowToLendMap,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(CloseTab);
