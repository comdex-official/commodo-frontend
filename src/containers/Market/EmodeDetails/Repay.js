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
  TooltipIcon,
} from "../../../components/common";
import CollateralAndBorrowDetails from "../../../components/common/Asset/CollateralAndBorrowDetails";
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
  queryLendPool,
} from "../../../services/lend/query";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  marketPrice,
} from "../../../utils/number";
import {
  iconNameFromDenom,
  toDecimals,
  ucDenomToDenom,
} from "../../../utils/string";
import ActionButton from "../../Myhome/BorrowRepay/ActionButton";
import "./index.less";

const { Option } = Select;

const RepayTab = ({
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
  assetRatesStatsMap,
}) => {
  const marks = {
    0: "0%",
    50: "50%",
    100: "100%",
  };

  const [amount, setAmount] = useState();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [newBalance, setNewBalance] = useState(0);
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
      // setAssetList([
      //   assetMap[assetOutPool?.transitAssetIds?.main?.toNumber()],
      //   assetMap[assetOutPool?.transitAssetIds?.first?.toNumber()],
      //   assetMap[assetOutPool?.transitAssetIds?.second?.toNumber()],
      // ]);
    } else if (pool?.poolId && !assetOutPool?.poolId) {
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
    setNewBalance(currentBalance - Number(value));
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

  useEffect(() => {
    if (
      selectedBorrowDenom &&
      Number(userBorrowsMap[selectedBorrowDenom]?.amountOut?.amount)
    ) {
      setCurrentBalance(
        Number(
          amountConversion(
            userBorrowsMap[selectedBorrowDenom]?.amountOut?.amount
          )
        )
      );
      setNewBalance(0);
    } else {
      setCurrentBalance(0);
      setNewBalance(0);
    }
  }, [selectedBorrowDenom, userBorrowsMap]);

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

  const hf = () => {
    const data =
      (Number(
        Number(
          amountConversion(
            selectedBorrowPosition?.amountIn?.amount,
            ucDenomToDenom(selectedBorrowPosition?.amountIn?.denom)?.decimals
          ) || 0
        ) *
          marketPrice(
            markets,
            ucDenomToDenom(selectedBorrowPosition?.amountIn?.denom),
            assetDenomMap[
              ucDenomToDenom(selectedBorrowPosition?.amountIn?.denom)
            ]?.id
          ) || 0,
        DOLLAR_DECIMALS
      ) *
        (Number(
          decimalConversion(
            assetRatesStatsMap[Number(pair?.assetIn)]?.eLiquidationThreshold
          ) * 100
        ) /
          100)) /
      Number(
        (amountConversion(
          updatedAmountOut,
          assetDenomMap[selectedBorrowPosition?.amountOut?.denom]?.decimals
        ) -
          Number(amount | 0)) *
          marketPrice(
            markets,
            assetMap[selectedAssetId]?.denom,
            selectedAssetId
          ) || 0
      ).toFixed(DOLLAR_DECIMALS);

    return data === Number.NaN
      ? Number(0).toFixed(DOLLAR_DECIMALS)
      : Number(data || 0).toFixed(DOLLAR_DECIMALS);
  };

  return (
    <div className="details-wrapper emode-details-wrapper">
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
        <CustomRow
          assetList={assetList}
          poolId={assetOutPool?.poolId?.low || pool?.poolId?.low}
        />

        <div className="assets-select-card mb-0">
          <div className="assets-left">
            <label className="left-label">Repay Asset</label>
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
                  suffixIcon={
                    <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                  }
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
                Available
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
                {/* <CustomInput /> */}
                <CustomInput
                  value={amount}
                  onChange={(event) => handleInputChange(event.target.value)}
                  validationError={validationError}
                />
              </div>
              <small>
                ${" "}
                {commaSeparator(
                  Number(
                    amount *
                      marketPrice(
                        markets,
                        assetMap[selectedAssetId]?.denom,
                        selectedAssetId
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
                  className="commodo-slider market-slider-1"
                /> */}
                <Slider
                  marks={marks}
                  value={sliderValue}
                  tooltip={{ open: false }}
                  onChange={handleSliderChange}
                  className="commodo-slider market-slider-1 repay-slider"
                />
              </Col>
            </Row>

            {/* <Row className="mt-3">
              <Col>
                <label>Max LTV <TooltipIcon text='text' /></label>
              </Col>
              <Col className="text-right">
                50%
              </Col>
            </Row> */}
            <Row className="mt-3">
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

            <Row className="mt-3">
              <Col>
                <label>Health Factor</label>
                <TooltipIcon text="Numeric representation of your position's safety" />
              </Col>
              <Col className="text-right health-right-repay">
                {/* <HealthFactor
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
                /> */}
                {hf() || 0.0}
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn">
          <ActionButton
            name="RepayWithDraw"
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
          {/* <div className="card-head">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name='atom-icon' />
                </div>
                Borrow Details
              </div>
            </div>
            <div className="head-right">
              <span>Oracle Price</span> : $123.45
            </div>
          </div>
          <List
            className="pb-0 pt-3"
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={borrowData}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <p>
                    {item.title} <TooltipIcon text={item.tooltipText} />
                  </p>
                  <h3>{item.counts}</h3>
                  {item.apy && <div className="pt-1"><DistributionAPY /></div>}
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
            dataSource={borrowData2}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <p>
                    {item.title} <TooltipIcon text={item.tooltipText} />
                  </p>
                  <h3>{item.counts}</h3>
                  {item.apy && <div className="pt-1"><DistributionAPY /></div>}
                </div>
              </List.Item>
            )}
          /> */}
          <Details
            assetId={pair?.assetOut}
            assetDenom={selectedBorrowPosition?.amountOut?.denom}
            poolId={assetOutPool?.poolId || pool?.poolId}
            parent="borrow"
          />
        </div>
        <div className="commodo-card">
          {/* <div className="card-head noborder pb-0">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name='atom-icon' />
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
              md: 4,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={data1}
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
          /> */}
          <CollateralAndBorrowDetails
            eMod={true}
            lendAssetId={pair?.assetIn}
            collateralAssetDenom={ucDenomToDenom(
              selectedBorrowPosition?.amountIn?.denom
            )}
            borrowAssetDenom={selectedBorrowPosition?.amountOut?.denom}
            poolId={assetOutPool?.poolId || pool?.poolId}
            parent="borrow"
            tabName="repay"
            newBalance={
              newBalance *
              marketPrice(
                markets,
                assetMap[selectedAssetId]?.denom,
                selectedAssetId
              )
            }
            currentBalance={
              currentBalance *
              marketPrice(
                markets,
                assetMap[selectedAssetId]?.denom,
                selectedAssetId
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

RepayTab.propTypes = {
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
  assetRatesStatsMap: PropTypes.object,
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
    assetRatesStatsMap: state.lend.assetRatesStats.map,
    markets: state.oracle.market,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

const actionsToProps = {
  setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(RepayTab);
