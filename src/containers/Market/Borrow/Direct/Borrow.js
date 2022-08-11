import { Button, message, Select, Spin } from "antd";
import Long from "long";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { Col, Row, SvgIcon, TooltipIcon } from "../../../../components/common";
import Details from "../../../../components/common/Asset/Details";
import AssetStats from "../../../../components/common/Asset/Stats";
import Snack from "../../../../components/common/Snack";
import CustomInput from "../../../../components/CustomInput";
import HealthFactor from "../../../../components/HealthFactor";
import { ValidateInputNumber } from "../../../../config/_validation";
import { APP_ID, DOLLAR_DECIMALS } from "../../../../constants/common";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import {
  queryAssetPairs,
  queryLendPair,
  queryLendPool
} from "../../../../services/lend/query";
import { defaultFee } from "../../../../services/transaction";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance
} from "../../../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  marketPrice
} from "../../../../utils/number";
import { iconNameFromDenom, toDecimals } from "../../../../utils/string";
import variables from "../../../../utils/variables";
import "./index.less";

const { Option } = Select;

const BorrowTab = ({
  lang,
  dataInProgress,
  pools,
  assetMap,
  address,
  markets,
  poolLendPositions,
  balances,
  assetRatesStatsMap,
}) => {
  const [assetList, setAssetList] = useState();
  const [collateralAssetId, setCollateralAssetId] = useState();
  const [pair, setPair] = useState();
  const [inAmount, setInAmount] = useState();
  const [outAmount, setOutAmount] = useState();
  const [validationError, setValidationError] = useState();
  const [borrowValidationError, setBorrowValidationError] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [extendedPairs, setExtendedPairs] = useState({});
  const [assetToPool, setAssetToPool] = useState({});
  const [pool, setPool] = useState();
  const [outPool, setOutPool] = useState();
  const [selectedCollateralValue, setSelectedCollateralValue] = useState();
  const [selectedBorrowValue, setSelectedBorrowValue] = useState();

  const navigate = useNavigate();

  let collateralAssetDenom = assetMap[collateralAssetId]?.denom;
  let borrowAssetDenom = assetMap[pair?.assetOut]?.denom;

  const availableBalance = getDenomBalance(balances, collateralAssetDenom) || 0;

  const borrowableBalance = getAmount(
    Number(inAmount) *
      marketPrice(markets, collateralAssetDenom) *
      (pair?.isInterPool
        ? Number(
            decimalConversion(assetRatesStatsMap[collateralAssetId]?.ltv)
          ) *
          Number(
            decimalConversion(
              assetRatesStatsMap[pool?.firstBridgedAssetId]?.ltv
            )
          )
        : Number(
            decimalConversion(assetRatesStatsMap[collateralAssetId]?.ltv)
          )) || 0
  );

  const borrowList =
    extendedPairs &&
    Object.values(extendedPairs)?.map(
      (item) => assetMap[item?.assetOut]?.denom
    );

  useEffect(() => {
    if (pool?.poolId) {
      setAssetList([
        assetMap[pool?.mainAssetId?.toNumber()],
        assetMap[pool?.firstBridgedAssetId?.toNumber()],
        assetMap[pool?.secondBridgedAssetId?.toNumber()],
      ]);
    }
  }, [pool]);

  const handleCollateralAssetChange = (assetId) => {
    if (assetId) {
      setCollateralAssetId(assetId);
      setSelectedCollateralValue(assetId);
      setSelectedBorrowValue();
      setInAmount(0);
      setValidationError();
      setExtendedPairs();

      queryAssetPairs(assetId, pool?.poolId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        let pairMapping = result?.AssetToPairMapping;

        if (pairMapping?.assetId) {
          for (let i = 0; i < pairMapping?.pairId?.length; i++) {
            fetchPair(pairMapping?.pairId[i]);
          }
        }
      });
    }
  };

  const fetchPair = (id) => {
    queryLendPair(id, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      queryLendPool(
        result?.ExtendedPair?.assetOutPoolId,
        (error, poolResult) => {
          if (error) {
            message.error(error);
            return;
          }

          setAssetToPool((prevState) => ({
            [assetMap[result?.ExtendedPair?.assetOut]?.denom]: poolResult?.pool,
            ...prevState,
          }));
        }
      );

      setExtendedPairs((prevState) => ({
        [result?.ExtendedPair?.id]: result?.ExtendedPair,
        ...prevState,
      }));
    });
  };

  const handleBorrowAssetChange = (value) => {
    const selectedPair =
      extendedPairs &&
      Object.values(extendedPairs)?.filter(
        (item) => assetMap[item?.assetOut]?.denom === value
      )[0];

    setPair(selectedPair);
    setSelectedBorrowValue(value);

    let selectedPool = pools?.filter(
      (item) =>
        item?.poolId?.toNumber() === selectedPair?.assetOutPoolId?.toNumber()
    )[0];

    if (selectedPool?.poolId) {
      setOutPool(selectedPool);
    }
    setOutAmount(0);
    setBorrowValidationError();
  };

  const handlePoolChange = (value) => {
    let selectedPool = pools?.filter(
      (item) => item?.poolId?.toNumber() === value
    )[0];
    if (selectedPool?.poolId) {
      setSelectedCollateralValue();
      setSelectedBorrowValue();
      setPool(selectedPool);
    }
  };

  const handleInAmountChange = (value) => {
    value = toDecimals(value).toString().trim();

    setInAmount(value);
    setValidationError(ValidateInputNumber(getAmount(value), availableBalance));
  };

  const handleOutAmountChange = (value) => {
    value = toDecimals(value).toString().trim();

    setOutAmount(value);
    setBorrowValidationError(
      ValidateInputNumber(getAmount(value), borrowableBalance)
    );
  };

  const handleClick = () => {
    setInProgress(true);

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.lend.v1beta1.MsgBorrowAlternate",
          value: {
            lender: address,
            assetId: pair?.assetIn,
            pairId: pair?.id,
            poolId: pool?.poolId,
            isStableBorrow: false,
            appId: Long.fromNumber(APP_ID),
            amountIn: {
              amount: getAmount(inAmount),
              denom: collateralAssetDenom,
            },
            amountOut: {
              amount: getAmount(outAmount),
              denom: borrowAssetDenom,
            },
          },
        },
        fee: defaultFee(),
        memo: "",
      },
      address,
      (error, result) => {
        setInProgress(false);
        setInAmount(0);
        if (error) {
          message.error(error);
          return;
        }

        if (result?.code) {
          message.info(result?.rawLog);
          return;
        }

        message.success(
          <Snack
            message={variables[lang].tx_success}
            hash={result?.transactionHash}
          />
        );

        navigate({
          pathname: "/myhome",
          hash: "borrow",
        });
      }
    );
  };

  const handleMaxClick = () => {
    return handleInAmountChange(amountConversion(availableBalance));
  };

  const handleBorrowMaxClick = () => {
    return handleOutAmountChange(amountConversion(borrowableBalance));
  };

  let currentLTV = Number(
    ((outAmount * marketPrice(markets, borrowAssetDenom)) /
      (inAmount * marketPrice(markets, collateralAssetDenom))) *
      100
  );

  return (
    <div className="details-wrapper">
      {!dataInProgress ? (
        <>
          <div className="details-left commodo-card commodo-borrow-page">
            <div className="card-header text-left">Direct Borrow <TooltipIcon text="Lend and Borrow in one click" /></div>
            <div className="assets-select-card mb-3">
              <div className="assets-left full-with-asset">
                <label className="left-label">
                  cPool
                </label>
                <div className="assets-select-wrapper">
                  <Select
                    className="assets-select"
                    dropdownClassName="asset-select-dropdown"
                    onChange={handlePoolChange}
                    placeholder={
                      <div className="select-placeholder">
                        <div className="circle-icon">
                          <div className="circle-icon-inner" />
                        </div>
                        Select
                      </div>
                    }
                    defaultActiveFirstOption={true}
                    suffixIcon={
                      <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                    }
                  >
                    {pools?.length > 0 &&
                      pools?.map((record) => {
                        return (
                          <Option
                            key={record?.poolId?.toNumber()}
                            value={record?.poolId?.toNumber()}
                          >
                            <div className="select-inner">
                              <div className="svg-icon">
                                <div className="svg-icon-inner"></div>
                              </div>
                              <div className="name">{record?.cpoolName}</div>
                            </div>
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
            </div>
            <div className="assets-select-card mb-3">
              <div className="assets-left">
                <label className="left-label">
                  Collateral Asset
                </label>
                <div className="assets-select-wrapper">
                  <Select
                    className="assets-select"
                    dropdownClassName="asset-select-dropdown"
                    onChange={handleCollateralAssetChange}
                    value={selectedCollateralValue}
                    placeholder={
                      <div className="select-placeholder">
                        <div className="circle-icon">
                          <div className="circle-icon-inner" />
                        </div>
                        Select
                      </div>
                    }
                    defaultActiveFirstOption={true}
                    suffixIcon={
                      <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                    }
                  >
                    {assetList?.length > 0 &&
                      assetList?.map((record) => {
                        return (
                          <Option
                            key={record?.id?.toNumber()}
                            value={record?.id?.toNumber()}
                          >
                            <div className="select-inner">
                              <div className="svg-icon">
                                <div className="svg-icon-inner">
                                  <SvgIcon
                                    name={iconNameFromDenom(record?.denom)}
                                  />
                                </div>
                              </div>
                              <div className="name">
                                {denomConversion(record?.denom)}
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
              <div className="assets-right">
                <div className="label-right">
                  Available
                  <span className="ml-1">
                    {amountConversionWithComma(availableBalance)}{" "}
                    {denomConversion(collateralAssetDenom)}
                  </span>
                  <div className="max-half">
                    <Button className="active" onClick={handleMaxClick}>
                      Max
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="input-select">
                    <CustomInput
                      value={inAmount}
                      onChange={(event) =>
                        handleInAmountChange(event.target.value)
                      }
                      validationError={validationError}
                    />
                  </div>
                  <small>
                    $
                    {commaSeparator(
                      Number(
                        inAmount * marketPrice(markets, collateralAssetDenom) ||
                          0
                      ),
                      DOLLAR_DECIMALS
                    )}
                  </small>
                </div>
              </div>
            </div>
            <div className="assets-select-card mb-2">
              <div className="assets-left">
                <label className="left-label">
                  Borrow Asset
                </label>
                <div className="assets-select-wrapper">
                  <Select
                    className="assets-select"
                    dropdownClassName="asset-select-dropdown"
                    onChange={handleBorrowAssetChange}
                    value={selectedBorrowValue}
                    placeholder={
                      <div className="select-placeholder">
                        <div className="circle-icon">
                          <div className="circle-icon-inner" />
                        </div>
                        Select
                      </div>
                    }
                    defaultActiveFirstOption={true}
                    suffixIcon={
                      <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                    }
                  >
                    {borrowList?.length > 0 &&
                      borrowList?.map((record) => {
                        const item = record?.denom ? record?.denom : record;

                        return (
                          <Option key={item} value={record?.id?.toNumber()}>
                            <div className="select-inner">
                              <div className="svg-icon">
                                <div className="svg-icon-inner">
                                  <SvgIcon name={iconNameFromDenom(item)} />
                                </div>
                              </div>
                              <div className="name">
                                {denomConversion(item)} (
                                {"cPool-" +
                                  assetToPool[item]?.cpoolName?.split("-")?.[0]}
                                )
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
              <div className="assets-right">
                {borrowAssetDenom ? (
                  <div className="label-right">
                    Borrowable
                    <span className="ml-1">
                      {amountConversionWithComma(
                        borrowableBalance >= 0 ? borrowableBalance : 0
                      )}{" "}
                      {denomConversion(borrowAssetDenom)}
                    </span>
                    <div className="max-half">
                      <Button className="active" onClick={handleBorrowMaxClick}>
                        Max
                      </Button>
                    </div>
                  </div>
                ) : null}
                <div>
                  <div className="input-select">
                    <CustomInput
                      value={outAmount}
                      onChange={(event) =>
                        handleOutAmountChange(event.target.value)
                      }
                      validationError={borrowValidationError}
                    />{" "}
                  </div>
                  <small>
                    $
                    {commaSeparator(
                      Number(
                        outAmount * marketPrice(markets, borrowAssetDenom) || 0
                      ),
                      DOLLAR_DECIMALS
                    )}
                  </small>{" "}
                </div>
              </div>
            </div>
            <Row>
              <Col sm="12" className="mt-3 mx-auto card-bottom-details">
                <Row className="mt-2">
                  <Col>
                    <label>Health Factor</label>
                    <TooltipIcon text="Numeric representation of your position's safety" />
                  </Col>
                  <Col className="text-right">
                    <HealthFactor
                      name="Health Factor"
                      pair={pair}
                      inAmount={inAmount}
                      outAmount={outAmount}
                      pool={pool}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <label>Current LTV</label>
                  </Col>
                  <Col className="text-right">
                    {(isFinite(currentLTV) ? currentLTV : 0).toFixed(
                      DOLLAR_DECIMALS
                    )}
                    %
                  </Col>
                </Row>
                <AssetStats
                  assetId={collateralAssetId}
                  pool={pool}
                  pair={pair}
                />
              </Col>
            </Row>
            <div className="assets-form-btn">
              <Button
                type="primary"
                className="btn-filled"
                loading={inProgress}
                disabled={
                  !Number(inAmount) ||
                  !Number(outAmount) ||
                  validationError?.message ||
                  collateralAssetDenom === borrowAssetDenom ||
                  borrowValidationError?.message ||
                  inProgress ||
                  !collateralAssetId ||
                  !pair?.id
                }
                onClick={handleClick}
              >
                Borrow
              </Button>
            </div>
          </div>
          <div className="details-right">
            <div className="commodo-card">
              <Details
                asset={assetMap[outPool?.firstBridgedAssetId?.toNumber()]}
                poolId={outPool?.poolId}
                parent="borrow"
              />
              <div className="mt-5">
                <Details
                  asset={assetMap[outPool?.secondBridgedAssetId?.toNumber()]}
                  poolId={outPool?.poolId}
                  parent="borrow"
                />
              </div>
            </div>
            <div className="commodo-card">
              <Details
                asset={assetMap[outPool?.mainAssetId?.toNumber()]}
                poolId={outPool?.poolId}
                parent="borrow"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="loader">
          <Spin />
        </div>
      )}
    </div>
  );
};

BorrowTab.propTypes = {
  dataInProgress: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  assetMap: PropTypes.object,
  assetRatesStatsMap: PropTypes.object,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.shape({
        low: PropTypes.number,
      }),
    })
  ),
  pools: PropTypes.arrayOf(
    PropTypes.shape({
      poolId: PropTypes.shape({
        low: PropTypes.number,
      }),
      mainAssetId: PropTypes.shape({
        low: PropTypes.number,
      }),
      firstBridgedAssetId: PropTypes.shape({
        low: PropTypes.number,
      }),
      secondBridgedAssetId: PropTypes.shape({
        low: PropTypes.number,
      }),
    })
  ),
  poolLendPositions: PropTypes.arrayOf(
    PropTypes.shape({
      assetId: PropTypes.shape({
        low: PropTypes.number,
      }),
      lendingId: PropTypes.shape({
        low: PropTypes.number,
      }),
      amountIn: PropTypes.shape({
        denom: PropTypes.string,
        amount: PropTypes.string,
      }),
    })
  ),
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    pools: state.lend.pool.list,
    assetMap: state.asset._.map,
    lang: state.language,
    markets: state.oracle.market.list,
    poolLendPositions: state.lend.poolLends,
    assetRatesStatsMap: state.lend.assetRatesStats.map,
    balances: state.account.balances.list,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(BorrowTab);
