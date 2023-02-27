import { message, Spin } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { SvgIcon } from "../../../components/common";
import { ZERO_DOLLAR_DECIMALS } from "../../../constants/common";
import { queryModuleBalance } from "../../../services/lend/query";
import { amountConversion } from "../../../utils/coin";
import { formatNumber, marketPrice } from "../../../utils/number";
import { iconNameFromDenom } from "../../../utils/string";

export const AvailableToBorrow = ({ lendPool, markets, assetDenomMap }) => {
  const [moduleBalanceStats, setModuleBalanceStats] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (lendPool?.poolId) {
      fetchModuleBalance(lendPool?.poolId);
    }
  }, [lendPool]);

  const fetchModuleBalance = (poolId) => {
    setLoading(true);
    queryModuleBalance(poolId, (error, result) => {
      if (error) {
        setLoading(false);
        message.error(error);
        return;
      }
      setLoading(false);
      setModuleBalanceStats(result?.ModuleBalance?.moduleBalanceStats);
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center w-100">
        <Spin />
      </div>
    );
  }

  return (
    <div className="header2-inner w-100">
      {moduleBalanceStats?.length > 0
        ? moduleBalanceStats.map((item, index) => {
            return (
              <>
                <div className="assets-col mr-3" key={index}>
                  <div className="assets-icon">
                    <SvgIcon name={iconNameFromDenom(item?.balance?.denom)} />
                  </div>
                  {formatNumber(
                    Number(
                      amountConversion(
                        marketPrice(
                          markets,
                          item?.balance?.denom,
                          assetDenomMap[item?.balance?.denom]?.id
                        ) * item?.balance.amount || 0,
                        assetDenomMap?.[item?.balance?.denom]?.decimals
                      )
                    ).toFixed(ZERO_DOLLAR_DECIMALS)
                  )}
                </div>
              </>
            );
          })
        : ""}
    </div>
  );
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
    markets: state.oracle.market,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

export default connect(stateToProps)(AvailableToBorrow);
