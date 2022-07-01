import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { queryAssetStats } from "../../../services/lend/query";
import { message } from "antd";
import { decimalConversion, marketPrice } from "../../../utils/number";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { amountConversionWithComma } from "../../../utils/coin";

export const TotalDeposit = ({ lendPool, assetMap, markets }) => {
  const [assetStats, setAssetStats] = useState({});

  useEffect(() => {
    if (lendPool?.poolId) {
      fetchAssetStats(lendPool?.mainAssetId, lendPool?.poolId);
      fetchAssetStats(lendPool?.firstBridgedAssetId, lendPool?.poolId);
      fetchAssetStats(lendPool?.secondBridgedAssetId, lendPool?.poolId);
    }
  }, [lendPool]);

  const fetchAssetStats = (assetId, poolId) => {
    queryAssetStats(assetId, poolId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }
      setAssetStats((prevState) => ({
        [assetId]: result?.AssetStats,
        ...prevState,
      }));
    });
  };

  const getTotalDeposited = () => {
    const sum =
      Number(
        decimalConversion(assetStats[lendPool?.mainAssetId]?.totalLend) *
          marketPrice(markets, assetMap?.[lendPool?.mainAssetId]?.denom)
      ) +
      Number(
        decimalConversion(
          assetStats[lendPool?.firstBridgedAssetId]?.totalLend
        ) *
          marketPrice(markets, assetMap?.[lendPool?.firstBridgedAssetId]?.denom)
      ) +
      Number(
        decimalConversion(
          assetStats[lendPool?.secondBridgedAssetId]?.totalLend
        ) *
          marketPrice(
            markets,
            assetMap?.[lendPool?.secondBridgedAssetId]?.denom
          )
      );

    return `$${amountConversionWithComma(sum || 0, DOLLAR_DECIMALS)}`;
  };
  return <div>{getTotalDeposited()}</div>;
};

TotalDeposit.propTypes = {
  assetMap: PropTypes.object,
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.string,
    })
  ),
  lendPool: PropTypes.shape({
    mainAssetId: PropTypes.shape({
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
    markets: state.oracle.market.list,
    assetMap: state.asset._.map,
  };
};

export default connect(stateToProps)(TotalDeposit);
