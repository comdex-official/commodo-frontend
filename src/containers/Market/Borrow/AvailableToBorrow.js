import { message } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import {
  queryModuleBalance
} from "../../../services/lend/query";
import { amountConversionWithComma } from "../../../utils/coin";
import { marketPrice } from "../../../utils/number";

export const AvailableToBorrow = ({ lendPool, markets, assetDenomMap }) => {
  const [moduleBalanceStats, setModuleBalanceStats] = useState({});

  useEffect(() => {
    if (lendPool?.poolId) {
      fetchModuleBalance(lendPool?.poolId);
    }
  }, [lendPool]);

  const fetchModuleBalance = (poolId) => {
    queryModuleBalance(poolId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setModuleBalanceStats(result?.ModuleBalance?.moduleBalanceStats);
    });
  };

  const showAvailableToBorrow = () => {
    const values =
      moduleBalanceStats?.length > 0
        ? moduleBalanceStats.map((item) => {
            return (
              marketPrice(markets, item?.balance?.denom, assetDenomMap[item?.balance?.denom]?.id) * item?.balance.amount
            );
          })
        : [];

    const sum = values.reduce((a, b) => a + b, 0);

    return `$${amountConversionWithComma(sum || 0, DOLLAR_DECIMALS)}`;
  };

  return <div>{showAvailableToBorrow()}</div>;
};

AvailableToBorrow.propTypes = {
  assetDenomMap: PropTypes.object,
    markets: PropTypes.object,
  lendPool: PropTypes.shape({
    mainAssetId: PropTypes.shape({
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
     markets: state.oracle.market.map,
     assetDenomMap: state.asset._.assetDenomMap,
  };
};

export default connect(stateToProps)(AvailableToBorrow);
