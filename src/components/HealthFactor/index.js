import { message } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { assetTransitTypeId } from "../../config/network";
import { DOLLAR_DECIMALS } from "../../constants/common";
import { queryLendPair, queryLendPool } from "../../services/lend/query";
import { decimalConversion, marketPrice } from "../../utils/number";
import { ucDenomToDenom } from "../../utils/string";

const HealthFactor = ({
  parent,
  borrow,
  assetRatesStatsMap,
  markets,
  assetMap,
  pair,
  inAmount,
  outAmount,
  pool,
  assetDenomMap,
  eMod,
}) => {
  console.log(
    (Number(inAmount) *
      marketPrice(markets, assetMap[pair?.assetIn]?.denom, pair?.assetIn) *
      (pair?.isInterPool
        ? Number(
            decimalConversion(
              assetRatesStatsMap[pair?.assetIn]?.liquidationThreshold
            )
          ) *
          Number(
            decimalConversion(
              assetRatesStatsMap[pool?.transitAssetIds?.first]
                ?.liquidationThreshold
            )
          )
        : Number(
            decimalConversion(
              assetRatesStatsMap[pair?.assetIn]?.liquidationThreshold
            )
          ))) /
      (Number(outAmount) *
        marketPrice(markets, assetMap[pair?.assetOut]?.denom, pair?.assetOut))
  );
  const [percentage, setPercentage] = useState(0);
  useEffect(() => {
    if (borrow?.borrowingId && !pair?.id) {
      queryLendPair(borrow?.pairId, (error, pairResult) => {
        if (error) {
          message.error(error);
          return;
        }

        const lendPair = pairResult?.ExtendedPair;

        queryLendPool(lendPair?.assetOutPoolId, (error, result) => {
          if (error) {
            message.error(error);
            return;
          }

          let myPool = result?.pool;
          const assetTransitMap = myPool?.assetData?.reduce((map, obj) => {
            map[obj?.assetTransitType] = obj;
            return map;
          }, {});

          let transitAssetIds = {
            main: assetTransitMap[assetTransitTypeId["main"]]?.assetId,
            first: assetTransitMap[assetTransitTypeId["first"]]?.assetId,
            second: assetTransitMap[assetTransitTypeId["second"]]?.assetId,
          };

          myPool["transitAssetIds"] = transitAssetIds;

          let percentage = eMod
            ? (borrow?.amountIn?.amount *
                marketPrice(
                  markets,
                  ucDenomToDenom(borrow?.amountIn?.denom),
                  lendPair?.assetIn
                ) *
                (lendPair?.isInterPool
                  ? Number(
                      decimalConversion(
                        assetRatesStatsMap[lendPair?.assetIn]
                          ?.eLiquidationThreshold
                      )
                    ) *
                    Number(
                      decimalConversion(
                        assetRatesStatsMap[myPool?.transitAssetIds?.first]
                          ?.eLiquidationThreshold
                      )
                    )
                  : Number(
                      decimalConversion(
                        assetRatesStatsMap[lendPair?.assetIn]
                          ?.eLiquidationThreshold
                      )
                    ))) /
              (borrow?.amountOut?.amount *
                marketPrice(
                  markets,
                  borrow?.amountOut?.denom,
                  lendPair?.assetOut
                ))
            : (borrow?.amountIn?.amount *
                marketPrice(
                  markets,
                  ucDenomToDenom(borrow?.amountIn?.denom),
                  lendPair?.assetIn
                ) *
                (lendPair?.isInterPool
                  ? Number(
                      decimalConversion(
                        assetRatesStatsMap[lendPair?.assetIn]
                          ?.liquidationThreshold
                      )
                    ) *
                    Number(
                      decimalConversion(
                        assetRatesStatsMap[myPool?.transitAssetIds?.first]
                          ?.liquidationThreshold
                      )
                    )
                  : Number(
                      decimalConversion(
                        assetRatesStatsMap[lendPair?.assetIn]
                          ?.liquidationThreshold
                      )
                    ))) /
              (borrow?.amountOut?.amount *
                marketPrice(
                  markets,
                  borrow?.amountOut?.denom,
                  lendPair?.assetOut
                ));

          if (isFinite(percentage)) {
            setPercentage(percentage);
          }
        });
      });
    }
  }, [markets, borrow, assetRatesStatsMap, assetDenomMap, eMod]);

  useEffect(() => {
    if (pair?.id && Number(inAmount) && Number(outAmount)) {
      let percentage = eMod
        ? (Number(inAmount) *
            marketPrice(
              markets,
              assetMap[pair?.assetIn]?.denom,
              pair?.assetIn
            ) *
            (pair?.isInterPool
              ? Number(
                  decimalConversion(
                    assetRatesStatsMap[pair?.assetIn]?.eLiquidationThreshold
                  )
                ) *
                Number(
                  decimalConversion(
                    assetRatesStatsMap[pool?.transitAssetIds?.first]
                      ?.eLiquidationThreshold
                  )
                )
              : Number(
                  decimalConversion(
                    assetRatesStatsMap[pair?.assetIn]?.eLiquidationThreshold
                  )
                ))) /
          (Number(outAmount) *
            marketPrice(
              markets,
              assetMap[pair?.assetOut]?.denom,
              pair?.assetOut
            ))
        : (Number(inAmount) *
            marketPrice(
              markets,
              assetMap[pair?.assetIn]?.denom,
              pair?.assetIn
            ) *
            (pair?.isInterPool
              ? Number(
                  decimalConversion(
                    assetRatesStatsMap[pair?.assetIn]?.liquidationThreshold
                  )
                ) *
                Number(
                  decimalConversion(
                    assetRatesStatsMap[pool?.transitAssetIds?.first]
                      ?.liquidationThreshold
                  )
                )
              : Number(
                  decimalConversion(
                    assetRatesStatsMap[pair?.assetIn]?.liquidationThreshold
                  )
                ))) /
          (Number(outAmount) *
            marketPrice(
              markets,
              assetMap[pair?.assetOut]?.denom,
              pair?.assetOut
            ));
      if (isFinite(percentage)) {
        setPercentage(percentage);
      }
    }
  }, [markets, pair, inAmount, outAmount, pool, eMod]);

  return (
    <>
      {parent === "table" ? (
        <b>{Number(percentage || 0).toFixed(DOLLAR_DECIMALS)}</b>
      ) : (
        <>
          <div>{Number(percentage || 0).toFixed(DOLLAR_DECIMALS)}</div>
          <small className="font-weight-light">
            {"Liquidation at H.F<1.0"}
          </small>
        </>
      )}
    </>
  );
};

HealthFactor.propTypes = {
  assetMap: PropTypes.object,
  assetRatesStatsMap: PropTypes.object,
  assetDenomMap: PropTypes.object,
  borrow: PropTypes.object,
  inAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  markets: PropTypes.object,
  pair: PropTypes.object,
  parent: PropTypes.string,
  pool: PropTypes.shape({
    poolId: PropTypes.shape({
      low: PropTypes.number,
    }),
    firstBridgedAssetId: PropTypes.shape({
      low: PropTypes.number,
    }),
  }),
  outAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const stateToProps = (state) => {
  return {
    assetRatesStatsMap: state.lend.assetRatesStats.map,
    markets: state.oracle.market,
    assetMap: state.asset._.map,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

export default connect(stateToProps)(HealthFactor);
