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

const WithdrawTab = ({
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

      const rs1 =
        process.env.REACT_APP_D_POOL === "open"
          ? result?.lends.filter((item) => Number(item?.poolId) !== 1)
          : result?.lends;

      const userLendsMap = rs1?.reduce((map, obj) => {
        map[obj?.assetId] = obj;
        return map;
      }, {});

      setAllLendByOwner(rs1);
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

  const marks = {
    0: "0%",
    100: "100%",
  };

  console.log(assetMap[selectedAssetId], selectedAssetId);

  return (
    <div className="details-wrapper market-details-wrapper">
      <div className="details-left commodo-card">
        <CustomRow assetList={assetList} poolId={pool?.poolId?.low} />
        <div className="assets-select-card mb-0">
          <div className="assets-left">
            <label className="left-label">Withdraw</label>
            <div className="assets-select-wrapper">
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
          <div className="assets-right">
            <div className="label-right">
              Available
              <TooltipIcon text="Available to withdraw" />
              <span className="ml-1">
                {amountConversionWithComma(
                  availableBalance,
                  assetMap[selectedAssetId]?.decimals
                )}{" "}
                {denomConversion(assetMap[selectedAssetId]?.denom)}
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
            <Row className="mt-3">
              <Col sm="12">
                <Slider
                  marks={marks}
                  value={sliderValue}
                  tooltip={{ open: false }}
                  onChange={handleSliderChange}
                  className="commodo-slider market-slider-1"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <AssetStats
                  assetId={selectedAssetId}
                  pool={pool}
                  parent="lend"
                />
              </Col>
            </Row>
            <Row className="mt-3 lastrow-market-dtl">
              <Col>
                <label>Lend APY</label>
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
        </div>
        <div className="commodo-card">
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
        </div>
      </div>
    </div>
  );
};

WithdrawTab.propTypes = {
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

export default connect(stateToProps, actionsToProps)(WithdrawTab);
