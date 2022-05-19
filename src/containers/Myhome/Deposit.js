import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table, Switch } from "antd";
import "./index.less";
import { Link } from "react-router-dom";

function onChange(checked) {
  console.log(`switch to ${checked}`);
}

const Deposit = (lang) => {
  const columns = [
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: 180
    },
    {
      title: <>Balance <TooltipIcon text="Balance after transaction" /></>,
      dataIndex: "balance",
      key: "balance",
      width: 150
    },
    {
      title: "APY",
      dataIndex: "apy",
      key: "apy",
      width: 150,
      render: (apy) => (
        <>{apy}%</>
      ),
    },
    {
      title: "Use as Collateral",
      dataIndex: "useas_collateral",
      key: "useas_collateral",
      width: 200,
      render: (item) => (
        <Switch onChange={() => onChange(item)} />
      ),
    },
    {
      title: "Rewards",
      dataIndex: "rewards",
      key: "rewards",
      width: 200,
      className: "rewards-column",
      render: (rewards) => (
          <div>
            <p>{rewards}</p>
            <small>$2,659</small>
          </div>
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
          <Link to="/deposit">
            <Button
              type="primary"
              className="btn-filled"
              size="small"
            >
              Diposit
            </Button>
          </Link>
          <Button
            type="primary"
            size="small"
            className="ml-2"
          >
            Withdraw
          </Button>
        </>
      ),
    },
  ];

  const tableData = [
    {
      key: 1,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="cmst-icon"
              />
            </div>
            20
          </div>
        </>
      ),
      balance: "142",
      apy: "20",
      rewards: "1234 CMST"
    },
    {
      key: 2,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="osmosis-icon"
                viewBox="0 0 30 30"
              />
            </div>
            20
          </div>
        </>
      ),
      balance: "142 ",
      apy: "20",
      rewards: "1234 OSMO"
    },
  ]

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card">
            <div className="card-header">
              MY Deposited AssetS
            </div>
            <div className="card-content">
              <Table
                className="custom-table"
                dataSource={tableData}
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
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Deposit);