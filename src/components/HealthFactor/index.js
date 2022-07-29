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
  pair,
  inAmount,
  outAmount,
}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (borrow?.borrowingId) {
      let asset = Object.values(assetMap).filter(
        (item) => item.denom === borrow?.amountIn?.denom.replace("uc", "u")
      )[0];

      // TODO: update taking selected asset

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

  useEffect(() => {
    if (pair?.id && Number(inAmount) && Number(outAmount)) {
      setPercentage(
        (Number(inAmount) *
          marketPrice(markets, assetMap[pair?.assetIn]?.denom) *
          Number(
            decimalConversion(
              assetRatesStatsMap[pair?.assetIn]?.liquidationThreshold
            )
          )) /
          (Number(outAmount) *
            marketPrice(markets, assetMap[pair?.assetOut]?.denom))
      );
    }
  }, [markets, pair, inAmount, outAmount]);

  return (
    <>
      {parent === "table" ? (
        <Progress
          className={"health-progress"}
          format={(percent) => percent}
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
              {Number(percentage || 0).toFixed(DOLLAR_DECIMALS)}
            </Col>
          </Row>
          <Row className="pb-2">
            <Col>
              <Progress
                format={(percent) => percent}
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
  inAmount: PropTypes.string,
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.shape({
        low: PropTypes.number,
      }),
    })
  ),
  name: PropTypes.string,
  pair: PropTypes.object,
  parent: PropTypes.string,
  outAmount: PropTypes.string,
};

const stateToProps = (state) => {
  return {
    assetRatesStatsMap: state.lend.assetRatesStats.map,
    markets: state.oracle.market.list,
    assetMap: state.asset._.map,
  };
};

export default connect(stateToProps)(HealthFactor);
