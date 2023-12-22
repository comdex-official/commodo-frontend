import { Button, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { queryExternalLendRewardsAPR } from "../../../services/rewards/query";
import { decimalConversion } from "../../../utils/number";
import SvgIcon from "../svg-icon/svg-icon";
import "./index.scss";

const DistributionAPY = ({ value, margin, assetId, poolId }) => {
  const [apr, setAPR] = useState();

  useEffect(() => {
    if (assetId && poolId) {
      queryExternalLendRewardsAPR(assetId, poolId, (error, result) => {
        if (error) {
          return;
        }

        setAPR(result?.apr);
      });
    }
  }, [assetId, poolId]);

  return (
    <Tooltip
      placement="topLeft"
      title={"Projected Boosted Reward APR for borrowing"}
    >
      <Button
        type="primary"
        className={
          margin === "top"
            ? "mt-1 distribution-apy-button"
            : "ml-1 distribution-apy-button"
        }
      >
        <SvgIcon
          name="cmdx-icon"
          className="apr-icon"
          viewbox="0 0 32.001 32.001"
        />
        {Number(decimalConversion(apr || 0) * 100).toFixed(DOLLAR_DECIMALS)}%
      </Button>
    </Tooltip>
  );
};

DistributionAPY.propTypes = {
  margin: PropTypes.string,
  value: PropTypes.any,
};

export default DistributionAPY;
