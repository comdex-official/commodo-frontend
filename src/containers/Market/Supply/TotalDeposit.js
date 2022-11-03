import { message } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { QueryPoolAssetLBMapping } from "../../../services/lend/query";
import { amountConversionWithComma } from "../../../utils/coin";
import { marketPrice } from "../../../utils/number";

export const TotalDeposit = ({
  lendPool,
  assetMap,
  markets,
  assetDenomMap,
}) => {
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
            assetMap?.[lendPool?.transitAssetIds?.main]?.denom,
            assetDenomMap[[lendPool?.transitAssetIds?.main]?.denom]?.id
          )
      ) +
      Number(
        assetStats[lendPool?.transitAssetIds?.first]?.totalLend *
          marketPrice(
            markets,
            assetMap?.[lendPool?.transitAssetIds?.first]?.denom,
            assetDenomMap[[lendPool?.transitAssetIds?.first]?.denom]?.id
          )
      ) +
      Number(
        assetStats[lendPool?.transitAssetIds?.second]?.totalLend *
          marketPrice(
            markets,
            assetMap?.[lendPool?.transitAssetIds?.second]?.denom,
            assetDenomMap[[lendPool?.transitAssetIds?.second]?.denom]?.id
          )
      );

    return `$${amountConversionWithComma(sum || 0, DOLLAR_DECIMALS)}`;
  };
  return <div>{getTotalDeposited()}</div>;
};

TotalDeposit.propTypes = {
  assetMap: PropTypes.object,
  assetDenomMap: PropTypes.object,
    markets: PropTypes.object,
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
    markets: state.oracle.market.map,
    assetMap: state.asset._.map,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

export default connect(stateToProps)(TotalDeposit);
