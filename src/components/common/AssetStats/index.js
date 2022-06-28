import { Col, Row } from "../index";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { decimalConversion } from "../../../utils/number";

const AssetStats = ({ assetId, assetRatesStatsMap }) => {
  return (
    <>
      <Row className="mt-2">
        <Col>
          <label>Max LTV</label>
        </Col>
        <Col className="text-right">
          {Number(decimalConversion(assetRatesStatsMap[assetId]?.uOptimal)) *
            100}
          %
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <label>Liquidation Threshold</label>
        </Col>
        <Col className="text-right">
          {Number(
            decimalConversion(assetRatesStatsMap[assetId]?.liquidationThreshold)
          ) * 100}
          %
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <label>Liquidation Penalty</label>
        </Col>
        <Col className="text-right">
          {Number(
            decimalConversion(assetRatesStatsMap[assetId]?.liquidationPenalty)
          ) * 100}
          %
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <label>Current LTV</label>
        </Col>
        <Col className="text-right">
          {Number(decimalConversion(assetRatesStatsMap[assetId]?.ltv)) * 100}%
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
};

const stateToProps = (state) => {
  return {
    assetRatesStatsMap: state.lend.assetRatesStats.map,
  };
};

export default connect(stateToProps)(AssetStats);
