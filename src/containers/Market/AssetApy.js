import { message } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { queryAssetStats } from "../../services/lend/query";
import { decimalConversion } from "../../utils/number";
import { DOLLAR_DECIMALS } from "../../constants/common";

const AssetApy = ({ assetId, poolId, parent }) => {
  const [stats, setStats] = useState();

  useEffect(() => {
    if (assetId && poolId) {
      queryAssetStats(assetId, poolId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        setStats(result?.AssetStats);
      });
    }
  }, [assetId, poolId]);

  return (
    <>
      {Number(
        decimalConversion(parent === "lend" ? stats?.lendApr : stats?.borrowApr) * 100,
      ).toFixed(DOLLAR_DECIMALS)}
      %
    </>
  );
};

AssetApy.propTypes = {
  assetId: PropTypes.shape({
    low: PropTypes.number,
  }),
  parent: PropTypes.string,
  poolId: PropTypes.shape({
    low: PropTypes.number,
  }),
};

export default AssetApy;
