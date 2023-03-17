import { Button, List, message, Select, Spin, Tooltip } from "antd";
import Long from "long";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import {
  Col,
  NoDataIcon,
  Row,
  SvgIcon,
  TooltipIcon,
} from "../../../../components/common";
import Details from "../../../../components/common/Asset/Details";
import AssetStats from "../../../../components/common/Asset/Stats";
import Snack from "../../../../components/common/Snack";
import CustomInput from "../../../../components/CustomInput";
import HealthFactor from "../../../../components/HealthFactor";
import {
  ValidateInputNumber,
  ValidateMaxBorrow,
} from "../../../../config/_validation";
import {
  APP_ID,
  DOLLAR_DECIMALS,
  MAX_LTV_DEDUCTION,
} from "../../../../constants/common";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import {
  queryAssetPairs,
  queryLendPair,
  queryLendPool,
} from "../../../../services/lend/query";
import { defaultFee } from "../../../../services/transaction";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  marketPrice,
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
  balances,
  assetRatesStatsMap,
  assetDenomMap,
  assetStatMap,
}) => {
  const [assetList, setAssetList] = useState();
  const [collateralAssetId, setCollateralAssetId] = useState();
  const [pair, setPair] = useState();
  const [inAmount, setInAmount] = useState();
  const [outAmount, setOutAmount] = useState();
  const [validationError, setValidationError] = useState();
  const [borrowValidationError, setBorrowValidationError] = useState();
  const [maxBorrowValidationError, setMaxBorrowValidationError] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [extendedPairs, setExtendedPairs] = useState({});
  const [assetToPool, setAssetToPool] = useState({});
  const [pool, setPool] = useState();
  const [outPool, setOutPool] = useState();
  const [selectedCollateralValue, setSelectedCollateralValue] = useState();
  const [selectedBorrowValue, setSelectedBorrowValue] = useState();

  const navigate = useNavigate();

  let collateralAssetDenom = selectedCollateralValue
    ? assetMap[collateralAssetId]?.denom
    : "";
  let borrowAssetDenom = selectedBorrowValue
    ? assetMap[pair?.assetOut]?.denom
    : "";

  const availableBalance =
    getDenomBalance(
      balances,
      collateralAssetDenom,
      assetDenomMap[collateralAssetDenom]?.id
    ) || 0;

  const borrowableBalance = getAmount(
    (Number(inAmount) *
      marketPrice(
        markets,
        collateralAssetDenom,
        assetDenomMap[collateralAssetDenom]?.id
      ) *
      (pair?.isInterPool
        ? (Number(
            decimalConversion(assetRatesStatsMap[collateralAssetId]?.ltv)
          ) -
            MAX_LTV_DEDUCTION) *
          Number(
            decimalConversion(
              assetRatesStatsMap[pool?.transitAssetIds?.first]?.ltv
            )
          )
        : Number(
            decimalConversion(assetRatesStatsMap[collateralAssetId]?.ltv)
          ) - MAX_LTV_DEDUCTION) || 0) /
      marketPrice(
        markets,
        borrowAssetDenom,
        assetDenomMap[borrowAssetDenom]?.id
      ),
    assetDenomMap[borrowAssetDenom]?.decimals
  );

  const borrowList =
    extendedPairs &&
    Object.values(extendedPairs)?.map(
      (item) => assetMap[item?.assetOut]?.denom
    );

  useEffect(() => {
    if (pool?.poolId) {
      setAssetList([
        assetMap[pool?.transitAssetIds?.main?.toNumber()],
        assetMap[pool?.transitAssetIds?.first?.toNumber()],
        assetMap[pool?.transitAssetIds?.second?.toNumber()],
      ]);
    }
  }, [pool]);

  const handleCollateralAssetChange = (assetId) => {
    if (assetId) {
      setCollateralAssetId(assetId);
      setSelectedCollateralValue(assetId);
      setSelectedBorrowValue();
      setPair();
      setOutPool();
      setAssetToPool({});
      setInAmount(0);
      setOutAmount(0);
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
    setMaxBorrowValidationError();
  };

  const handlePoolChange = (value) => {
    let selectedPool = pools?.filter(
      (item) => item?.poolId?.toNumber() === value
    )[0];
    if (selectedPool?.poolId) {
      setSelectedCollateralValue();
      setSelectedBorrowValue();
      setPair();
      setOutPool();
      setPool(selectedPool);
      setCollateralAssetId();
    }
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
        getAmount(value, assetDenomMap[collateralAssetDenom]?.decimals),
        availableBalance
      )
    );
  };

  const handleOutAmountChange = (value) => {
    value = toDecimals(value, assetDenomMap[borrowAssetDenom]?.decimals)
      .toString()
      .trim();

    setOutAmount(value);
    checkMaxBorrow(value);
    setBorrowValidationError(
      ValidateInputNumber(
        value,
        amountConversion(
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
          typeUrl: "/comdex.lend.v1beta1.MsgBorrowAlternate",
          value: {
            lender: address,
            assetId: pair?.assetIn,
            pairId: pair?.id,
            poolId: pool?.poolId,
            isStableBorrow: false,
            appId: Long.fromNumber(APP_ID),
            amountIn: {
              amount: getAmount(
                inAmount,
                assetDenomMap[collateralAssetDenom]?.decimals
              ),
              denom: collateralAssetDenom,
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
        amountConversion(
          borrowableBalance,
          assetDenomMap[borrowAssetDenom]?.decimals
        )
      );
    }
  };

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
                  assetRatesStatsMap[collateralAssetId]?.liquidationThreshold
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
                assetRatesStatsMap[collateralAssetId]?.liquidationThreshold
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
          assetRatesStatsMap[collateralAssetId]?.liquidationPenalty
        ) * 100
      ).toFixed(DOLLAR_DECIMALS)}
      %`,
      tooltipText: "Fee paid by vault owners on liquidation",
    },
    {
      title: "Bonus",
      counts: `${Number(
        decimalConversion(
          assetRatesStatsMap[collateralAssetId]?.liquidationBonus
        ) * 100
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
        <label>#{pool?.poolId?.toNumber()}</label>
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
        <label>#{pool?.poolId?.toNumber()}</label>
      </div>
    </div>
  );

  return (
    <div className="details-wrapper">
      {!dataInProgress ? (
        <>
          <div className="details-left commodo-card commodo-borrow-page">
            <div className="assets-select-card py-3 cpool-select-card mb-3">
              <div className="assets-left full-with-asset">
                <label className="left-label">Collateral cPool</label>
                <div className="assets-select-wrapper mt-0">
                  <Select
                    className="assets-select"
                    popupClassName="asset-select-dropdown"
                    onChange={handlePoolChange}
                    placeholder={
                      <div className="select-placeholder">Select</div>
                    }
                    defaultActiveFirstOption={true}
                    suffixIcon={
                      <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                    }
                    notFoundContent={<NoDataIcon />}
                  >
                    {pools?.length > 0 &&
                      pools?.map((record) => {
                        return (
                          <Option
                            key={record?.poolId?.toNumber()}
                            value={record?.poolId?.toNumber()}
                          >
                            <div className="select-inner">
                              <div className="name">{record?.cpoolName}</div>
                            </div>
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
            </div>
            <div className="assets-select-card mb-3 align-items-center">
              <div className="assets-left">
                <label className="left-label">Collateral Asset</label>
                <div className="assets-select-wrapper">
                  <Select
                    disabled={!pool?.poolId}
                    className="assets-select"
                    popupClassName="asset-select-dropdown"
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
                    notFoundContent={<NoDataIcon />}
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
            <div className="assets-select-card mb-2 align-items-center">
              <div className="assets-left">
                <label className="left-label">Borrow Asset</label>
                <div className="assets-select-wrapper">
                  <Select
                    disabled={!Number(availableBalance)}
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
                  maxBorrowValidationError?.message ||
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
                asset={assetMap[outPool?.transitAssetIds?.main?.toNumber()]}
                poolId={outPool?.poolId}
                parent="borrow"
              />
            </div>
            <div className="commodo-card">
              <Details
                asset={assetMap[outPool?.transitAssetIds?.first?.toNumber()]}
                poolId={outPool?.poolId}
                parent="borrow"
              />
              <div className="mt-5">
                <Details
                  asset={assetMap[outPool?.transitAssetIds?.second?.toNumber()]}
                  poolId={outPool?.poolId}
                  parent="borrow"
                />
              </div>
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
  assetStatMap: PropTypes.object,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  markets: PropTypes.object,
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
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    pools: state.lend.pool.list,
    assetMap: state.asset._.map,
    lang: state.language,
    markets: state.oracle.market,
    assetRatesStatsMap: state.lend.assetRatesStats.map,
    balances: state.account.balances.list,
    assetDenomMap: state.asset._.assetDenomMap,
    assetStatMap: state.asset.assetStatMap,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(BorrowTab);
