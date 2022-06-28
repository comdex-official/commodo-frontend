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
          {decimalConversion(assetRatesStatsMap[assetId]?.uOptimal)}%
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <label>Liquidation Threshold</label>
        </Col>
        <Col className="text-right">
          {decimalConversion(assetRatesStatsMap[assetId]?.liquidationThreshold)}
          %
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <label>Liquidation Penalty</label>
        </Col>
        <Col className="text-right">
          {decimalConversion(assetRatesStatsMap[assetId]?.liquidationPenalty)}%
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <label>Current LTV</label>
        </Col>
        <Col className="text-right">
          {decimalConversion(assetRatesStatsMap[assetId]?.ltv)}%
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
