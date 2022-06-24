import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../../../components/common";
import { connect } from "react-redux";
import { Button, List, Select, message, Spin } from "antd";
import "./index.less";
import {
  amountConversionWithComma,
  denomConversion,
  getAmount,
  getDenomBalance,
} from "../../../../utils/coin";
import { iconNameFromDenom, toDecimals } from "../../../../utils/string";
import { useEffect, useState } from "react";
import CustomInput from "../../../../components/CustomInput";
import { ValidateInputNumber } from "../../../../config/_validation";
import { signAndBroadcastTransaction } from "../../../../services/helper";
import variables from "../../../../utils/variables";
import Snack from "../../../../components/common/Snack";
import { defaultFee } from "../../../../services/transaction";
import Long from "long";

const { Option } = Select;

const DepositTab = ({
  lang,
  dataInProgress,
  pool,
  assetMap,
  balances,
  address,
}) => {
  const [assetList, setAssetList] = useState();
  const [selectedAssetId, setSelectedAssetId] = useState();
  const [amount, setAmount] = useState();
  const [validationError, setValidationError] = useState();
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    if (pool?.poolId) {
      setAssetList([
        assetMap[pool?.mainAssetId?.toNumber()],
        assetMap[pool?.firstBridgedAssetId?.toNumber()],
        assetMap[pool?.secondBridgedAssetId?.toNumber()],
      ]);
    }
  }, [pool]);

  const data = [
    {
      title: "Total Deposited",
      counts: "$1,234.20",
    },
    {
      title: "Available",
      counts: "$1,234.20",
    },
    {
      title: "Utilization",
      counts: "30.45%",
    },
    {
      title: "Deposit APY",
      counts: "8.92%",
    },
  ];
  const data2 = [
    {
      title: "Total Deposited",
      counts: "$1,234.20",
    },
    {
      title: "Available",
      counts: "$1,234.20",
    },
    {
      title: "Utilization",
      counts: "30.45%",
    },
    {
      title: "Deposit APY",
      counts: "7.24%",
    },
  ];
  const data3 = [
    {
      title: "Total Deposited",
      counts: "$1,234.20",
    },
    {
      title: "Available",
      counts: "$1,234.20",
    },
    {
      title: "Utilization",
      counts: "30.45%",
    },
    {
      title: "Deposit APY",
      counts: "6.38%",
    },
  ];

  const handleAssetChange = (value) => {
    setSelectedAssetId(value);
  };

  const onChange = (value) => {
    value = toDecimals(value).toString().trim();

    setAmount(value);
    setValidationError(
      ValidateInputNumber(
        getAmount(value),
        getDenomBalance(balances, assetMap[selectedAssetId]?.denom) || 0
      )
    );
  };

  const handleClick = () => {
    setInProgress(true);

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.lend.v1beta1.MsgLend",
          value: {
            lender: address,
            poolId: pool?.poolId,
            assetId: Long.fromNumber(selectedAssetId),
            amount: {
              amount: getAmount(amount),
              denom: assetMap[selectedAssetId]?.denom,
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
      }
    );
  };

  return (
    <div className="details-wrapper">
      {!dataInProgress ? (
        <>
          <div className="details-left commodo-card">
            <div className="deposit-head">
              <div className="deposit-head-left">
                {assetList?.length > 0 &&
                  assetList?.map((item) => (
                    <div className="assets-col mr-3" key={item?.denom}>
                      <div className="assets-icon">
                        <SvgIcon name={iconNameFromDenom(item?.denom)} />
                      </div>
                      {denomConversion(item?.denom)}
                    </div>
                  ))}
              </div>
            </div>
            <div className="assets-select-card mb-0">
              <div className="assets-left">
                <label className="left-label">
                  Deposit <TooltipIcon text="" />
                </label>
                <div className="assets-select-wrapper">
                  <Select
                    className="assets-select"
                    dropdownClassName="asset-select-dropdown"
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
                      getDenomBalance(
                        balances,
                        assetMap[selectedAssetId]?.denom
                      ) || 0
                    )}{" "}
                    {denomConversion(assetMap[selectedAssetId]?.denom)}
                  </span>
                  <div className="max-half">
                    <Button className="active">Max</Button>
                  </div>
                </div>
                <div>
                  <div className="input-select">
                    <CustomInput
                      value={amount}
                      onChange={(event) => onChange(event.target.value)}
                      validationError={validationError}
                    />
                  </div>
                  <small>$120.00</small>
                </div>
              </div>
            </div>
            <Row>
              <Col sm="12" className="mt-3 mx-auto card-bottom-details">
                <Row className="mt-2">
                  <Col>
                    <label>Max LTV</label>
                  </Col>
                  <Col className="text-right">85%</Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <label>Liquidation Threshold</label>
                  </Col>
                  <Col className="text-right">80%</Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <label>Liquidation Penalty</label>
                  </Col>
                  <Col className="text-right">5%</Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <label>Current LTV</label>
                  </Col>
                  <Col className="text-right">35%</Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <label>Deposit APY</label>
                  </Col>
                  <Col className="text-right">3.80%</Col>
                </Row>
              </Col>
            </Row>
            <div className="assets-form-btn">
              <Button
                type="primary"
                className="btn-filled"
                loading={inProgress}
                disabled={!Number(amount) || inProgress || !selectedAssetId}
                onClick={handleClick}
              >
                Deposit
              </Button>
            </div>
          </div>
          <div className="details-right">
            <div className="commodo-card">
              <div className="card-head">
                <div className="head-left">
                  <div className="assets-col">
                    <div className="assets-icon">
                      <SvgIcon name="cmst-icon" />
                    </div>
                    CMST
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
                  md: 2,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <div>
                      <p>
                        {item.title} <TooltipIcon />
                      </p>
                      <h3>{item.counts}</h3>
                    </div>
                  </List.Item>
                )}
              />
              <div className="card-head mt-5">
                <div className="head-left">
                  <div className="assets-col">
                    <div className="assets-icon">
                      <SvgIcon name="atom-icon" />
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
                  md: 2,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                dataSource={data2}
                renderItem={(item) => (
                  <List.Item>
                    <div>
                      <p>
                        {item.title} <TooltipIcon />
                      </p>
                      <h3>{item.counts}</h3>
                    </div>
                  </List.Item>
                )}
              />
            </div>
            <div className="commodo-card">
              <div className="card-head">
                <div className="head-left">
                  <div className="assets-col">
                    <div className="assets-icon">
                      <SvgIcon name="osmosis-icon" />
                    </div>
                    OSMO
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
                  md: 2,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                dataSource={data3}
                renderItem={(item) => (
                  <List.Item>
                    <div>
                      <p>
                        {item.title} <TooltipIcon />{" "}
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

DepositTab.propTypes = {
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
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(DepositTab);
