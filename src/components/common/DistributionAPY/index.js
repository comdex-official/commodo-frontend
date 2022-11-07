import { Button } from "antd";
import * as PropTypes from "prop-types";
import React from "react";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import "./index.less";

const DistributionAPY = ({ value, margin }) => {
  return (
    <Button type="primary" size="small" className={margin === "top" ? "mt-1 distribution-apy-button" : "ml-1 distribution-apy-button"}>
      {Number(value || 0).toFixed(DOLLAR_DECIMALS)}%
    </Button>
  );
};

DistributionAPY.propTypes = {
  margin: PropTypes.string,
  value: PropTypes.any,
};

export default DistributionAPY;
