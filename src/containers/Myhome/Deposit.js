import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { connect } from "react-redux";
import {Button, Table, Switch, message} from "antd";
import "./index.less";
import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import {queryUserLends} from "../../services/lend/query";
import {iconNameFromDenom} from "../../utils/string";
import { amountConversionWithComma, denomConversion} from "../../utils/coin";

const Deposit = ({address}) => {
  const [inProgress, setInProgress] = useState(false);
  const [lendList, setUserLendList] = useState();

  useEffect(()=>{
    if(address){
      setInProgress(true);
      queryUserLends(address, (error, result) => {
        setInProgress(false)
        if(error){
          message.error(error)
        }

    if(result?.lends?.length>0){
      setUserLendList(result.lends)
    }
      })

    }
  },[address])

  const columns = [
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: 180,
    },
    {
      title: (
        <>
          Available <TooltipIcon text="Balance after transaction" />
        </>
      ),
      dataIndex: "available",
      key: "available",
      width: 250,
    },
    {
      title: "APY",
      dataIndex: "apy",
      key: "apy",
      width: 150,
      render: (apy) => <>{apy}%</>,
    },
    {
      title: "Use as Collateral",
      dataIndex: "use_as_collateral",
      key: "use_as_collateral",
      width: 200,
      render: (item) => <Switch className="readonlyswitch" onChange={() => onChange(item)} />,
    },
    {
      title: "Rewards",
      dataIndex: "rewards",
      key: "rewards",
      width: 200,
      className: "rewards-column",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 200,
      render: () => (
        <>
          <div className="d-flex">
            <Link to="/deposit">
              <Button
                type="primary"
                className="btn-filled table-btn"
                size="small"
              >
                Deposit
              </Button>
            </Link>
            <Link to="/deposit">
              <Button type="primary" size="small" className="ml-2 table-btn">
                Withdraw
              </Button>
            </Link>
          </div>
        </>
      ),
    },
  ];

  const tableData =
      lendList?.length > 0
          ? lendList?.map((item, index) => {
            return {
              key: index,
              asset: (
                  <>
                    <div className="assets-with-icon">
                      <div className="assets-icon">
                        <SvgIcon
                            name={iconNameFromDenom(item?.amountIn?.denom)}
                        />
                      </div>
                      {denomConversion(item?.amountIn?.denom)}
                    </div>
                  </>
              ),
              available:<> {amountConversionWithComma(item?.amountIn?.amount)} {denomConversion(item?.amountIn?.denom)}</>,
              apy: "8.92",
              rewards: <>{amountConversionWithComma(item?.rewardAccumulated)} {denomConversion(item?.amountIn?.denom)}</>,
              action: item,
            };
          })
          : [];

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card bg-none">
            <div className="card-header">MY Deposited Assets</div>
            <div className="card-content">
              <Table
                className="custom-table"
                dataSource={tableData}
                loading={inProgress}
                columns={columns}
                pagination={false}
                scroll={{ x: "100%" }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Deposit.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(Deposit);
