import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../../../components/common";
import { connect } from "react-redux";
import { Button, List, Select, Input, Tooltip, message, Spin } from "antd";
import "./index.less";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../../utils/coin";
import { iconNameFromDenom, toDecimals } from "../../../../utils/string";
import { ValidateInputNumber } from "../../../../config/_validation";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import Long from "long";
import { defaultFee } from "../../../../services/transaction";
import Snack from "../../../../components/common/Snack";
import variables from "../../../../utils/variables";
import { comdex } from "../../../../config/network";
import { DEFAULT_FEE, DOLLAR_DECIMALS } from "../../../../constants/common";
import CustomRow from "../../../../components/common/Asset/CustomRow";
import CustomInput from "../../../../components/CustomInput";
import AssetStats from "../../../../components/common/Asset/Stats";
import Details from "../../../../components/common/Asset/Details";
import { commaSeparator, marketPrice } from "../../../../utils/number";

const { Option } = Select;

const BorrowTab = ({
  lang,
  dataInProgress,
  pool,
  assetMap,
  balances,
  address,
  markets,
}) => {
  const [assetList, setAssetList] = useState();
  const [collateralAssetId, setCollateralAssetId] = useState();
  const [borrowAssetId, setBorrowAssetId] = useState();
  const [amount, setAmount] = useState();
  const [validationError, setValidationError] = useState();
  const [inProgress, setInProgress] = useState(false);
  const navigate = useNavigate();

  let collateralAssetDenom = assetMap[collateralAssetId]?.denom;
  let borrowAssetDenom = assetMap[borrowAssetId]?.denom;
  const firstBridgeAssetDenom = assetMap[pool?.firstBridgedAssetId]?.denom;

  const availableBalance = getDenomBalance(balances, collateralAssetDenom) || 0;

  useEffect(() => {
    if (pool?.poolId) {
      setAssetList([
        assetMap[pool?.mainAssetId?.toNumber()],
        assetMap[pool?.firstBridgedAssetId?.toNumber()],
        assetMap[pool?.secondBridgedAssetId?.toNumber()],
      ]);
    }
  }, [pool]);

  const handleCollateralAssetChange = (value) => {
    setCollateralAssetId(value);
  };

  const handleBorrowAssetChange = (value) => {
    setBorrowAssetId(value);
  };

  const handleInputChange = (value) => {
    value = toDecimals(value).toString().trim();

    setAmount(value);
    setValidationError(ValidateInputNumber(getAmount(value), availableBalance));
  };

  const handleClick = () => {
    setInProgress(true);

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.lend.v1beta1.MsgBorrow",
          value: {
            borrower: address,
            //TODO: update the values dynamically
            lendId: Long.fromNumber(1),
            pairId: Long.fromNumber(1),
            isStableBorrow: false,
            amountIn: {
              amount: getAmount(amount),
              denom: collateralAssetDenom,
            },
            amountOut: {
              amount: getAmount(amount),
              denom: collateralAssetDenom,
            },
          },
        },
        fee: defaultFee(),
        memo: "",
      },
      address,
      (error, result) => {
        setInProgress(false);
        setAmount(0);
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

        navigate("/myhome");
      }
    );
  };

  const handleMaxClick = () => {
    if (collateralAssetDenom === comdex.coinMinimalDenom) {
      return Number(availableBalance) > DEFAULT_FEE
        ? handleInputChange(amountConversion(availableBalance - DEFAULT_FEE))
        : handleInputChange();
    } else {
      return handleInputChange(amountConversion(availableBalance));
    }
  };

  const TooltipContent = (
    <div className="token-details">
      <div className="tokencard-col">
        <div className="tokencard">
          <div className="tokencard-icon">
            <SvgIcon name="cmdx-icon" />
          </div>
          <p>Deposit {denomConversion(collateralAssetDenom)}</p>
        </div>
        <div className="tokencard with-shadow">
          <div className="tokencard-icon">
            <SvgIcon name="cmst-icon" />
          </div>
          <p>Borrow {denomConversion(firstBridgeAssetDenom)}</p>
        </div>
        <label>Token A</label>
      </div>
      <div className="middle-arrow">
        <SvgIcon name="token-arrow" viewbox="0 0 159 80.387" />
      </div>
      <div className="tokencard-col">
        <div className="tokencard with-shadow">
          <div className="tokencard-icon">
            <SvgIcon name="cmst-icon" />
          </div>
          <p>Deposit {denomConversion(firstBridgeAssetDenom)}</p>
        </div>
        <div className="tokencard">
          <div className="tokencard-icon">
            <SvgIcon name="osmosis-icon" />
          </div>
          <p>Borrow {denomConversion(borrowAssetDenom)}</p>
        </div>
        <label>Token B</label>
      </div>
    </div>
  );

  return (
    <div className="details-wrapper">
      {!dataInProgress ? (
        <>
          <div className="details-left commodo-card">
            <CustomRow assetList={assetList} />
            <div className="assets-select-card mb-3">
              <div className="assets-left">
                <label className="left-label">
                  Collateral Asset <TooltipIcon text="" />
                </label>
                <div className="assets-select-wrapper">
                  <Select
                    className="assets-select"
                    dropdownClassName="asset-select-dropdown"
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
                  >
                    {assetList?.length > 0 &&
                      assetList?.map((record) => {
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
                                {denomConversion(item)}
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
                      getDenomBalance(balances, collateralAssetDenom) || 0
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
                      value={amount}
                      onChange={(event) =>
                        handleInputChange(event.target.value)
                      }
                      validationError={validationError}
                    />
                  </div>
                  <small>
                    $
                    {commaSeparator(
                      Number(amount) *
                        marketPrice(markets, collateralAssetDenom),
                      DOLLAR_DECIMALS
                    )}
                  </small>
                </div>
              </div>
            </div>
            <div className="assets-select-card mb-2">
              <div className="assets-left">
                <label className="left-label">
                  Borrow Asset <TooltipIcon text="" />
                </label>
                <div className="assets-select-wrapper">
                  <Select
                    className="assets-select"
                    dropdownClassName="asset-select-dropdown"
                    onChange={handleBorrowAssetChange}
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
                                {denomConversion(item)}
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
              <div className="assets-right">
                <div>
                  <div className="input-select">
                    <Input placeholder="" value="23.00" disabled />
                  </div>
                  <small>$120.00</small>
                </div>
              </div>
            </div>
            <Row>
              <Col>
                <Tooltip
                  placement="right"
                  color="#173629"
                  title={TooltipContent}
                  overlayClassName="token-overlay"
                >
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
                              name={iconNameFromDenom(firstBridgeAssetDenom)}
                            />
                          </div>
                          <p>{denomConversion(firstBridgeAssetDenom)}</p>
                        </div>
                      </div>
                    </div>
                    <SvgIcon
                      className="longarrow-icon-middle"
                      name="long-arrow"
                      viewbox="0 0 64 5.774"
                    />
                    <div className="cards">
                      <div className="cards-inner">
                        <div className="cards-colum">
                          <div className="inner-icon">
                            <SvgIcon
                              name={iconNameFromDenom(firstBridgeAssetDenom)}
                            />
                          </div>
                          <p>{denomConversion(firstBridgeAssetDenom)}</p>
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
                </Tooltip>
              </Col>
            </Row>
            <Row>
              <Col sm="12" className="mt-3 mx-auto card-bottom-details">
                <AssetStats assetId={borrowAssetId} />
              </Col>
            </Row>
            <div className="assets-form-btn">
              <Button
                type="primary"
                className="btn-filled"
                loading={inProgress}
                disabled={!Number(amount) || inProgress || !collateralAssetId}
                onClick={handleClick}
              >
                Borrow
              </Button>
            </div>
          </div>
          <div className="details-right">
            <div className="commodo-card">
              <Details
                asset={assetMap[pool?.firstBridgedAssetId?.toNumber()]}
                poolId={pool?.poolId}
                parent="borrow"
              />
              <div className="mt-5">
                <Details
                  asset={assetMap[pool?.secondBridgedAssetId?.toNumber()]}
                  poolId={pool?.poolId}
                  parent="borrow"
                />
              </div>
            </div>
            <div className="commodo-card">
              <Details
                asset={assetMap[pool?.mainAssetId?.toNumber()]}
                poolId={pool?.poolId}
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
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
      amount: PropTypes.string,
    })
  ),
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.string,
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
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    pool: state.lend.pool._,
    assetMap: state.asset._.map,
    balances: state.account.balances.list,
    lang: state.language,
    markets: state.oracle.market.list,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(BorrowTab);
