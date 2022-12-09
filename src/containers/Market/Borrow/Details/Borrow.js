import { Button, List, message, Select, Spin, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import {
  Col,
  NoDataIcon,
  Row,
  SvgIcon,
  TooltipIcon
} from "../../../../components/common";
import CustomRow from "../../../../components/common/Asset/CustomRow";
import Details from "../../../../components/common/Asset/Details";
import AssetStats from "../../../../components/common/Asset/Stats";
import Snack from "../../../../components/common/Snack";
import CustomInput from "../../../../components/CustomInput";
import HealthFactor from "../../../../components/HealthFactor";
import { assetTransitTypeId } from "../../../../config/network";
import { ValidateInputNumber } from "../../../../config/_validation";
import {
  DOLLAR_DECIMALS,
  MAX_LTV_DEDUCTION,
  UC_DENOM
} from "../../../../constants/common";
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
  getAmount
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
  pool,
  assetMap,
  address,
  markets,
  poolLendPositions,
  assetRatesStatsMap,
  assetDenomMap,
}) => {
  const [assetList, setAssetList] = useState();
  const [lend, setLend] = useState();
  const [pair, setPair] = useState();
  const [inAmount, setInAmount] = useState();
  const [outAmount, setOutAmount] = useState();
  const [validationError, setValidationError] = useState();
  const [borrowValidationError, setBorrowValidationError] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [extendedPairs, setExtendedPairs] = useState({});
  const [assetToPool, setAssetToPool] = useState({});
  const [selectedBorrowValue, setSelectedBorrowValue] = useState();
  const [assetOutPool, setAssetOutPool] = useState();

  const navigate = useNavigate();

  let collateralAssetDenom = assetMap[lend?.assetId]?.denom;
  let borrowAssetDenom = selectedBorrowValue
    ? assetMap[pair?.assetOut]?.denom
    : "";

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

  const handleCollateralAssetChange = (lendingId) => {
    setSelectedBorrowValue();
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

          if (pairMapping?.assetId) {
            for (let i = 0; i < pairMapping?.pairId?.length; i++) {
              fetchPair(pairMapping?.pairId[i]);
            }
          }
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
  };

  const handleInAmountChange = (value) => {
    value = toDecimals(value).toString().trim();

    setInAmount(value);
    setOutAmount(0);
    setValidationError(ValidateInputNumber(getAmount(value), availableBalance));
  };

  const handleOutAmountChange = (value) => {
    value = toDecimals(value).toString().trim();

    setOutAmount(value);
    setBorrowValidationError(
      ValidateInputNumber(
        getAmount(value),
        borrowableBalance,
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
              amount: getAmount(inAmount),
              // Sending uc + denom as per message
              denom: UC_DENOM.concat(
                String(assetMap[lend?.assetId]?.name).toLocaleLowerCase()
              ),
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
        setOutAmount(0);
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

  const borrowList =
    extendedPairs &&
    Object.values(extendedPairs)?.map(
      (item) => assetMap[item?.assetOut]?.denom
    );

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

  let data = [
    {
      title: "Threshold",
      counts: `${
        pair?.isInterPool
          ? Number(
              Number(
                decimalConversion(
                  assetRatesStatsMap[lend?.assetId]?.liquidationThreshold
                )
              ) *
                Number(
                  decimalConversion(
                    assetRatesStatsMap[pool?.transitAssetIds?.first]
                      ?.liquidationThreshold
                  )
                ) *
                100
            ).toFixed(DOLLAR_DECIMALS)
          : Number(
              decimalConversion(
                assetRatesStatsMap[lend?.assetId]?.liquidationThreshold
              ) * 100
            ).toFixed(DOLLAR_DECIMALS)
      }
      %
`,
      tooltipText:
        "The threshold at which a loan is defined as undercollateralised and subject to liquidation of collateral",
    },
    {
      title: "Penalty",
      counts: `${Number(
        decimalConversion(
          assetRatesStatsMap[lend?.assetId]?.liquidationPenalty
        ) * 100
      ).toFixed(DOLLAR_DECIMALS)}
      %`,
      tooltipText: "Fee paid by vault owners on liquidation",
    },
    {
      title: "Bonus",
      counts: `${Number(
        decimalConversion(assetRatesStatsMap[lend?.assetId]?.liquidationBonus) *
          100
      ).toFixed(DOLLAR_DECIMALS)}
      %
`,
      tooltipText: "Discount on the collateral unlocked to liquidators",
    },
  ];

  const TooltipContent = (
    <div className="token-details">
      <div className="tokencard-col">
        <div className="tokencard">
          <div className="tokencard-icon">
            <SvgIcon name={iconNameFromDenom(collateralAssetDenom)} />
          </div>
          <p>Deposit {denomConversion(collateralAssetDenom)}</p>
        </div>
        <SvgIcon
          className="token-down-arrow"
          name="tokenarrow-down"
          viewbox="0 0 9.774 45.02"
        />
        <div className="tokencard with-shadow">
          <div className="tokencard-icon">
            <SvgIcon
              name={iconNameFromDenom(
                assetMap[pool?.transitAssetIds?.first]?.denom
              )}
            />
          </div>
          <p>
            Borrow{" "}
            {denomConversion(assetMap[pool?.transitAssetIds?.first]?.denom)}
          </p>
        </div>
        <label>#{lend?.poolId?.toNumber()}</label>
      </div>
      <div className="middle-arrow">
        <SvgIcon name="token-arrow" viewbox="0 0 159 80.387" />
      </div>
      <div className="tokencard-col">
        <div className="tokencard with-shadow">
          <div className="tokencard-icon">
            <SvgIcon
              name={iconNameFromDenom(
                assetMap[pool?.transitAssetIds?.first]?.denom
              )}
            />
          </div>
          <p>
            Deposit{" "}
            {denomConversion(assetMap[pool?.transitAssetIds?.first]?.denom)}{" "}
          </p>
        </div>
        <SvgIcon
          className="token-down-arrow"
          name="tokenarrow-down"
          viewbox="0 0 9.774 45.02"
        />
        <div className="tokencard">
          <div className="tokencard-icon">
            <SvgIcon name={iconNameFromDenom(borrowAssetDenom)} />
          </div>
          <p>Borrow {denomConversion(borrowAssetDenom)}</p>
        </div>
        <label>#{pair?.assetOutPoolId?.toNumber()}</label>
      </div>
    </div>
  );

  const TooltipContent2 = (
    <div className="token-details token-details-small">
      <div className="tokencard-col">
        <div className="tokencard">
          <div className="tokencard-icon">
            <SvgIcon name={iconNameFromDenom(collateralAssetDenom)} />
          </div>
          <p>Deposit {denomConversion(collateralAssetDenom)}</p>
        </div>
        <SvgIcon
          className="token-down-arrow"
          name="tokenarrow-down"
          viewbox="0 0 9.774 45.02"
        />
        <div className="tokencard with-shadow">
          <div className="tokencard-icon">
            <SvgIcon name={iconNameFromDenom(borrowAssetDenom)} />
          </div>
          <p>Borrow {denomConversion(borrowAssetDenom)}</p>
        </div>
        <label>#{lend?.poolId?.toNumber()}</label>
      </div>
    </div>
  );

  return (
    <div className="details-wrapper">
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
            {pair?.isInterPool ? (
              <Row>
                <Col>
                  <div className="borrowbottom-cards">
                    <div className="cards">
                      <div className="cards-inner">
                        <div className="cards-colum">
                          <div className="inner-icon">
                            <SvgIcon
                              name={iconNameFromDenom(collateralAssetDenom)}
                            />
                          </div>
                          <p>{denomConversion(collateralAssetDenom)}</p>
                        </div>
                        <SvgIcon
                          className="longarrow-icon"
                          name="long-arrow"
                          viewbox="0 0 64 5.774"
                        />
                        <div className="cards-colum">
                          <div className="inner-icon">
                            <SvgIcon
                              name={iconNameFromDenom(
                                assetMap[pool?.transitAssetIds?.first]?.denom
                              )}
                            />
                          </div>
                          <p>
                            {denomConversion(
                              assetMap[pool?.transitAssetIds?.first]?.denom
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <SvgIcon
                      className="longarrow-icon-middle"
                      name="long-arrow"
                      viewbox="0 0 64 5.774"
                    />
                    <div className="cards">
                      <Tooltip
                        className="commodo-tooltip tooltip-icon"
                        placement="right"
                        color="#173629"
                        title={TooltipContent}
                        overlayClassName="token-overlay"
                      >
                        <SvgIcon className="tooltip-icon" name="info-icon" />
                      </Tooltip>
                      <div className="cards-inner">
                        <div className="cards-colum">
                          <div className="inner-icon">
                            <SvgIcon
                              name={iconNameFromDenom(
                                assetMap[pool?.transitAssetIds?.first]?.denom
                              )}
                            />
                          </div>
                          <p>
                            {denomConversion(
                              assetMap[pool?.transitAssetIds?.first]?.denom
                            )}
                          </p>
                        </div>
                        <SvgIcon
                          className="longarrow-icon"
                          name="long-arrow"
                          viewbox="0 0 64 5.774"
                        />
                        <div className="cards-colum">
                          <div className="inner-icon">
                            <SvgIcon
                              name={iconNameFromDenom(borrowAssetDenom)}
                            />
                          </div>
                          <p>{denomConversion(borrowAssetDenom)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col>
                  <div className="borrowbottom-cards justify-content-center">
                    <div className="cards">
                      <Tooltip
                        className="commodo-tooltip tooltip-icon"
                        placement="right"
                        color="#173629"
                        title={TooltipContent2}
                        overlayClassName="token-overlay token-overlay-small"
                      >
                        <SvgIcon className="tooltip-icon" name="info-icon" />
                      </Tooltip>
                      <div className="cards-inner">
                        <div className="cards-colum">
                          <div className="inner-icon">
                            <SvgIcon
                              name={iconNameFromDenom(collateralAssetDenom)}
                            />{" "}
                          </div>
                          <p>{denomConversion(collateralAssetDenom)}</p>
                        </div>
                        <SvgIcon
                          className="longarrow-icon"
                          name="long-arrow"
                          viewbox="0 0 64 5.774"
                        />
                        <div className="cards-colum">
                          <div className="inner-icon">
                            <SvgIcon
                              name={iconNameFromDenom(borrowAssetDenom)}
                            />
                          </div>
                          <p>{denomConversion(borrowAssetDenom)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            )}
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
                <AssetStats assetId={lend?.assetId} pool={pool} pair={pair} />
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
                asset={
                  assetMap[
                    assetOutPool?.transitAssetIds?.first?.toNumber() ||
                      pool?.transitAssetIds?.first?.toNumber()
                  ]
                }
                poolId={assetOutPool?.poolId || pool?.poolId}
                parent="borrow"
              />
              <div className="mt-5">
                <Details
                  asset={
                    assetMap[
                      assetOutPool?.transitAssetIds?.second?.toNumber() ||
                        pool?.transitAssetIds?.second?.toNumber()
                    ]
                  }
                  poolId={assetOutPool?.poolId || pool?.poolId}
                  parent="borrow"
                />
              </div>
            </div>
            <div className="commodo-card">
              <Details
                asset={
                  assetMap[
                    assetOutPool?.transitAssetIds?.main?.toNumber() ||
                      pool?.transitAssetIds?.main?.toNumber()
                  ]
                }
                poolId={assetOutPool?.poolId || pool?.poolId}
                parent="borrow"
              />
            </div>
            <div className="commodo-card">
              <div className="card-head">
                <div className="head-left">
                  <div className="assets-col">
                    <div className="assets-icon">
                      <SvgIcon name={iconNameFromDenom(collateralAssetDenom)} />
                    </div>
                    Collateral Asset Liquidation Params
                  </div>
                </div>
              </div>
              <List
                grid={{
                  gutter: 16,
                  xs: 2,
                  sm: 2,
                  md: 2,
                  lg: 3,
                  xl: 3,
                  xxl: 3,
                }}
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <div>
                      <p>
                        {item.title} <TooltipIcon text={item.tooltipText} />
                      </p>
                      <h3>{item.counts}</h3>
                    </div>
                  </List.Item>
                )}
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
    markets: state.oracle.market.map,
    poolLendPositions: state.lend.poolLends,
    assetRatesStatsMap: state.lend.assetRatesStats.map,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(BorrowTab);
