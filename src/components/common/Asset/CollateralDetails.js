import { Button, List } from "antd";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { setAssetStatMap } from "../../../actions/asset";
import {
  DOLLAR_DECIMALS,
  ZERO_DOLLAR_DECIMALS,
} from "../../../constants/common";
import { decimalConversion, formatNumber } from "../../../utils/number";
import { iconNameFromDenom } from "../../../utils/string";
import { SvgIcon, TooltipIcon } from "../index";

const CollateralDetails = ({
  assetId,
  parent,
  assetDenom,
  currentBalance,
  newBalance,
  assetRatesStatsMap,
  eMod,
}) => {
  const liquidationPenaltyBonus =
    Number(
      decimalConversion(assetRatesStatsMap[assetId]?.liquidationPenalty) * 100
    ) +
    Number(decimalConversion(assetRatesStatsMap[assetId]?.liquidationBonus)) *
      100;

  const liquidationPenaltyBonus2 = Number(
    decimalConversion(assetRatesStatsMap[assetId]?.eLiquidationPenalty) * 100
  );

  let data = [
    {
      title: parent === "lend" ? "Liq. Threshold" : "Borrowed",
      counts: eMod
        ? `${Number(
            decimalConversion(
              assetRatesStatsMap[assetId]?.eLiquidationThreshold
            ) * 100
          ).toFixed(DOLLAR_DECIMALS)}%`
        : `${Number(
            decimalConversion(
              assetRatesStatsMap[assetId]?.liquidationThreshold
            ) * 100
          ).toFixed(DOLLAR_DECIMALS)}%`,
      tooltipText:
        "The threshold at which a loan is defined as under collateralized and subject to liquidation of collateral",
    },
    {
      title: "Liq. Penalty",
      counts: eMod
        ? `${Number(liquidationPenaltyBonus2).toFixed(DOLLAR_DECIMALS)}%`
        : `${Number(liquidationPenaltyBonus).toFixed(DOLLAR_DECIMALS)}%`,
      tooltipText: "Fee paid by vault owners on liquidation",
    },
    {
      title: "Collateral Type",
      counts: "Normal",
      tooltipText: "Type of the collateral selected",
    },
    {
      title: "Current Lend Position",
      counts: `$${formatNumber(
        Number(currentBalance || 0).toFixed(ZERO_DOLLAR_DECIMALS)
      )}`,
      tooltipText: "Your current lend balance",
    },
    {
      title: "New Lend Position",
      counts: `$${formatNumber(
        Number(newBalance || 0).toFixed(ZERO_DOLLAR_DECIMALS)
      )}`,
      tooltipText: "Your new lend balance",
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
        <div className="head-right">
          <Button type="primary" size="small" className="external-btn">
            <a href={"https://app.cswap.one"} target="_blank" rel="noreferrer">
              Buy{" "}
              <span className="hyperlink-icon">
                {" "}
                <SvgIcon name="hyperlink" />
              </span>
            </a>
          </Button>
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
                {item.title}{" "}
                {item.tooltipText ? (
                  <TooltipIcon text={item.tooltipText} />
                ) : null}
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
