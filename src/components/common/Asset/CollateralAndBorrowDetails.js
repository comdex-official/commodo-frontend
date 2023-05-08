import { List } from "antd";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { setAssetStatMap } from "../../../actions/asset";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { commaSeparatorWithRounding } from "../../../utils/coin";
import { decimalConversion } from "../../../utils/number";
import { iconNameFromDenom } from "../../../utils/string";
import { SvgIcon, TooltipIcon } from "../index";

const CollateralAndBorrowDetails = ({
  lendAssetId,
  parent,
  collateralAssetDenom,
  borrowAssetDenom,
  currentBalance,
  newBalance,
  assetRatesStatsMap,
}) => {
  let data = [
    {
      title: "Max LTV",
      counts: `${Number(
        decimalConversion(
          assetRatesStatsMap[lendAssetId]?.liquidationThreshold
        ) * 100
      ).toFixed(DOLLAR_DECIMALS)}%`,
      tooltipText:
        parent === "lend" ? "Total funds Deposited" : "Total funds Borrowed",
    },
    {
      title: "Liq. Threshold",
      counts: `${Number(
        decimalConversion(assetRatesStatsMap[lendAssetId]?.liquidationPenalty) *
          100
      ).toFixed(DOLLAR_DECIMALS)}%`,
      tooltipText:
        "The threshold at which a loan is defined as under collateralized and subject to liquidation of collateral",
    },
    {
      title: "Liq. Penalty",
      counts: `${Number(
        decimalConversion(assetRatesStatsMap[lendAssetId]?.liquidationPenalty) *
          100
      ).toFixed(DOLLAR_DECIMALS)}%`,
      tooltipText: "Fee paid by vault owners on liquidation",
    },
    {
      title: "Collateral Type",
      counts: "Normal",
      tooltipText: "Type of the collateral selected",
    },
  ];

  let borrowData = [
    {
      title: "Current borrow balance",
      counts: commaSeparatorWithRounding(currentBalance || 0, DOLLAR_DECIMALS),
      tooltipText: "Your current borrow balance",
    },
    {
      title: "New Borrow balance",
      counts: commaSeparatorWithRounding(newBalance || 0, DOLLAR_DECIMALS),
      tooltipText: "Your new borrow balance",
    },
  ];

  return (
    <>
      <div className="card-head no-border">
        <div className="head-left">
          <div className="assets-col">
            <div className="assets-icon">
              <SvgIcon name={iconNameFromDenom(collateralAssetDenom)} />
            </div>
            Collateral Details
          </div>
        </div>
      </div>
      <List
        grid={{
          gutter: 16,
          xs: 2,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div>
              <p>
                {item.title} <TooltipIcon text={item.tooltipText} />
              </p>
              <h3>{item.counts}</h3>
            </div>
          </List.Item>
        )}
      />
      <div className="card-head no-border">
        <div className="head-left">
          <div className="assets-col">
            <div className="assets-icon">
              <SvgIcon name={iconNameFromDenom(borrowAssetDenom)} />
            </div>
            Borrow Details
          </div>
        </div>
      </div>
      <List
        grid={{
          gutter: 16,
          xs: 2,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        dataSource={borrowData}
        renderItem={(item) => (
          <List.Item>
            <div>
              <p>
                {item.title} <TooltipIcon text={item.tooltipText} />
              </p>
              <h3>{item.counts}</h3>
            </div>
          </List.Item>
        )}
      />
    </>
  );
};

CollateralAndBorrowDetails.propTypes = {
  borrowAssetDenom: PropTypes.string,
  collateralAssetDenom: PropTypes.string,
  lendAssetId: PropTypes.number,
  assetRatesStatsMap: PropTypes.object,
  currentBalance: PropTypes.number,
  newBalance: PropTypes.number,
  parent: PropTypes.string,
};

const stateToProps = (state) => {
  return {
    markets: state.oracle.market,
    refreshBalance: state.account.refreshBalance,
    assetDenomMap: state.asset._.assetDenomMap,
    assetRatesStatsMap: state.lend.assetRatesStats.map,
  };
};

const actionsToProps = {
  setAssetStatMap,
};

export default connect(
  stateToProps,
  actionsToProps
)(CollateralAndBorrowDetails);
