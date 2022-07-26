import { Progress } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { DOLLAR_DECIMALS } from "../../constants/common";
import { decimalConversion, marketPrice } from "../../utils/number";

const HealthFactor = ({
  parent,
  size,
  borrow,
  assetRatesStatsMap,
  markets,
  assetMap,
}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (borrow?.borrowingId) {
      let asset = Object.values(assetMap).filter(
        (item) => item.denom === borrow?.amountOut?.denom
      )[0];

      if (asset?.id) {
        setPercentage(
          (borrow?.amountIn?.amount *
            marketPrice(markets, borrow?.amountIn?.denom) *
            Number(decimalConversion(assetRatesStatsMap[asset?.id]?.ltv))) /
            (borrow?.amountOut?.amount *
              marketPrice(markets, borrow?.amountOut?.denom))
        );
      }
    }
  }, [markets, borrow]);

  return (
    <Progress
      className={parent === "table" ? "health-progress" : ""}
      percent={Number(percentage || 0).toFixed(DOLLAR_DECIMALS)}
      size={size ? size : "small"}
    />
  );
};

HealthFactor.propTypes = {
  assetMap: PropTypes.object,
  assetRatesStatsMap: PropTypes.object,
  borrow: PropTypes.object,
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.shape({
        low: PropTypes.number,
      }),
    })
  ),
  parent: PropTypes.string,
};

const stateToProps = (state) => {
  return {
    assetRatesStatsMap: state.lend.assetRatesStats.map,
    markets: state.oracle.market.list,
    assetMap: state.asset._.map,
  };
};

export default connect(stateToProps)(HealthFactor);
