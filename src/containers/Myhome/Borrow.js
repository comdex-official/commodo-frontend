import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { connect } from "react-redux";
import { Button, Table, Progress, message } from "antd";
import { Link } from "react-router-dom";
import "./index.less";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { setUserBorrows } from "../../actions/lend";
import { queryUserBorrows } from "../../services/lend/query";

const Borrow = ({ address, setUserBorrows, userBorrowList }) => {
  const [inProgress, setInProgress] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUserBorrows([]);
  }, []);

  useEffect(() => {
    if (address) {
      fetchUserBorrows();
    }
  }, [address]);

  const fetchUserBorrows = () => {
    setInProgress(true);
    queryUserBorrows(address, (error, result) => {
      setInProgress(false);

      if (error) {
        message.error(error);
        return;
      }

      console.log("the resur", result);
      if (result?.borrows?.length > 0) {
        setUserBorrows(result?.borrows);
      }
    });
  };

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
          Debt <TooltipIcon text="Current Outstanding Debt" />
        </>
      ),
      dataIndex: "debt",
      key: "debt",
      width: 150,
    },
    {
      title: "APY",
      dataIndex: "apy",
      key: "apy",
      width: 110,
      render: (apy) => <>{apy}%</>,
    },
    {
      title: "Health",
      dataIndex: "health",
      key: "health",
      width: 300,
      align: "center",
      render: (text) => (
        <Progress
          className="health-progress"
          style={{ width: 150 }}
          percent={text}
          size="small"
        />
      ),
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
            <Link to="/borrow">
              <Button type="primary" className="btn-filled" size="small">
                Borrow
              </Button>
            </Link>
            <Link to="/borrow">
              <Button type="primary" size="small" className="ml-2">
                Repay
              </Button>
            </Link>
          </div>
        </>
      ),
    },
  ];

  const tableData = [
    {
      key: 1,
      asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name="cmst-icon" viewBox="0 0 30 30" />
            </div>
            CMST
          </div>
        </>
      ),
      debt: "142 CMST",
      apy: "13.33",
      health: "36",
    },
    {
      key: 1,
      asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name="osmosis-icon" viewBox="0 0 30 30" />
            </div>
            OSMO
          </div>
        </>
      ),
      debt: "159 OSMO",
      apy: "11.56",
      health: "20",
    },
  ];

  console.log("borrows", userBorrowList);
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card bg-none">
            <div className="card-header">MY Borrowed AssetS</div>
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

Borrow.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  userBorrowList: PropTypes.arrayOf(
    PropTypes.shape({
      amountIn: PropTypes.shape({
        denom: PropTypes.string.isRequired,
        amount: PropTypes.string,
      }),
      assetId: PropTypes.shape({
        low: PropTypes.number,
      }),
      poolId: PropTypes.shape({
        low: PropTypes.number,
      }),
      rewardAccumulated: PropTypes.string,
    })
  ),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    userBorrowList: state.lend.userBorrows,
  };
};

const actionsToProps = {
  setUserBorrows,
};

export default connect(stateToProps, actionsToProps)(Borrow);
