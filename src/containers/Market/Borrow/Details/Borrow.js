import { Button, message, Select, Slider, Spin } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  Col,
  NoDataIcon,
  Row,
  SvgIcon,
  TooltipIcon,
} from "../../../../components/common";
import CollateralAndBorrowDetails from "../../../../components/common/Asset/CollateralAndBorrowDetails";
import CustomRow from "../../../../components/common/Asset/CustomRow";
import Details from "../../../../components/common/Asset/Details";
import Snack from "../../../../components/common/Snack";
import CustomInput from "../../../../components/CustomInput";
import HealthFactor from "../../../../components/HealthFactor";
import { assetTransitTypeId } from "../../../../config/network";
import {
  ValidateInputNumber,
  ValidateMaxBorrow,
} from "../../../../config/_validation";
import {
  DOLLAR_DECIMALS,
  MAX_LTV_DEDUCTION,
  UC_DENOM,
} from "../../../../constants/common";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import {
  queryAssetPairs,
  queryLendPair,
  queryLendPool,
  queryModuleBalance,
} from "../../../../services/lend/query";
import { defaultFee } from "../../../../services/transaction";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
} from "../../../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  marketPrice,
} from "../../../../utils/number";
import {
  errorMessageMappingParser,
  iconNameFromDenom,
  toDecimals,
} from "../../../../utils/string";
import variables from "../../../../utils/variables";
import AssetApy from "../../AssetApy";
import "./index.less";

const { Option } = Select;

const BorrowTab = ({
  lang,
  dataInProgress,
  pool,
  assetMap,
  address,
  markets,
  poolLendPositions,
  assetRatesStatsMap,
  assetDenomMap,
  assetStatMap,
  pairIdToBorrowMap,
}) => {
  const [assetList, setAssetList] = useState();
  const [lend, setLend] = useState();
  const [pair, setPair] = useState();
  const [inAmount, setInAmount] = useState();
  const [outAmount, setOutAmount] = useState();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [newBalance, setNewBalance] = useState(0);
  const [validationError, setValidationError] = useState();
  const [borrowValidationError, setBorrowValidationError] = useState();
  const [maxBorrowValidationError, setMaxBorrowValidationError] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [extendedPairs, setExtendedPairs] = useState({});
  const [assetToPool, setAssetToPool] = useState({});
  const [selectedBorrowValue, setSelectedBorrowValue] = useState();
  const [assetOutPool, setAssetOutPool] = useState();
  const [moduleBalanceStats, setModuleBalanceStats] = useState([]);
  const [available, setAvailable] = useState([]);
  const [selectedCollateralLendingId, setSelectedCollateralLendingId] =
    useState();

  const { state } = useLocation();
  const lendingIdFromRoute = state?.lendingIdFromRoute;
  const pairIdFromRoute = state?.pairIdFromRoute;
  const borrowAssetMinimalDenomFromRoute =
    state?.borrowAssetMinimalDenomFromRoute;

  const navigate = useNavigate();

  let collateralAssetDenom = assetMap[lend?.assetId]?.denom;
  let borrowAssetDenom = selectedBorrowValue
    ? assetMap[pair?.assetOut]?.denom
    : "";
  console.log(extendedPairs);
  const availableBalance = lend?.availableToBorrow || 0;

  const borrowable = getAmount(
    (Number(inAmount) *
      marketPrice(
        markets,
        collateralAssetDenom,
        assetDenomMap[collateralAssetDenom]?.id
      ) *
      (pair?.isInterPool
        ? (Number(decimalConversion(assetRatesStatsMap[lend?.assetId]?.ltv)) -
            MAX_LTV_DEDUCTION) *
          Number(
            decimalConversion(
              assetRatesStatsMap[pool?.transitAssetIds?.first]?.ltv
            )
          )
        : Number(
            decimalConversion(assetRatesStatsMap[lend?.assetId]?.ltv) -
              MAX_LTV_DEDUCTION
          )) || 0) /
      marketPrice(
        markets,
        borrowAssetDenom,
        assetDenomMap[borrowAssetDenom]?.id
      )
  );

  useEffect(() => {
    if (assetOutPool?.poolId || pool?.poolId) {
      let poolId = assetOutPool?.poolId || pool?.poolId;
      queryModuleBalance(poolId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        setModuleBalanceStats(result?.ModuleBalance?.moduleBalanceStats);
      });
    }
  }, [assetOutPool?.poolId || pool?.poolId]);

  useEffect(() => {
    console.log("moduleBalanceStats1", moduleBalanceStats);
    let assetStats = moduleBalanceStats?.filter(
      (item) => Number(item?.assetId) === Number(pair?.assetOut)
    )[0];

    const available = Number(
      amountConversion(
        assetStats?.balance.amount || 0,
        assetDenomMap[assetStats?.balance?.denom]?.decimals
      )
    );
    console.log(available, "available");
    setAvailable(available - Number((available * 0.5) / 100));
  }, [moduleBalanceStats, pair?.assetOut]);

  const borrowableBalance = Number(borrowable) - 1000;

  useEffect(() => {
    if (assetOutPool?.poolId && selectedBorrowValue) {
      setAssetList([
        assetMap[assetOutPool?.transitAssetIds?.main?.toNumber()],
        assetMap[assetOutPool?.transitAssetIds?.first?.toNumber()],
        assetMap[assetOutPool?.transitAssetIds?.second?.toNumber()],
      ]);
    } else if (pool?.poolId && !assetOutPool?.poolId && !selectedBorrowValue) {
      setAssetList([
        assetMap[pool?.transitAssetIds?.main?.toNumber()],
        assetMap[pool?.transitAssetIds?.first?.toNumber()],
        assetMap[pool?.transitAssetIds?.second?.toNumber()],
      ]);
    }
  }, [pool, assetOutPool]);

  useEffect(() => {
    if (
      pair?.assetOutPoolId &&
      pair?.assetOutPoolId?.toNumber() !== pool?.poolId?.toNumber()
    ) {
      queryLendPool(pair?.assetOutPoolId, (error, poolResult) => {
        if (error) {
          message.error(error);
          return;
        }

        let myPool = poolResult?.pool;
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

        setAssetOutPool(myPool);
      });
    }
  }, [pair]);

  useEffect(() => {
    let lendId =
      lendingIdFromRoute || poolLendPositions[0]?.lendingId?.toNumber();

    if (lendId) {
      handleCollateralAssetChange(lendId, true);
    }
  }, [poolLendPositions, lendingIdFromRoute]);

  useEffect(() => {
    if (
      borrowAssetMinimalDenomFromRoute &&
      extendedPairs &&
      Object.values(extendedPairs)?.length
    ) {
      handleBorrowAssetChange(borrowAssetMinimalDenomFromRoute);
    }
  }, [borrowAssetMinimalDenomFromRoute, extendedPairs]);

  useEffect(() => {
    if (pairIdFromRoute) {
      fetchPair(pairIdFromRoute);
    }
  }, [pairIdFromRoute]);

  useEffect(() => {
    if (pair?.id && Number(pairIdToBorrowMap[pair?.id]?.amountOut.amount)) {
      setCurrentBalance(
        Number(
          amountConversion(pairIdToBorrowMap[pair?.id]?.amountOut.amount)
        ) || 0
      );
      setNewBalance(0);
    } else {
      setCurrentBalance(0);
      setNewBalance(0);
    }
  }, [pair, pairIdToBorrowMap]);

  const handleCollateralAssetChange = (lendingId, fromRoute) => {
    setSelectedCollateralLendingId(lendingId);
    if (!fromRoute) {
      setSelectedBorrowValue();
    }
    setPair();
    setAssetToPool({});
    setAssetOutPool();
    const selectedLend = poolLendPositions.filter(
      (item) => item?.lendingId?.toNumber() === lendingId
    )[0];

    if (selectedLend?.assetId) {
      setLend(selectedLend);
      setInAmount(0);
      setOutAmount(0);
      setValidationError();
      setExtendedPairs();

      queryAssetPairs(
        selectedLend?.assetId,
        selectedLend?.poolId,
        (error, result) => {
          if (error) {
            message.error(error);
            return;
          }

          let pairMapping = result?.AssetToPairMapping;

          console.log(pairMapping);

          if (pairMapping?.assetId) {
            for (let i = 0; i < pairMapping?.pairId?.length; i++) {
              fetchPair(pairMapping?.pairId[i]);
            }
          }

          if (fromRoute && borrowAssetMinimalDenomFromRoute)
            handleBorrowAssetChange(borrowAssetMinimalDenomFromRoute);
        }
      );
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
    setSelectedBorrowValue(value);
    const selectedPair =
      extendedPairs &&
      Object.values(extendedPairs)?.filter(
        (item) => assetMap[item?.assetOut]?.denom === value
      )[0];

    setPair(selectedPair);
    setOutAmount(0);
    setBorrowValidationError();
    setMaxBorrowValidationError();
  };

  const handleInAmountChange = (value) => {
    value = toDecimals(value, assetDenomMap[collateralAssetDenom]?.decimals)
      .toString()
      .trim();

    setInAmount(value);
    setOutAmount(0);
    setMaxBorrowValidationError();
    setValidationError(
      ValidateInputNumber(
        getAmount(value),
        availableBalance,
        assetDenomMap[collateralAssetDenom]?.decimals
      )
    );
  };

  const handleOutAmountChange = (value) => {
    value = toDecimals(String(value), assetDenomMap[borrowAssetDenom]?.decimals)
      .toString()
      .trim();

    setOutAmount(value);
    setNewBalance(
      Number(value) +
        Number(amountConversion(pairIdToBorrowMap[pair?.id]?.amountOut.amount))
    );
    checkMaxBorrow(value);
    setBorrowValidationError(
      ValidateInputNumber(
        value,
        Number(
          amountConversion(
            borrowableBalance,
            assetDenomMap[borrowAssetDenom]?.decimals
          )
        ) > Number(available)
          ? available
          : amountConversion(
              borrowableBalance,
              assetDenomMap[borrowAssetDenom]?.decimals
            ),
        "dollar",
        Number(
          value *
            marketPrice(
              markets,
              borrowAssetDenom,
              assetDenomMap[borrowAssetDenom]?.id
            ) || 0
        )
      )
    );
  };

  const checkMaxBorrow = (value) => {
    setMaxBorrowValidationError(
      ValidateMaxBorrow(
        value *
          marketPrice(
            markets,
            borrowAssetDenom,
            assetDenomMap[borrowAssetDenom]?.id
          ),
        Number(
          amountConversion(
            marketPrice(
              markets,
              borrowAssetDenom,
              assetDenomMap[borrowAssetDenom]?.id
            ) * assetStatMap[assetDenomMap[borrowAssetDenom]?.id]?.amount || 0,
            assetDenomMap[borrowAssetDenom]?.decimals
          )
        ),
        "maxBorrow"
      )
    );
  };
  const handleClick = () => {
    setInProgress(true);

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.lend.v1beta1.MsgBorrow",
          value: {
            borrower: address,
            lendId: lend?.lendingId,
            pairId: pair?.id,
            isStableBorrow: false,
            amountIn: {
              amount: getAmount(inAmount, assetMap[lend?.assetId]?.decimals),
              // Sending uc + denom as per message
              denom: UC_DENOM.concat(
                String(assetMap[lend?.assetId]?.name).toLocaleLowerCase()
              ),
            },
            amountOut: {
              amount: getAmount(
                outAmount,
                assetDenomMap[borrowAssetDenom]?.decimals
              ),
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
        setOutAmount(0);
        if (error) {
          message.error(error);
          return;
        }

        if (result?.code) {
          message.info(errorMessageMappingParser(result?.rawLog));
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
    return handleInAmountChange(
      amountConversion(
        availableBalance,
        assetDenomMap[collateralAssetDenom]?.decimals
      )
    );
  };

  const handleBorrowMaxClick = () => {
    if (borrowableBalance > 0) {
      return handleOutAmountChange(
        Number(
          amountConversion(
            borrowableBalance,
            assetDenomMap[borrowAssetDenom]?.decimals
          )
        ) > Number(available)
          ? available
          : amountConversion(
              borrowableBalance,
              assetDenomMap[borrowAssetDenom]?.decimals
            )
      );
    }
  };

  const filtered =
    extendedPairs &&
    (process.env.REACT_APP_D_POOL === "open"
      ? Object.fromEntries(
          Object.entries(extendedPairs).filter(([key, value]) => {
            return Number(value?.assetOutPoolId) !== 1;
          })
        )
      : extendedPairs);

  const borrowList =
    filtered &&
    Object.values(filtered)?.map((item) => assetMap[item?.assetOut]?.denom);

  let currentLTV = Number(
    ((outAmount *
      marketPrice(
        markets,
        borrowAssetDenom,
        assetDenomMap[borrowAssetDenom]?.id
      )) /
      (inAmount *
        marketPrice(
          markets,
          collateralAssetDenom,
          assetDenomMap[collateralAssetDenom]?.id
        ))) *
      100
  );

  let maxLTV = pair?.isInterPool
    ? Number(
        Number(decimalConversion(assetRatesStatsMap[pair?.assetIn]?.ltv)) *
          Number(
            decimalConversion(
              assetRatesStatsMap[pool?.transitAssetIds?.first]?.ltv
            )
          ) *
          100
      ).toFixed(DOLLAR_DECIMALS)
    : Number(
        decimalConversion(assetRatesStatsMap[pair?.assetIn]?.ltv) * 100
      ).toFixed(DOLLAR_DECIMALS);

  console.log(poolLendPositions);

  const handleSliderChange = (sliderValue) => {
    let value = (sliderValue / 100) * maxLTV;

    if (value >= Number(maxLTV)) {
      return handleBorrowMaxClick();
    }

    let outValue =
      (value *
        Number(
          inAmount *
            marketPrice(
              markets,
              collateralAssetDenom,
              assetDenomMap[collateralAssetDenom]?.id
            )
        )) /
      marketPrice(
        markets,
        borrowAssetDenom,
        assetDenomMap[borrowAssetDenom]?.id
      ) /
      100;
    console.log("sssss", outValue);

    let borrowValue = toDecimals(
      String(outValue),
      assetDenomMap[borrowAssetDenom]?.decimals
    )
      .toString()
      .trim();

    console.log({ borrowValue });
    setOutAmount(borrowValue || 0);
    setNewBalance(Number(borrowValue || 0) + currentBalance);
    checkMaxBorrow(borrowValue || 0);
  };

  const marks = {
    0: " ",
    80: "Safe",
    100: "Riskier",
  };

  console.log({ pair });

  return (
    <div className="details-wrapper market-details-wrapper">
      {!dataInProgress ? (
        <>
          <div className="details-left commodo-card commodo-borrow-page">
            <CustomRow
              assetList={assetList}
              poolId={assetOutPool?.poolId?.low || pool?.poolId?.low}
            />
            <div className="assets-select-card mb-3">
              <div className="assets-left">
                <label className="left-label">Collateral Asset</label>
                <div className="assets-select-wrapper">
                  <Select
                    className="assets-select"
                    popupClassName="asset-select-dropdown"
                    value={selectedCollateralLendingId}
                    onChange={handleCollateralAssetChange}
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
                    notFoundContent={<NoDataIcon />}
                  >
                    {poolLendPositions?.length > 0 &&
                      poolLendPositions?.map((record) => {
                        const item = record?.amountIn?.denom
                          ? record?.amountIn.denom
                          : record;

                        return (
                          <Option
                            key={record?.lendingId?.toNumber()}
                            value={record?.lendingId?.toNumber()}
                          >
                            <div className="select-inner">
                              <div className="svg-icon">
                                <div className="svg-icon-inner">
                                  <SvgIcon name={iconNameFromDenom(item)} />
                                </div>
                              </div>
                              <div className="name">
                                {denomConversion(item)} (
                                {"cPool-" + record?.cpoolName?.split("-")?.[0]})
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
                    {amountConversionWithComma(
                      availableBalance,
                      assetDenomMap[collateralAssetDenom]?.decimals
                    )}{" "}
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
                        inAmount *
                          marketPrice(
                            markets,
                            collateralAssetDenom,
                            assetDenomMap[collateralAssetDenom]?.id
                          ) || 0
                      ).toFixed(DOLLAR_DECIMALS)
                    )}
                  </small>
                </div>
              </div>
            </div>
            <div className="assets-select-card mb-2">
              <div className="assets-left">
                <label className="left-label">Borrow Asset</label>
                <div className="assets-select-wrapper">
                  <Select
                    disabled={!collateralAssetDenom}
                    className="assets-select"
                    popupClassName="asset-select-dropdown"
                    onChange={handleBorrowAssetChange}
                    value={
                      borrowList?.length && borrowAssetDenom
                        ? selectedBorrowValue
                        : null
                    }
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
                    notFoundContent={<NoDataIcon />}
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
                                {iconNameFromDenom(item) ? (
                                  <>
                                    {denomConversion(item)} (
                                    {"cPool-" +
                                      assetToPool[item]?.cpoolName?.split(
                                        "-"
                                      )?.[0]}
                                    )
                                  </>
                                ) : (
                                  ""
                                )}
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
                      {Number(
                        amountConversion(
                          borrowableBalance >= 0 ? borrowableBalance : 0,
                          assetDenomMap[borrowAssetDenom]?.decimals
                        )
                      ) > Number(available)
                        ? available
                        : amountConversionWithComma(
                            borrowableBalance >= 0 ? borrowableBalance : 0,
                            assetDenomMap[borrowAssetDenom]?.decimals
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
                      validationError={
                        borrowValidationError?.message
                          ? borrowValidationError
                          : maxBorrowValidationError
                      }
                    />{" "}
                  </div>
                  <small>
                    $
                    {commaSeparator(
                      Number(
                        outAmount *
                          marketPrice(
                            markets,
                            borrowAssetDenom,
                            assetDenomMap[borrowAssetDenom]?.id
                          ) || 0
                      ).toFixed(DOLLAR_DECIMALS)
                    )}
                  </small>{" "}
                </div>
              </div>
            </div>
            <Row>
              <Col sm="12" className="mx-auto card-bottom-details">
                <Row className="mt-2">
                  <Col sm="12">
                    <Slider
                      marks={marks}
                      value={(currentLTV * 100) / maxLTV}
                      onChange={handleSliderChange}
                      tooltip={{ open: false }}
                      className="commodo-slider market-slider borrow-slider"
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col></Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <label>Health Factor</label>
                    <TooltipIcon text="Numeric representation of your position's safety" />
                  </Col>
                  <Col className="text-right mt-2 health-factor-right">
                    <HealthFactor
                      eMod={pair?.isEModeEnabled}
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
                    <label>Borrow APY</label>
                    <TooltipIcon text={"Borrow APY of Asset"} />
                  </Col>
                  <Col className="text-right">
                    <AssetApy poolId={pool?.poolId} assetId={pair?.assetOut} />
                  </Col>
                </Row>
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
                  maxBorrowValidationError?.message ||
                  inProgress ||
                  !lend?.lendingId ||
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
                assetId={pair?.assetOut?.toNumber()}
                assetDenom={borrowAssetDenom}
                poolId={assetOutPool?.poolId || pool?.poolId}
                parent="borrow"
              />
            </div>
            <div className="commodo-card">
              <CollateralAndBorrowDetails
                eMod={pair?.isEModeEnabled}
                interAssetID={pool?.transitAssetIds?.first}
                isInterPool={pair?.isInterPool}
                lendAssetId={lend?.assetId || pair?.assetIn}
                collateralAssetDenom={collateralAssetDenom}
                borrowAssetDenom={borrowAssetDenom}
                poolId={assetOutPool?.poolId || pool?.poolId}
                parent="borrow"
                newBalance={
                  newBalance *
                  marketPrice(
                    markets,
                    borrowAssetDenom,
                    assetDenomMap[borrowAssetDenom]?.id
                  )
                }
                currentBalance={
                  currentBalance *
                  marketPrice(
                    markets,
                    borrowAssetDenom,
                    assetDenomMap[borrowAssetDenom]?.id
                  )
                }
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
  assetDenomMap: PropTypes.object,
  pairIdToBorrowMap: PropTypes.object,
  assetStatMap: PropTypes.object,
  assetRatesStatsMap: PropTypes.object,
  markets: PropTypes.object,
  pool: PropTypes.shape({
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
  }),
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
    pool: state.lend.pool._,
    assetMap: state.asset._.map,
    lang: state.language,
    markets: state.oracle.market,
    poolLendPositions: state.lend.poolLends,
    assetRatesStatsMap: state.lend.assetRatesStats.map,
    assetDenomMap: state.asset._.assetDenomMap,
    assetStatMap: state.asset.assetStatMap,
    pairIdToBorrowMap: state.lend.pairIdToBorrowMap,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(BorrowTab);
