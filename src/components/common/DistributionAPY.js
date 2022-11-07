import { Button } from "antd";
import * as PropTypes from "prop-types";
import React from "react";
import { DOLLAR_DECIMALS } from "../../constants/common";

const DistributionAPY = ({ value }) => {
  return <Button type='primary' className="ml-1">{Number(value || 0).toFixed(DOLLAR_DECIMALS)}%</Button>;
};

DistributionAPY.propTypes = {
  value: PropTypes.any,
};

export default DistributionAPY;
