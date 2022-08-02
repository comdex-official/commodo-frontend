import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { decimalConversion } from "../../../utils/number";
import { Col, Row } from "../index";

const AssetStats = ({ assetId, assetRatesStatsMap, pair, pool }) => {
  return (
    <>
      <Row className="mt-2">
        <Col>
          <label>Max LTV</label>
        </Col>
        <Col className="text-right">
          {pair?.isInterPool
            ? Number(
                Number(
                  decimalConversion(assetRatesStatsMap[pair?.assetIn]?.ltv)
                ) *
                  Number(
                    decimalConversion(
                      assetRatesStatsMap[pool?.firstBridgedAssetId]?.ltv
                    )
                  ) *
                  100
              ).toFixed(DOLLAR_DECIMALS)
            : Number(
                decimalConversion(assetRatesStatsMap[pair?.assetIn]?.ltv) * 100
              ).toFixed(DOLLAR_DECIMALS)}
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <label>Liquidation Threshold</label>
        </Col>
        <Col className="text-right">
          {Number(
            decimalConversion(
              assetRatesStatsMap[assetId]?.liquidationThreshold
            ) * 100
          ).toFixed(DOLLAR_DECIMALS)}
          %
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <label>Liquidation Penalty</label>
        </Col>
        <Col className="text-right">
          {Number(
            decimalConversion(assetRatesStatsMap[assetId]?.liquidationPenalty) *
              100
          ).toFixed(DOLLAR_DECIMALS)}
          %
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <label>Liquidation Bonus</label>
        </Col>
        <Col className="text-right">
          {Number(
            decimalConversion(assetRatesStatsMap[assetId]?.liquidationBonus) *
              100
          ).toFixed(DOLLAR_DECIMALS)}
          %
        </Col>
      </Row>
    </>
  );
};

AssetStats.propTypes = {
  assetId: PropTypes.shape({
    low: PropTypes.number,
  }),
  assetRatesStatsMap: PropTypes.object,
  pair: PropTypes.shape({
    id: PropTypes.shape({
      low: PropTypes.number,
    }),
    assetIn: PropTypes.shape({
      low: PropTypes.number,
    }),
    amountOut: PropTypes.shape({
      low: PropTypes.number,
    }),
  }),
  pool: PropTypes.shape({
    poolId: PropTypes.shape({
      low: PropTypes.number,
    }),
    firstBridgedAssetId: PropTypes.shape({
      low: PropTypes.number,
    }),
    secondBridgedAssetId: PropTypes.shape({
      low: PropTypes.number,
    }),
  }),
};

const stateToProps = (state) => {
  return {
    assetRatesStatsMap: state.lend.assetRatesStats.map,
  };
};

export default connect(stateToProps)(AssetStats);
