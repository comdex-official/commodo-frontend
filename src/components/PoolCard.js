import * as PropTypes from "prop-types";
import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import variables from "../utils/variables";
import { amountConversionWithComma, denomConversion } from "../utils/coin";
import { SvgIcon } from "./common";
import { connect, useDispatch } from "react-redux";
import { iconNameFromDenom } from "../utils/string";
import { marketPrice } from "../utils/number";
import { setFetchBalanceInProgress } from "../actions/liquidity";
import { queryAllBalances } from "../services/bank/query";
import { comdex } from "../config/network";

const PoolCard = ({ lang, pool, markets, poolIndex }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [poolBalance, setBalance] = useState(0);

  useEffect(() => {
    fetchPoolBalance(pool?.reserveAccountAddress);
  }, []);

  const fetchPoolBalance = (address) => {
    setFetchBalanceInProgress(true);
    queryAllBalances(address, (error, result) => {
      setFetchBalanceInProgress(false);

      if (error) {
        return;
      }
      setBalance(result.balances);
    });
  };

  const calculatePoolLiquidity = (poolBalance) => {
    if (poolBalance && poolBalance.length > 0) {
      const firstAsset =
        (poolBalance &&
          poolBalance.length > 0 &&
          poolBalance[0] &&
          poolBalance[0].amount &&
          Number(poolBalance[0].amount)) *
        marketPrice(markets, poolBalance[0] && poolBalance[0].denom);
      const secondAsset =
        (poolBalance &&
          poolBalance.length > 0 &&
          poolBalance[1] &&
          poolBalance[1].amount &&
          Number(poolBalance[1].amount)) *
        marketPrice(markets, poolBalance[1] && poolBalance[1].denom);

      const total = firstAsset + secondAsset;

      dispatch({
        type: "POOLS_LIQUIDITY_LIST_SET",
        value: total,
        index: poolIndex,
      });

      return total;
    } else return 0;
  };

  const TotalPoolLiquidity =
    calculatePoolLiquidity(poolBalance) &&
    amountConversionWithComma(calculatePoolLiquidity(poolBalance), 2);
  const handleRouteChange = () => {
    dispatch({
      type: "OFFER_COIN_DENOM_SET",
      value: comdex.coinMinimalDenom, // setting default value as a native token
    });

    dispatch({
      type: "DEMAND_COIN_DENOM_SET",
      value:
        pool?.reserveCoinDenoms[0] === comdex.coinMinimalDenom
          ? pool?.reserveCoinDenoms[1]
          : pool?.reserveCoinDenoms[0],
    });
    navigate({
      pathname: `/swap`,
      hash: "buy",
    });
  };

  const cAssetDenom =
    pool?.reserveCoinDenoms[0] !== comdex.coinMinimalDenom
      ? pool?.reserveCoinDenoms[0]
      : pool?.reserveCoinDenoms[1];

  return (
    <div className="dashboard-bottom-card-border">
      <div
        className="dashboard-card"
        onClick={() => handleRouteChange(pool.id && pool.id.toNumber())}
      >
        <div className="dashboard-card-inner">
          <div className="card-upper">
            <h3>{cAssetDenom && denomConversion(cAssetDenom)}</h3>

            <div className="card-svg-icon-container">
              <div className="card-svgicon card-svgicon-1">
                <div className="card-svgicon-inner">
                  <SvgIcon name="comdex-icon" viewBox="0 0 23.515 31" />{" "}
                </div>
              </div>
              <div className="card-svgicon  card-svgicon-2">
                <div className="card-svgicon-inner">
                  <SvgIcon name={iconNameFromDenom(cAssetDenom)} />{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="card-bottom">
            <div className="cardbottom-row">
              <label>{variables[lang].poolLiquidity}</label>
              <p>{`$${TotalPoolLiquidity}`}</p>
            </div>
            <div className="cardbottom-row">
              <label>{variables[lang].apr}</label>
              <p>-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PoolCard.propTypes = {
  lang: PropTypes.string,
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.shape({
        high: PropTypes.number,
        low: PropTypes.number,
        unsigned: PropTypes.bool,
      }),
      symbol: PropTypes.string,
      script_id: PropTypes.string,
    })
  ),
  pool: PropTypes.shape({
    id: PropTypes.shape({
      high: PropTypes.number,
      low: PropTypes.number,
      unsigned: PropTypes.bool,
    }),
    reserveAccountAddress: PropTypes.string,
    poolCoinDenom: PropTypes.string,
    reserveCoinDenoms: PropTypes.array,
  }),
  poolIndex: PropTypes.number,
};

const stateToProps = (state) => {
  return {
    markets: state.oracle.market.list,
  };
};

export default connect(stateToProps)(PoolCard);
