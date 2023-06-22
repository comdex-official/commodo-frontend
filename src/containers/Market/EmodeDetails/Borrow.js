import { Button, Select, Slider, List, Spin, message } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  Col,
  NoDataIcon,
  Row,
  SvgIcon,
  TooltipIcon,
} from "../../../components/common";
import { setAssetStatMap } from "../../../actions/asset";
import CustomInput from "../../../components/CustomInput";
import HealthFactor from "../../../components/HealthFactor";
import DistributionAPY from "../../../components/common/DistributionAPY";
import "./index.less";
import {
  amountConversion,
  amountConversionWithComma,
  commaSeparatorWithRounding,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  formatNumber,
  marketPrice,
} from "../../../utils/number";
import {
  QueryPoolAssetLBMapping,
  queryAssetPairs,
  queryAssetPoolFundBalance,
  queryLendPair,
  queryLendPool,
  queryModuleBalance,
} from "../../../services/lend/query";
import {
  ValidateInputNumber,
  ValidateMaxBorrow,
} from "../../../config/_validation";
import {
  errorMessageMappingParser,
  iconNameFromDenom,
  toDecimals,
} from "../../../utils/string";
import { signAndBroadcastTransaction } from "../../../services/helper";
import Snack from "../../../components/common/Snack";
import {
  APP_ID,
  DOLLAR_DECIMALS,
  MAX_LTV_DEDUCTION,
  UC_DENOM,
  ZERO_DOLLAR_DECIMALS,
} from "../../../constants/common";
import CustomRow from "../../../components/common/Asset/CustomRow";
import { assetTransitTypeId, ibcDenoms } from "../../../config/network";
import { defaultFee } from "../../../services/transaction";
import variables from "../../../utils/variables";
import Long from "long";

const { Option } = Select;

const BorrowTab = ({
  lang,
  dataInProgress,
  pool,
  assetMap,
  address,
  markets,
  balances,
  poolLendPositions,
  assetRatesStatsMap,
  assetDenomMap,
  assetStatMap,
  pairIdToBorrowMap,
  refreshBalance,
  setAssetStatMap,
}) => {
  const marks = {
    0: "",
    80: "Safe",
    100: "Riskier",
  };
  let { id, id2, id3, id4 } = useParams();
  const parent = "borrow";

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
  const [selectedCollateralLendingId, setSelectedCollateralLendingId] =
    useState();
  const [selectedCollateralValue, setSelectedCollateralValue] = useState();
  const { state } = useLocation();
  const lendingIdFromRoute = state?.lendingIdFromRoute;
  const pairIdFromRoute = state?.pairIdFromRoute;
  const borrowAssetMinimalDenomFromRoute =
    state?.borrowAssetMinimalDenomFromRoute;

  const navigate = useNavigate();

  // let collateralAssetDenom = assetMap[Number(id2)]?.denom;
  let collateralAssetDenom = selectedCollateralValue
    ? selectedCollateralValue
    : "";
  // console.log(assetMap[Number(id3)]?.denom);
  let borrowAssetDenom = selectedBorrowValue ? selectedBorrowValue : "";

  const availableBalance =
    getDenomBalance(
      balances,
      collateralAssetDenom,
      assetDenomMap[collateralAssetDenom]?.id
    ) || 0;

  // const availableBalance = lend?.availableToBorrow || 0;

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
      // setAssetList([
      //   assetMap[assetOutPool?.transitAssetIds?.main?.toNumber()],
      //   assetMap[assetOutPool?.transitAssetIds?.first?.toNumber()],
      //   // assetMap[assetOutPool?.transitAssetIds?.second?.toNumber()],
      // ]);
    } else if (pool?.poolId && !assetOutPool?.poolId && !selectedBorrowValue) {
      setAssetList([
        assetMap[pool?.transitAssetIds?.main?.toNumber()],
        assetMap[pool?.transitAssetIds?.first?.toNumber()],
        // assetMap[pool?.transitAssetIds?.second?.toNumber()],
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
    // console.log(lendingId);
    setSelectedCollateralLendingId(lendingId);
    // setSelectedCollateralValue(lendId);
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

  const handleBorrowAssetChange2 = (value) => {
    setSelectedCollateralValue(value);
    setSelectedBorrowValue("");
    setOutAmount(0);
    setBorrowValidationError();
    setMaxBorrowValidationError();
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
    value = toDecimals(value, assetDenomMap[borrowAssetDenom]?.decimals)
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
            assetId: Long.fromNumber(Number(id2)),
            pairId: Long.fromNumber(Number(id4)),
            poolId: Long.fromNumber(Number(id)),
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
        amountConversion(
          borrowableBalance,
          assetDenomMap[borrowAssetDenom]?.decimals
        )
      );
    }
  };
  let collateralAssetDenom2 = assetMap[Number(id2)]?.denom;
  let collateralAssetDenom3 = assetMap[Number(id3)]?.denom;
  const borrowList =
    extendedPairs &&
    Object.values(extendedPairs)
      ?.map((item) => assetMap[item?.assetOut]?.denom)
      .filter(
        (item) =>
          item === collateralAssetDenom2 || item === collateralAssetDenom3
      );

  const borrowList2 =
    extendedPairs &&
    Object.values(extendedPairs)
      ?.map((item) => assetMap[item?.assetOut]?.denom)
      .filter(
        (item) =>
          item === assetMap[Number(id2)]?.denom ||
          item === assetMap[Number(id3)]?.denom
      )
      .filter((item) => item !== selectedCollateralValue);

  console.log(borrowList2);

  let currentLTV =
    Number(outAmount) *
      Number(
        marketPrice(
          markets,
          borrowAssetDenom,
          assetDenomMap[borrowAssetDenom]?.id
        )
      ) ===
      0 &&
    Number(inAmount) *
      Number(
        marketPrice(
          markets,
          collateralAssetDenom,
          assetDenomMap[collateralAssetDenom]?.id
        )
      ) ===
      0
      ? 0
      : Number(
          ((Number(outAmount) *
            Number(
              marketPrice(
                markets,
                borrowAssetDenom,
                assetDenomMap[borrowAssetDenom]?.id
              )
            )) /
            (Number(inAmount) *
              Number(
                marketPrice(
                  markets,
                  collateralAssetDenom,
                  assetDenomMap[collateralAssetDenom]?.id
                )
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

  const handleSliderChange = (sliderValue) => {
    let value = (sliderValue / 100) * maxLTV;

    if (value >= maxLTV) {
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

    let borrowValue = toDecimals(
      String(outValue),
      assetDenomMap[borrowAssetDenom]?.decimals
    )
      .toString()
      .trim();

    setOutAmount(borrowValue || 0);
    setNewBalance(Number(borrowValue || 0) + currentBalance);
    checkMaxBorrow(borrowValue || 0);
  };

  const [stats, setStats] = useState();
  const [moduleBalanceStats, setModuleBalanceStats] = useState([]);
  const [assetPoolFunds, setAssetPoolFunds] = useState({});
  const assetIdDetails = pair?.assetOut?.toNumber();
  const poolIdDetails = assetOutPool?.poolId || pool?.poolId;

  useEffect(() => {
    if (assetIdDetails && poolIdDetails) {
      QueryPoolAssetLBMapping(
        assetIdDetails,
        poolIdDetails,
        (error, result) => {
          if (error) {
            message.error(error);
            return;
          }

          setStats(result?.PoolAssetLBMapping);
        }
      );

      queryAssetPoolFundBalance(
        assetIdDetails,
        poolIdDetails,
        (error, result) => {
          if (error) {
            message.error(error);
            return;
          }

          setAssetPoolFunds(result?.amount);
        }
      );
    } else if (stats?.poolId) {
      setStats();
    }
  }, [assetIdDetails, poolIdDetails, refreshBalance]);

  useEffect(() => {
    if (poolIdDetails) {
      queryModuleBalance(poolIdDetails, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        setModuleBalanceStats(result?.ModuleBalance?.moduleBalanceStats);
      });
    }
  }, [poolIdDetails, refreshBalance]);

  let assetStats = moduleBalanceStats?.filter(
    (item) => item?.assetId?.toNumber() === assetIdDetails
  )[0];

  useEffect(() => {
    setAssetStatMap(assetIdDetails, assetStats?.balance);
  }, [assetStats]);

  let data = [
    {
      title: parent === "lend" ? "Deposited" : "Borrowed",
      counts: `$${commaSeparatorWithRounding(
        Number(
          amountConversion(
            (parent === "lend" ? stats?.totalLend : stats?.totalBorrowed) || 0
          ) *
            marketPrice(
              markets,
              borrowAssetDenom,
              assetDenomMap[borrowAssetDenom]?.id
            ),
          assetDenomMap[borrowAssetDenom]?.decimals
        ) +
          (parent === "lend"
            ? Number(
                amountConversion(
                  assetPoolFunds?.amount,
                  assetDenomMap[assetPoolFunds?.denom]?.decimals
                ) *
                  marketPrice(
                    markets,
                    assetPoolFunds?.denom,
                    assetDenomMap[assetPoolFunds?.denom]?.id
                  )
              )
            : 0),
        DOLLAR_DECIMALS
      )}`,
      tooltipText:
        parent === "lend" ? "Total funds Deposited" : "Total funds Borrowed",
    },
    {
      title: "Available",
      counts: `$${commaSeparatorWithRounding(
        Number(
          amountConversion(
            marketPrice(
              markets,
              assetStats?.balance?.denom,
              assetDenomMap[assetStats?.balance?.denom]?.id
            ) * assetStats?.balance.amount || 0,
            assetDenomMap[assetStats?.balance?.denom]?.decimals
          )
        ),
        DOLLAR_DECIMALS
      )}`,
      tooltipText:
        parent === "lend" ? "Total funds Available" : "Total funds Available",
    },
    {
      title: "Utilization",
      counts: (
        <>
          {Number(decimalConversion(stats?.utilisationRatio) * 100).toFixed(
            DOLLAR_DECIMALS
          )}
          %
        </>
      ),
      tooltipText:
        parent === "lend" ? "Asset Utilization" : "Asset Utilization",
    },
    {
      title: parent === "lend" ? "Lend APY" : "Borrow APY",
      counts: (
        <>
          <>
            {Number(
              decimalConversion(
                parent === "lend" ? stats?.lendApr : stats?.borrowApr
              ) * 100
            ).toFixed(DOLLAR_DECIMALS)}
            %
          </>
          {/* TODO: take the condition dynamically */}
          {parent === "lend" ? null : borrowAssetDenom === "uatom" ||
            borrowAssetDenom === ibcDenoms["uatom"] ||
            borrowAssetDenom === "ucmst" ? (
            <DistributionAPY
              assetId={assetIdDetails}
              poolId={poolIdDetails}
              margin={"top"}
            />
          ) : null}
        </>
      ),
      tooltipText:
        parent === "lend" ? "Lend APY of Asset" : "Borrow APY of Asset",
    },
  ];

  const newBalance2 =
    newBalance *
    marketPrice(markets, borrowAssetDenom, assetDenomMap[borrowAssetDenom]?.id);

  const currentBalance2 =
    currentBalance *
    marketPrice(markets, borrowAssetDenom, assetDenomMap[borrowAssetDenom]?.id);

  let borrowData = [
    {
      title: "Current borrow balance",
      counts: `$${formatNumber(
        Number(currentBalance2 || 0).toFixed(ZERO_DOLLAR_DECIMALS)
      )}`,
      tooltipText: "Your current borrow balance",
    },
    {
      title: "New Borrow balance",
      counts: `$${formatNumber(
        Number(newBalance2 || 0).toFixed(ZERO_DOLLAR_DECIMALS)
      )}`,
      tooltipText: "Your new borrow balance",
    },
  ];

  const lendAssetId = lend?.assetId || pair?.assetIn;

  const liquidationThreshold = {
    title: "Liq. Threshold",
    counts: `${Number(
      decimalConversion(assetRatesStatsMap[Number(id2)]?.liquidationThreshold) *
        100
    ).toFixed(DOLLAR_DECIMALS)}%`,
    tooltipText:
      "The threshold at which a loan is defined as under collateralized and subject to liquidation of collateral",
  };

  const liquidationPenaltyBonus =
    Number(
      decimalConversion(assetRatesStatsMap[Number(id2)]?.liquidationPenalty)
    ) *
      100 +
    Number(
      decimalConversion(assetRatesStatsMap[Number(id2)]?.liquidationBonus)
    ) *
      100;

  const liquidationPenalty = {
    title: "Liq. Penalty",
    counts: `${Number(liquidationPenaltyBonus).toFixed(DOLLAR_DECIMALS)}%`,
    tooltipText: "Fee paid by vault owners on liquidation",
  };

  let data2 = [
    {
      title: "Max LTV",
      counts: `${Number(
        decimalConversion(assetRatesStatsMap[Number(id2)]?.ltv) * 100
      ).toFixed(DOLLAR_DECIMALS)}%`,
      tooltipText:
        parent === "lend" ? "Total funds Deposited" : "Total funds Borrowed",
    },
    liquidationThreshold,
    liquidationPenalty,
    {
      title: "Collateral Type",
      counts: "Normal",
      tooltipText: "Type of the collateral selected",
    },
  ];

  const hf = () => {
    const data =
      Number(
        Number(
          inAmount *
            marketPrice(
              markets,
              collateralAssetDenom,
              assetDenomMap[collateralAssetDenom]?.id
            ) || 0
        ) *
          Number(
            decimalConversion(
              assetRatesStatsMap[Number(id2)]?.liquidationThreshold
            ) * 100
          )
      ) /
      Number(
        outAmount *
          marketPrice(
            markets,
            borrowAssetDenom,
            assetDenomMap[borrowAssetDenom]?.id
          ) || 0
      );

    return data === Number.NaN || data === Number.POSITIVE_INFINITY
      ? Number(0).toFixed(DOLLAR_DECIMALS)
      : Number(data || 0).toFixed(DOLLAR_DECIMALS);
  };

  return (
    <div className="details-wrapper emode-details-wrapper">
      {!dataInProgress ? (
        <>
          <div className="details-left commodo-card mh-100">
            {/* <div className="deposit-head">
          <div className="deposit-head-left">
            <div className="assets-col mr-3">
              <div className="assets-icon">
                <SvgIcon name='atom-icon' />
              </div>
              ATOM
            </div>
            <div className="assets-col mr-3">
              <div className="assets-icon">
                <SvgIcon name='statom-icon' />
              </div>
              stATOM
            </div>
          </div>
          <div className="deposit-poolId">#10</div>
        </div> */}
            <CustomRow assetList={assetList} poolId={pool?.poolId?.low} />
            <div className="assets-select-card mb-3">
              <div className="assets-left">
                <label className="left-label">Collateral Asset</label>
                <div className="assets-select-wrapper">
                  {/* <Select
                  className="assets-select"
                  popupClassName="asset-select-dropdown"
                  placeholder={
                    <div className="select-placeholder">
                      <div className="circle-icon no-border">
                        <div className="circle-icon-inner">
                          <SvgIcon name='atom-icon' />
                        </div>
                      </div>
                      ATOM
                    </div>
                  }
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  suffixIcon={false}
                  options={false}
                  disabled
                >
                </Select> */}
                  <Select
                    className="assets-select"
                    popupClassName="asset-select-dropdown"
                    value={
                      borrowList?.length && collateralAssetDenom
                        ? selectedCollateralValue
                        : null
                    }
                    onChange={handleBorrowAssetChange2}
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
                                    {denomConversion(item)}
                                    {/* ( */}
                                    {/* {"cPool-" +
                                      assetToPool[item]?.cpoolName?.split(
                                        "-"
                                      )?.[0]} */}
                                    {/* ) */}
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
                <div className="label-right">
                  <div className="available-balance">
                    Available
                    <span className="ml-1">
                      {amountConversionWithComma(
                        availableBalance,
                        assetDenomMap[collateralAssetDenom]?.decimals
                      )}{" "}
                      {denomConversion(collateralAssetDenom)}
                    </span>
                    <span className="assets-max-half">
                      <Button className=" active" onClick={handleMaxClick}>
                        Max
                      </Button>
                    </span>
                  </div>
                </div>
                <div>
                  <div className="input-select">
                    {/* <CustomInput /> */}
                    <CustomInput
                      value={inAmount}
                      onChange={(event) =>
                        handleInAmountChange(event.target.value)
                      }
                      validationError={validationError}
                    />
                  </div>
                  <small>
                    ${" "}
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

            <div className="assets-select-card mb-0">
              <div className="assets-left">
                <label className="left-label">Borrow Asset</label>
                <div className="assets-select-wrapper">
                  <div className="assets-select-wrapper">
                    {/* <Select
                  className="assets-select"
                  popupClassName="asset-select-dropdown"
                  placeholder={
                    <div className="select-placeholder">
                      <div className="circle-icon no-border">
                        <div className="circle-icon-inner">
                          <SvgIcon name='statom-icon' />
                        </div>
                      </div>
                      ATOM
                    </div>
                  }
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  suffixIcon={false}
                  options={false}
                  disabled
                >
                </Select> */}
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
                        <SvgIcon
                          name="arrow-down"
                          viewbox="0 0 19.244 10.483"
                        />
                      }
                      notFoundContent={<NoDataIcon />}
                    >
                      {borrowList2?.length > 0 &&
                        borrowList2?.map((record) => {
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
                                      {denomConversion(item)}
                                      {/* ( */}
                                      {/* {"cPool-" +
                                        assetToPool[item]?.cpoolName?.split(
                                          "-"
                                        )?.[0]} */}
                                      {/* ) */}
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
              </div>
              <div className="assets-right">
                {borrowAssetDenom ? (
                  <div className="label-right">
                    <div className="available-balance">
                      Borrowable
                      <span className="ml-1">
                        {amountConversionWithComma(
                          borrowableBalance >= 0 ? borrowableBalance : 0,
                          assetDenomMap[borrowAssetDenom]?.decimals
                        )}{" "}
                        {denomConversion(borrowAssetDenom)}
                      </span>
                      <span className="assets-max-half">
                        <Button
                          className=" active"
                          onClick={handleBorrowMaxClick}
                        >
                          Max
                        </Button>
                      </span>
                    </div>
                  </div>
                ) : null}
                <div>
                  <div className="input-select">
                    {/* <CustomInput /> */}
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
                  </small>
                </div>
              </div>
            </div>
            <Row>
              <Col sm="12" className="mx-auto card-bottom-details">
                <Row className="mt-4">
                  <Col sm="12">
                    {/* <Slider
                  marks={marks}
                  tooltip={{ open: false }}
                  className="commodo-slider market-slider-1 borrow-slider"
                /> */}

                    <Slider
                      marks={marks}
                      value={
                        Number(currentLTV) * 100 === 0 && Number(maxLTV) === 0
                          ? 0
                          : (Number(currentLTV) * 100) / Number(maxLTV)
                      }
                      onChange={handleSliderChange}
                      tooltip={{ open: false }}
                      className="commodo-slider market-slider-1 borrow-slider"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <label>Health Factor</label>
                    <TooltipIcon text="Numeric representation of your position's safety" />
                  </Col>
                  <Col className="text-right health-right-repay">
                    {/* <HealthFactor
                      name="Health Factor"
                      pair={pair}
                      inAmount={inAmount}
                      outAmount={outAmount}
                      pool={pool}
                    /> */}
                    <div>
                      {/* {Number(percentage || 0).toFixed(DOLLAR_DECIMALS)} */}
                      {hf() || 0.0}
                    </div>
                    <small className="font-weight-light">
                      {"Liquidation at H.F<1.0"}
                    </small>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <label>Borrow APY</label>
                  </Col>
                  <Col className="text-right">
                    {Number(decimalConversion(stats?.borrowApr) * 100).toFixed(
                      DOLLAR_DECIMALS
                    )}
                    %
                    <DistributionAPY
                      poolId={pool?.poolId}
                      assetId={pair?.assetOut}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="assets-form-btn mt-4">
              <Button
                type="primary"
                className="btn-filled"
                loading={inProgress}
                disabled={
                  !Number(inAmount) ||
                  !Number(outAmount) ||
                  validationError?.message ||
                  borrowValidationError?.message ||
                  maxBorrowValidationError?.message ||
                  inProgress ||
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
              <div className="card-head">
                <div className="head-left">
                  <div className="assets-col">
                    <div className="assets-icon">
                      <SvgIcon name={iconNameFromDenom(borrowAssetDenom)} />
                    </div>
                    {denomConversion(borrowAssetDenom)}
                  </div>
                </div>
                <div className="head-right">
                  <span>Oracle Price</span> : ${" "}
                  {commaSeparator(
                    Number(
                      marketPrice(
                        markets,
                        borrowAssetDenom,
                        assetDenomMap[borrowAssetDenom]?.id
                      )
                    ).toFixed(DOLLAR_DECIMALS)
                  )}
                </div>
              </div>
              <List
                className="pb-0"
                grid={{
                  gutter: 16,
                  xs: 2,
                  sm: 2,
                  md: 4,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <div>
                      <p>
                        {item.title} <TooltipIcon text={item.tooltipText} />
                      </p>
                      <h3>{item.counts}</h3>
                      {/* {item.apy && (
                        <div className="pt-1">
                          <DistributionAPY />
                        </div>
                      )} */}
                    </div>
                  </List.Item>
                )}
              />
              <List
                className="pt-0"
                grid={{
                  gutter: 16,
                  xs: 2,
                  sm: 2,
                  md: 2,
                  lg: 2,
                  xl: 2,
                  xxl: 2,
                }}
                dataSource={borrowData}
                renderItem={(item) => (
                  <List.Item>
                    <div>
                      <p>
                        {item.title} <TooltipIcon text={item.tooltipText} />
                      </p>
                      <h3>{item.counts}</h3>
                      {/* {item.apy && (
                        <div className="pt-1">
                          <DistributionAPY />
                        </div>
                      )} */}
                    </div>
                  </List.Item>
                )}
              />
            </div>
            <div className="commodo-card borrow-card">
              <div className="card-head">
                <div className="head-left">
                  <div className="assets-col">
                    <div className="assets-icon">
                      <SvgIcon name={iconNameFromDenom(collateralAssetDenom)} />
                    </div>
                    Collateral Details
                  </div>
                </div>
              </div>
              <List
                grid={{
                  gutter: 16,
                  xs: 2,
                  sm: 2,
                  md: 2,
                  lg: 2,
                  xl: 2,
                  xxl: 2,
                }}
                dataSource={data2}
                renderItem={(item) => (
                  <List.Item>
                    <div>
                      <p>
                        {item.title} <TooltipIcon text={item.tooltipText} />
                      </p>
                      <h3>{item.counts}</h3>
                      {/* {item.apy && (
                        <div className="pt-1">
                          <DistributionAPY />
                        </div>
                      )} */}
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
  pairIdToBorrowMap: PropTypes.object,
  assetStatMap: PropTypes.object,
  assetRatesStatsMap: PropTypes.object,
  markets: PropTypes.object,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
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
    balances: state.account.balances.list,
    markets: state.oracle.market,
    poolLendPositions: state.lend.poolLends,
    assetRatesStatsMap: state.lend.assetRatesStats.map,
    assetDenomMap: state.asset._.assetDenomMap,
    assetStatMap: state.asset.assetStatMap,
    pairIdToBorrowMap: state.lend.pairIdToBorrowMap,
    refreshBalance: state.account.refreshBalance,
  };
};

const actionsToProps = {
  setAssetStatMap,
};

export default connect(stateToProps, actionsToProps)(BorrowTab);
