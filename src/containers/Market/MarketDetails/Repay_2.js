import { Button, message, Select, Slider, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import { setBalanceRefresh } from "../../../actions/account";
import {
  Col,
  NoDataIcon,
  Row,
  SvgIcon,
  TooltipIcon
} from "../../../components/common";
import CustomRow from "../../../components/common/Asset/CustomRow";
import Details from "../../../components/common/Asset/Details";
import CustomInput from "../../../components/CustomInput";
import HealthFactor from "../../../components/HealthFactor";
import { assetTransitTypeId } from "../../../config/network";
import { ValidateInputNumber } from "../../../config/_validation";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import {
  queryAllBorrowByOwnerAndPool,
  queryLendPair,
  queryLendPool
} from "../../../services/lend/query";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance
} from "../../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  marketPrice
} from "../../../utils/number";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import ActionButton from "../../Myhome/BorrowRepay/ActionButton";
import "./index.less";

const { Option } = Select;

const RepayTab_2 = ({
  lang,
  dataInProgress,
  pool,
  assetMap,
  balances,
  address,
  refreshBalance,
  setBalanceRefresh,
  markets,
  assetDenomMap,
}) => {
  const [amount, setAmount] = useState();
  const [validationError, setValidationError] = useState();
  const [assetList, setAssetList] = useState();
  const [borrowPosition, setBorrowPosition] = useState([]);
  const [userBorrowsMap, setUserBorrowsMap] = useState({});
  const [selectedAssetId, setSelectedAssetId] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [updatedAmountOut, setUpdatedAmountOut] = useState(0);
  const [selectedBorrowPosition, setSelectedBorrowPosition] = useState([]);
  const [pair, setPair] = useState();
  const [sliderValue, setSliderValue] = useState(0);
  const [assetOutPool, setAssetOutPool] = useState();
  const [selectedBorrowDenom, setSelectedBorrowDenom] = useState();

  const { state } = useLocation();
  const borrowAssetMinimalDenomFromRoute =
    state?.borrowAssetMinimalDenomFromRoute;
  const collateralAssetMinimalDenomFromRoute =
    state?.collateralAssetMinimalDenomFromRoute;

  const fetchAllBorrowByOwnerAndPool = (address, poolId) => {
    queryAllBorrowByOwnerAndPool(address, poolId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      const userBorrowsMap = result?.borrows?.reduce((map, obj) => {
        map[obj?.amountOut?.denom + obj?.amountIn?.denom] = obj;
        return map;
      }, {});

      setBorrowPosition(result?.borrows);
      setUserBorrowsMap(userBorrowsMap);
    });
  };

  useEffect(() => {
    fetchAllBorrowByOwnerAndPool(address, pool?.poolId);
  }, [address, pool]);

  useEffect(() => {
    if (
      borrowAssetMinimalDenomFromRoute &&
      collateralAssetMinimalDenomFromRoute &&
      borrowPosition?.length
    ) {
      handleAssetChange(
        borrowAssetMinimalDenomFromRoute + collateralAssetMinimalDenomFromRoute
      );
    }
  }, [borrowAssetMinimalDenomFromRoute, borrowPosition]);

  useEffect(() => {
    if (assetOutPool?.poolId) {
      setAssetList([
        assetMap[assetOutPool?.transitAssetIds?.main?.toNumber()],
        assetMap[assetOutPool?.transitAssetIds?.first?.toNumber()],
        assetMap[assetOutPool?.transitAssetIds?.second?.toNumber()],
      ]);
    } else if (pool?.poolId && !assetOutPool?.poolId) {
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
    } else {
      setAssetOutPool();
    }
  }, [pair]);

  const handleInputChange = (value) => {
    value = toDecimals(
      value,
      assetDenomMap[borrowPosition?.amountOut?.denom]?.decimals
    )
      .toString()
      .trim();

    setAmount(value);
    setSliderValue(
      (value /
        amountConversion(
          updatedAmountOut,
          assetDenomMap[selectedBorrowPosition?.amountOut?.denom]?.decimals
        )) *
        100
    );
    setValidationError(
      ValidateInputNumber(
        value,
        amountConversion(
          availableBalance,
          assetDenomMap[selectedBorrowPosition?.amountOut?.denom]?.decimals
        ),
        "repay",
        amountConversion(
          updatedAmountOut,
          assetDenomMap[borrowPosition?.amountOut?.denom]?.decimals
        )
      )
    );
  };

  const handleRefresh = () => {
    setBalanceRefresh(refreshBalance + 1);
    setAmount();
  };

  const handleMaxRepay = () => {
    handleInputChange(
      amountConversion(
        updatedAmountOut,
        assetDenomMap[borrowPosition?.amountOut?.denom]?.decimals
      )
    );
  };

  const handleAssetChange = (value) => {
    setSelectedBorrowDenom(value);
    setAvailableBalance(
      getDenomBalance(balances, userBorrowsMap[value]?.amountOut?.denom) || 0
    );
    setUpdatedAmountOut(
      Number(userBorrowsMap[value]?.amountOut?.amount) +
        Number(decimalConversion(userBorrowsMap[value]?.interestAccumulated))
    );

    setSelectedBorrowPosition(userBorrowsMap[value]);
    queryLendPair(userBorrowsMap[value]?.pairId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setSelectedAssetId(result?.ExtendedPair?.assetOut?.toNumber());
      setPair(result?.ExtendedPair);
    });
  };

  const handleSliderChange = (value) => {
    // percentage =  value/100 * total
    let percentageValue =
      (value / 100) *
      amountConversion(
        updatedAmountOut,
        assetDenomMap[selectedBorrowPosition?.amountOut?.denom]?.decimals
      );

    handleInputChange(String(percentageValue));
  };

  const marks = {
    0: "0%",
    100: "100%",
  };

  return (
    <div className="details-wrapper market-details-wrapper details-wrapper-repay">
      <div className="details-left commodo-card mh-100">
        <CustomRow
          assetList={assetList}
          poolId={assetOutPool?.poolId?.low || pool?.poolId?.low}
        />
        <div className="assets-select-card mb-2">
          <div className="assets-left">
            <label className="left-label">Repay Asset</label>
            <div className="assets-select-wrapper">
              <div className="assets-select-wrapper">
                <Select
                  className="assets-select"
                  popupClassName="asset-select-dropdown"
                  onChange={handleAssetChange}
                  placeholder={
                    <div className="select-placeholder">
                      <div className="circle-icon">
                        <div className="circle-icon-inner" />
                      </div>
                      Select
                    </div>
                  }
                  value={
                    selectedBorrowDenom ? String(selectedBorrowDenom) : null
                  }
                  defaultActiveFirstOption={true}
                  showArrow={true}
                  notFoundContent={<NoDataIcon />}
                >
                  {borrowPosition?.length > 0 &&
                    borrowPosition?.map((item) => {
                      return (
                        <Option
                          key={item?.borrowingId?.toNumber()}
                          value={item?.amountOut?.denom + item?.amountIn?.denom}
                          disabled={item?.isLiquidated}
                        >
                          <div className="select-inner">
                            <div className="svg-icon">
                              <div className="svg-icon-inner">
                                <SvgIcon
                                  name={iconNameFromDenom(
                                    item?.amountOut?.denom
                                  )}
                                />
                              </div>
                            </div>
                            <div className="name">
                              <Tooltip
                                placement="topLeft"
                                title={
                                  item?.isLiquidated
                                    ? "Position has been sent for Auction."
                                    : ""
                                }
                              >
                                {denomConversion(item?.amountOut?.denom)}
                              </Tooltip>
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
            <div className="label-right">
              <div className="available-balance">
                Remaining Debt
                <span className="ml-1">
                  {amountConversionWithComma(
                    updatedAmountOut,
                    assetDenomMap[selectedBorrowPosition?.amountOut?.denom]
                      ?.decimals
                  )}{" "}
                  {denomConversion(selectedBorrowPosition?.amountOut?.denom)}
                </span>
                <span className="assets-max-half">
                  <Button className=" active" onClick={handleMaxRepay}>
                    Max
                  </Button>
                </span>
              </div>
            </div>
            <div>
              <div className="input-select">
                <CustomInput
                  value={amount}
                  onChange={(event) => handleInputChange(event.target.value)}
                  validationError={validationError}
                />{" "}
              </div>
              <small>
                $
                {commaSeparator(
                  Number(
                    amount *
                      marketPrice(
                        markets,
                        assetMap[selectedAssetId]?.denom,
                        selectedAssetId
                      ) || 0
                  ).toFixed(DOLLAR_DECIMALS)
                )}{" "}
              </small>{" "}
            </div>
          </div>
        </div>
        <Row>
          <Col sm="12" className="mt-2 mx-auto card-bottom-details">
            <Row className="mt-3">
              <Col sm="12">
                <Slider
                  marks={marks}
                  value={sliderValue}
                  tooltip={{ open: false }}
                  onChange={handleSliderChange}
                  className="commodo-slider market-slider-1 repay-slider"
                />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col>
                <label>Available in wallet</label>
              </Col>
              <Col className="text-right repay-remain-right">
                <small className="font-weight-light">
                  {amountConversionWithComma(
                    availableBalance,
                    assetDenomMap[selectedBorrowPosition?.amountOut?.denom]
                      ?.decimals
                  )}{" "}
                  {denomConversion(selectedBorrowPosition?.amountOut?.denom)}
                </small>
              </Col>
            </Row>

            <Row className="mt-2 lastrow-market-dtl">
              <Col>
                <label>Health Factor</label>
                <TooltipIcon text="Numeric representation of your position's safety" />
              </Col>
              <Col className="text-right health-right-repay">
                <HealthFactor
                  borrow={selectedBorrowPosition}
                  pair={pair}
                  pool={pool}
                  inAmount={selectedBorrowPosition?.amountIn?.amount}
                  outAmount={
                    amount
                      ? Number(updatedAmountOut)?.toFixed(0) -
                        Number(
                          getAmount(
                            amount,
                            assetDenomMap[
                              selectedBorrowPosition?.amountOut?.denom
                            ]?.decimals
                          )
                        )
                      : Number(updatedAmountOut)?.toFixed(0)
                  }
                />{" "}
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn">
          <ActionButton
            name="Repay"
            lang={lang}
            disabled={
              !Number(amount) ||
              dataInProgress ||
              !selectedAssetId ||
              validationError?.message
            }
            amount={amount}
            address={address}
            borrowId={selectedBorrowPosition?.borrowingId}
            denom={selectedBorrowPosition?.amountOut?.denom}
            refreshData={handleRefresh}
            assetDenomMap={assetDenomMap}
          />
        </div>
      </div>
      <div className="details-right">
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
        </div>
        <div className="commodo-card">
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
    </div>
  );
};

RepayTab_2.propTypes = {
  dataInProgress: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  setBalanceRefresh: PropTypes.func.isRequired,
  address: PropTypes.string,
  assetDenomMap: PropTypes.object,
  assetMap: PropTypes.object,
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  borrowPosition: PropTypes.shape({
    lendingId: PropTypes.shape({
      low: PropTypes.number,
    }),
    amountIn: PropTypes.shape({
      denom: PropTypes.string,
      amount: PropTypes.string,
    }),
  }),
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
  refreshBalance: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    pool: state.lend.pool._,
    pair: state.lend.pair,
    assetMap: state.asset._.map,
    balances: state.account.balances.list,
    lang: state.language,
    refreshBalance: state.account.refreshBalance,
    markets: state.oracle.market,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

const actionsToProps = {
  setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(RepayTab_2);
