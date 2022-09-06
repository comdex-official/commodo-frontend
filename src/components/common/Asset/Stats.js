import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { decimalConversion } from "../../../utils/number";
import { Col, Row } from "../index";
import TooltipIcon from "../TooltipIcon";

const AssetStats = ({ assetId, assetRatesStatsMap, pair, pool }) => {
  return (
    <>
      <Row className="mt-2">
        <Col>
          <label>
            Max LTV{" "}
            <TooltipIcon text="The maximum borrowing power of the collateral" />
          </label>
        </Col>
        <Col className="text-right">
          {pair?.isInterPool
            ? Number(
                Number(
                  decimalConversion(
                    assetRatesStatsMap[pair?.assetIn || assetId]?.ltv
                  )
                ) *
                  Number(
                    decimalConversion(
                      assetRatesStatsMap[pool?.firstBridgedAssetId]?.ltv
                    )
                  ) *
                  100
              ).toFixed(DOLLAR_DECIMALS)
            : Number(
                decimalConversion(
                  assetRatesStatsMap[pair?.assetIn || assetId]?.ltv
                ) * 100
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
