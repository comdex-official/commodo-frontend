import { Button, List } from "antd";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { setAssetStatMap } from "../../../actions/asset";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { commaSeparatorWithRounding } from "../../../utils/coin";
import { decimalConversion } from "../../../utils/number";
import { iconNameFromDenom } from "../../../utils/string";
import { SvgIcon, TooltipIcon } from "../index";

const CollateralDetails = ({
  assetId,
  parent,
  assetDenom,
  currentBalance,
  newBalance,
  assetRatesStatsMap,
}) => {
  let data = [
    {
      title: parent === "lend" ? "Liq. Threshold" : "Borrowed",
      counts: `${Number(
        decimalConversion(assetRatesStatsMap[assetId]?.liquidationThreshold) *
          100
      ).toFixed(DOLLAR_DECIMALS)}%`,
      tooltipText:
        parent === "lend" ? "Total funds Deposited" : "Total funds Borrowed",
    },
    {
      title: "Liq. Penalty",
      counts: `${Number(
        decimalConversion(assetRatesStatsMap[assetId]?.liquidationPenalty) * 100
      ).toFixed(DOLLAR_DECIMALS)}%`,
      tooltipText:
        parent === "lend" ? "Total funds Available" : "Total funds Available",
    },
    {
      title: "Collateral Type",
      counts: "Normal",
      tooltipText:
        parent === "lend" ? "Asset Utilization" : "Asset Utilization",
    },
    {
      title: parent === "lend" ? "Current Lent Position" : "Borrowed",
      counts: commaSeparatorWithRounding(currentBalance || 0, DOLLAR_DECIMALS),
    },
    {
      title: parent === "lend" ? "New Lent Position" : "Borrowed",
      counts: commaSeparatorWithRounding(newBalance || 0, DOLLAR_DECIMALS),
    },
    {
      title: "Buy",
      counts: <Button>Buy</Button>,
    },
  ];

  return (
    <>
      <div className="card-head">
        <div className="head-left">
          <div className="assets-col">
            <div className="assets-icon">
              <SvgIcon name={iconNameFromDenom(assetDenom)} />
            </div>
            Collateral Details
          </div>
        </div>
      </div>
      <List
        grid={{
          gutter: 16,
          xs: 3,
          sm: 3,
          md: 3,
          lg: 3,
          xl: 3,
          xxl: 3,
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
    </>
  );
};

CollateralDetails.propTypes = {
  assetDenom: PropTypes.string,
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

export default connect(stateToProps, actionsToProps)(CollateralDetails);
