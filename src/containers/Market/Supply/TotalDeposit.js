import { message } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { queryAssetPoolFundBalance, QueryPoolAssetLBMapping } from "../../../services/lend/query";
import {
  amountConversion, commaSeparatorWithRounding
} from "../../../utils/coin";
import { marketPrice } from "../../../utils/number";

export const TotalDeposit = ({ lendPool, assetMap, markets }) => {
  const [assetStats, setAssetStats] = useState({});
  const [assetPoolFunds, setAssetPoolFunds] = useState({});

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

    queryAssetPoolFundBalance(assetId, poolId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setAssetPoolFunds((prevState) => ({
        [assetId]: result?.amount,
        ...prevState,
      }));
    });
  };

  const getTotalDeposited = () => {
    const sum =
      Number(
        amountConversion(
          assetStats[lendPool?.transitAssetIds?.main]?.totalLend,
          assetMap?.[lendPool?.transitAssetIds?.main]?.decimals
        ) *
          marketPrice(
            markets,
            assetMap?.[lendPool?.transitAssetIds?.main]?.denom,
            lendPool?.transitAssetIds?.main
          )
      ) +
      Number(
        amountConversion(
          assetStats[lendPool?.transitAssetIds?.first]?.totalLend,
          assetMap?.[lendPool?.transitAssetIds?.first]?.decimals
        ) *
          marketPrice(
            markets,
            assetMap?.[lendPool?.transitAssetIds?.first]?.denom,
            lendPool?.transitAssetIds?.first
          )
      ) +
      Number(
        amountConversion(
          assetStats[lendPool?.transitAssetIds?.second]?.totalLend,
          assetMap?.[lendPool?.transitAssetIds?.second]?.decimals
        ) *
          marketPrice(
            markets,
            assetMap?.[lendPool?.transitAssetIds?.second]?.denom,
            lendPool?.transitAssetIds?.second
          )
      );

    return `$${commaSeparatorWithRounding(sum || 0, DOLLAR_DECIMALS)}`;
  };
  return <div>{getTotalDeposited()}</div>;
};

TotalDeposit.propTypes = {
  assetMap: PropTypes.object,
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
    markets: state.oracle.market,
    assetMap: state.asset._.map,
  };
};

export default connect(stateToProps)(TotalDeposit);
