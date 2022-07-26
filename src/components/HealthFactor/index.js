import { Progress } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, Row } from "../../components/common";
import { DOLLAR_DECIMALS } from "../../constants/common";
import { decimalConversion, marketPrice } from "../../utils/number";

const HealthFactor = ({
  parent,
  size,
  borrow,
  assetRatesStatsMap,
  markets,
  assetMap,
  name,
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
            Number(
              decimalConversion(
                assetRatesStatsMap[asset?.id]?.liquidationThreshold
              )
            )) /
            (borrow?.amountOut?.amount *
              marketPrice(markets, borrow?.amountOut?.denom))
        );
      }
    }
  }, [markets, borrow]);

  return (
    <>
      {parent === "table" ? (
        <Progress
          className={"health-progress"}
          percent={Number(percentage || 0).toFixed(DOLLAR_DECIMALS)}
          size={size ? size : "small"}
        />
      ) : (
        <>
          <Row className="mt-2">
            <Col>
              <label>{name || "Current Health Factor"}</label>
            </Col>
            <Col className="text-right">
              {Number(percentage || 0).toFixed(DOLLAR_DECIMALS)}%
            </Col>
          </Row>
          <Row className="pb-2">
            <Col>
              <Progress
                className="commodo-progress"
                percent={Number(percentage || 0).toFixed(DOLLAR_DECIMALS)}
              />
            </Col>
          </Row>
        </>
      )}
    </>
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
  name: PropTypes.string,
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
