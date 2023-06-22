import { Button, message, Select, Slider } from "antd";
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
import CollateralDetails from "../../../components/common/Asset/CollateralDetails";
import CustomRow from "../../../components/common/Asset/CustomRow";
import Details from "../../../components/common/Asset/Details";
import AssetStats from "../../../components/common/Asset/Stats";
import CustomInput from "../../../components/CustomInput";
import { ValidateInputNumber } from "../../../config/_validation";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import {
  queryAllLendByOwnerAndPool,
  QueryPoolAssetLBMapping,
} from "../../../services/lend/query";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
} from "../../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  marketPrice,
} from "../../../utils/number";
import { iconNameFromDenom, toDecimals } from "../../../utils/string";
import ActionButton from "../../Myhome/DepositWithdraw/ActionButton";
import "./index.less";

const { Option } = Select;

const Withdraw = ({
  lang,
  dataInProgress,
  pool,
  assetMap,
  address,
  refreshBalance,
  setBalanceRefresh,
  markets,
  assetDenomMap,
}) => {
  const marks = {
    0: "0%",
    50: "50%",
    100: "100%",
  };

  console.log({ pool });

  const [assetList, setAssetList] = useState();
  const [amount, setAmount] = useState();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [newBalance, setNewBalance] = useState(0);
  const [validationError, setValidationError] = useState();
  const [allLendByOwner, setAllLendByOwner] = useState([]);
  const [userLendsMap, setUserLendsMap] = useState({});
  const [selectedAssetId, setSelectedAssetId] = useState(0);
  const [lendPosition, setLendPosition] = useState();
  const [lendApy, setLendApy] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  const { state } = useLocation();
  const collateralAssetIdFromRoute = state?.collateralAssetIdFromRoute;

  const availableBalance = lendPosition?.availableToBorrow || 0;

  useEffect(() => {
    if (pool?.poolId) {
      setAssetList([
        assetMap[pool?.transitAssetIds?.main?.toNumber()],
        assetMap[pool?.transitAssetIds?.first?.toNumber()],
        assetMap[pool?.transitAssetIds?.second?.toNumber()],
      ]);
    }
  }, [pool]);

  useEffect(() => {
    if (lendPosition?.amountIn?.amount) {
      setCurrentBalance(
        Number(amountConversion(lendPosition?.amountIn?.amount)) || 0
      );
    } else {
      setCurrentBalance(0);
      setNewBalance(0);
    }
  }, [lendPosition]);

  const fetchAllLendByOwnerAndPool = (address, poolId) => {
    queryAllLendByOwnerAndPool(address, poolId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      const userLendsMap = result?.lends?.reduce((map, obj) => {
        map[obj?.assetId] = obj;
        return map;
      }, {});

      setAllLendByOwner(result?.lends);
      setUserLendsMap(userLendsMap);
    });
  };

  useEffect(() => {
    fetchAllLendByOwnerAndPool(address, pool?.poolId);
  }, [address, pool]);

  useEffect(() => {
    handleAssetChange(collateralAssetIdFromRoute);
  }, [collateralAssetIdFromRoute, allLendByOwner]);

  const refreshData = () => {
    setAmount();
    setBalanceRefresh(refreshBalance + 1);
  };
  const handleInputChange = (value) => {
    value = toDecimals(value, assetMap[selectedAssetId]?.decimals)
      .toString()
      .trim();

    setAmount(value);
    setNewBalance(currentBalance - Number(value));
    setSliderValue(
      (value /
        amountConversion(
          availableBalance,
          assetMap[selectedAssetId]?.decimals
        )) *
        100
    );

    setValidationError(
      ValidateInputNumber(
        getAmount(value, assetMap[selectedAssetId]?.decimals),
        availableBalance
      )
    );
  };

  const handleMaxClick = () => {
    return handleInputChange(
      amountConversion(
        Number(availableBalance),
        assetMap[selectedAssetId]?.decimals
      )
    );
  };

  const fetchPoolAssetLBMapping = (assetId, poolId) => {
    QueryPoolAssetLBMapping(assetId, poolId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }
      setLendApy(
        Number(
          decimalConversion(result?.PoolAssetLBMapping?.lendApr || 0) * 100
        ).toFixed(DOLLAR_DECIMALS)
      );
    });
  };

  const handleAssetChange = (value) => {
    setLendPosition(userLendsMap[value]);
    setSelectedAssetId(value);
    fetchPoolAssetLBMapping(value, pool?.poolId);
  };

  const handleSliderChange = (value) => {
    let percentageValue =
      (value / 100) *
      amountConversion(availableBalance, assetMap[selectedAssetId]?.decimals);

    handleInputChange(String(percentageValue));
  };

  useEffect(() => {
    fetchPoolAssetLBMapping(selectedAssetId, pool?.poolId);
  }, [selectedAssetId, pool]);

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
        <CustomRow assetList={assetList} poolId={pool?.poolId?.low} />

        <div className="assets-select-card mb-0">
          <div className="assets-left">
            <label className="left-label">Collateral Asset</label>
            <div className="assets-select-wrapper">
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
                    allLendByOwner?.length > 0 && selectedAssetId
                      ? selectedAssetId
                      : null
                  }
                  onChange={handleAssetChange}
                  placeholder={
                    <div className="select-placeholder">
                      <div className="circle-icon">
                        <div className="circle-icon-inner" />
                      </div>
                      Select
                    </div>
                  }
                  defaultActiveFirstOption={true}
                  showArrow={true}
                  // disabled
                  suffixIcon={
                    <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                  }
                  notFoundContent={<NoDataIcon />}
                >
                  {allLendByOwner?.length > 0 &&
                    allLendByOwner?.map((item) => {
                      return (
                        <Option
                          key={item?.assetId?.toNumber()}
                          value={item?.assetId?.toNumber()}
                        >
                          <div className="select-inner">
                            <div className="svg-icon">
                              <div className="svg-icon-inner">
                                <SvgIcon
                                  name={iconNameFromDenom(
                                    assetMap[item?.assetId]?.denom
                                  )}
                                />
                              </div>
                            </div>
                            <div className="name">
                              {denomConversion(assetMap[item?.assetId]?.denom)}
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
                    availableBalance,
                    assetMap[selectedAssetId]?.decimals
                  )}{" "}
                  {denomConversion(assetMap[selectedAssetId]?.denom)}
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
                  value={amount}
                  onChange={(event) => handleInputChange(event.target.value)}
                  validationError={validationError}
                />
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
                  className="commodo-slider market-slider-1"
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
            <AssetStats assetId={selectedAssetId} pool={pool} parent="lend" />

            <Row className="mt-3">
              <Col>
                <label>
                  Lend APY <TooltipIcon text="text" />
                </label>
              </Col>
              <Col className="text-right">{lendApy}%</Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn">
          <ActionButton
            name="Withdraw"
            lang={lang}
            disabled={
              !Number(amount) ||
              validationError?.message ||
              dataInProgress ||
              !selectedAssetId
            }
            amount={amount}
            address={address}
            lendId={lendPosition?.lendingId}
            denom={lendPosition?.amountIn?.denom}
            refreshData={() => refreshData()}
            assetDenomMap={assetDenomMap}
          />
        </div>
      </div>
      <div className="details-right">
        <div className="commodo-card">
          <Details
            assetId={selectedAssetId}
            assetDenom={assetMap[selectedAssetId]?.denom}
            poolId={pool?.poolId}
            parent="lend"
          />

          {/* <div className="card-head">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name='atom-icon' />
                </div>
                ATOM
              </div>
            </div>
            <div className="head-right">
              <span>Oracle Price</span> : $123.45
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
        </div>
        <div className="commodo-card withdraw-card">
          <CollateralDetails
            assetId={selectedAssetId}
            assetDenom={assetMap[selectedAssetId]?.denom}
            poolId={pool?.poolId}
            parent="lend"
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
          {/* <div className="card-head noborder">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name='atom-icon' />
                </div>
                ATOM
              </div>
            </div>
            <div className="head-right">
              <Button type="primary" className="external-btn">
                <a href={"https://app.cswap.one"} target="_blank" rel="noreferrer">
                  <span className="hyperlink-icon ml-0 mr-1">
                    {" "}
                    <SvgIcon name="hyperlink" />
                  </span>
                  Buy{" "}
                </a>
              </Button>
            </div>
          </div>
          <List
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            dataSource={data2}
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
        </div>
      </div>
    </div>
  );
};

Withdraw.propTypes = {
  lang: PropTypes.string.isRequired,
  refreshBalance: PropTypes.number.isRequired,
  setBalanceRefresh: PropTypes.func.isRequired,
  address: PropTypes.string,
  assetMap: PropTypes.object,
  assetDenomMap: PropTypes.object,
  dataInProgress: PropTypes.bool,
  markets: PropTypes.object,
  lendPosition: PropTypes.shape({
    lendingId: PropTypes.shape({
      low: PropTypes.number,
    }),
    amountIn: PropTypes.shape({
      denom: PropTypes.string,
      amount: PropTypes.string,
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
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    pool: state.lend.pool._,
    assetMap: state.asset._.map,
    balances: state.account.balances.list,
    refreshBalance: state.account.refreshBalance,
    lang: state.language,
    markets: state.oracle.market,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

const actionsToProps = {
  setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(Withdraw);
