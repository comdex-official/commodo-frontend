import { message } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { QueryPoolAssetLBMapping } from "../../../services/lend/query";
import { amountConversionWithComma } from "../../../utils/coin";
import { marketPrice } from "../../../utils/number";

export const TotalDeposit = ({ lendPool, assetMap, markets }) => {
  const [assetStats, setAssetStats] = useState({});

  useEffect(() => {
    if (lendPool?.poolId) {
      fetchAssetStats(lendPool?.transitAssetIds?.main, lendPool?.poolId);
      fetchAssetStats(lendPool?.transitAssetIds?.first, lendPool?.poolId);
      fetchAssetStats(lendPool?.transitAssetIds?.second, lendPool?.poolId);
    }
  }, [lendPool]);

  const fetchAssetStats = (assetId, poolId) => {
    QueryPoolAssetLBMapping(assetId, poolId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setAssetStats((prevState) => ({
        [assetId]: result?.PoolAssetLBMapping,
        ...prevState,
      }));
    });
  };

  const getTotalDeposited = () => {
    const sum =
      Number(
        assetStats[lendPool?.transitAssetIds?.main]?.totalLend *
          marketPrice(
            markets,
            assetMap?.[lendPool?.transitAssetIds?.main]?.denom
          )
      ) +
      Number(
        assetStats[lendPool?.transitAssetIds?.first]?.totalLend *
          marketPrice(
            markets,
            assetMap?.[lendPool?.transitAssetIds?.first]?.denom
          )
      ) +
      Number(
        assetStats[lendPool?.transitAssetIds?.second]?.totalLend *
          marketPrice(
            markets,
            assetMap?.[lendPool?.transitAssetIds?.second]?.denom
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
      rates: PropTypes.shape({
        low: PropTypes.number,
      }),
    })
  ),
  lendPool: PropTypes.shape({
    transitAssetIds: PropTypes.shape({
      main: PropTypes.number,
      first: PropTypes.number,
      second: PropTypes.number,
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
