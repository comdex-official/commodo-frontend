import { Button, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import React from "react";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import "./index.less";

const DistributionAPY = ({ value, margin }) => {
  return (
    <Tooltip placement="topLeft" title={"Projected Distribution Reward APY for Borrowing"}>
      <Button
        type="primary"
        className={
          margin === "top"
            ? "mt-1 distribution-apy-button"
            : "ml-1 distribution-apy-button"
        }
      >
        {Number(value || 0).toFixed(DOLLAR_DECIMALS)}%
      </Button>
    </Tooltip>
  );
};

DistributionAPY.propTypes = {
  margin: PropTypes.string,
  value: PropTypes.any,
};

export default DistributionAPY;
