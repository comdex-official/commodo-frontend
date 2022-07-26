import { Button, message, Select, Spin } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { Col, Row, SvgIcon, TooltipIcon } from "../../../../components/common";
import CustomRow from "../../../../components/common/Asset/CustomRow";
import Details from "../../../../components/common/Asset/Details";
import AssetStats from "../../../../components/common/Asset/Stats";
import Snack from "../../../../components/common/Snack";
import CustomInput from "../../../../components/CustomInput";
import HealthFactor from "../../../../components/HealthFactor";
import { comdex } from "../../../../config/network";
import { ValidateInputNumber } from "../../../../config/_validation";
import {
  DEFAULT_FEE,
  DOLLAR_DECIMALS,
  UC_DENOM
} from "../../../../constants/common";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import {
  queryAssetPairs,
  queryLendPair
} from "../../../../services/lend/query";
import { defaultFee } from "../../../../services/transaction";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion,
  getAmount
} from "../../../../utils/coin";
import { commaSeparator, marketPrice } from "../../../../utils/number";
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

  const navigate = useNavigate();

  let collateralAssetDenom = assetMap[lend?.assetId]?.denom;
  let borrowAssetDenom = assetMap[pair?.assetOut]?.denom;
  const firstBridgeAssetDenom = assetMap[pool?.firstBridgedAssetId]?.denom;

  const availableBalance = lend?.availableToBorrow || 0;

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

  const handleCollateralAssetChange = (lendingId) => {
    const selectedLend = poolLendPositions.filter(
      (item) => item?.lendingId?.toNumber() === lendingId
    )[0];

    if (selectedLend?.assetId) {
      setLend(selectedLend);
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
  };

  const handleInAmountChange = (value) => {
    value = toDecimals(value).toString().trim();

    setInAmount(value);
    setValidationError(ValidateInputNumber(getAmount(value), availableBalance));
  };

  const handleOutAmountChange = (value) => {
    value = toDecimals(value).toString().trim();

    setOutAmount(value);
    setBorrowValidationError(ValidateInputNumber(getAmount(value)));
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
              denom: UC_DENOM.concat(collateralAssetDenom.substring(1)),
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
    if (collateralAssetDenom === comdex.coinMinimalDenom) {
      return Number(availableBalance) > DEFAULT_FEE
        ? handleInAmountChange(amountConversion(availableBalance - DEFAULT_FEE))
        : handleInAmountChange();
    } else {
      return handleInAmountChange(amountConversion(availableBalance));
    }
  };

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
                                {"cPool-" + record?.cpoolName.split("-")?.[0]})
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
            <HealthFactor />
            <Row>
              <Col sm="12" className="mt-3 mx-auto card-bottom-details">
                <AssetStats assetId={pair?.assetOut} />
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
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.shape({
        low: PropTypes.number,
      }),
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
    markets: state.oracle.market.list,
    poolLendPositions: state.lend.poolLends,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(BorrowTab);
