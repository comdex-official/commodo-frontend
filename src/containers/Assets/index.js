import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table } from "antd";
import "./index.less";

const Assets = (lang) => {
  const columns = [
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: 180,
    },
    {
      title: "Balances",
      dataIndex: "balances",
      key: "balances",
      width: 150,
      className: "balance-column",
      render: (balances) => (
          <div>
            <p>{balances}</p>
            <small>$2,659</small>
          </div>
      ),
    },
    {
      title: "IBC Deposit",
      dataIndex: "ibc_deposit",
      key: "ibc_deposit",
      width: 150,
      align: "center",
      render: () => (
        <Button type="primary" size="small">
          Deposit
        </Button>
      ),
    },
    {
      title: "IBC Withdraw",
      dataIndex: "ibc_withdraw",
      key: "ibc_withdraw",
      width: 150,
      align: "center",
      render: () => (
        <Button type="primary" size="small">
          Withdraw
        </Button>
      ),
    }
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
            CMST
          </div>
        </>
      ),
      balances: "1,063.67",
    },
    {
      key: 2,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="cmdx-icon"
              />
            </div>
            CMDX
          </div>
        </>
      ),
      balances: "1,063.67",
    },
    {
      key: 3,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
              />
            </div>
            ATOM
          </div>
        </>
      ),
      balances: "1,063.67",
    },
    {
      key: 4,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="osmosis-icon"
              />
            </div>
            OSMO
          </div>
        </>
      ),
      balances: "1,063.67",
    },
    {
      key: 5,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="cmdx-icon"
              />
            </div>
            CMDX
          </div>
        </>
      ),
      balances: "1,063.67",
    },
    {
      key: 6,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
              />
            </div>
            ATOM
          </div>
        </>
      ),
      balances: "1,063.67",
    },
    {
      key: 7,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="osmosis-icon"
              />
            </div>
            OSMO
          </div>
        </>
      ),
      balances: "1,063.67",
    },
  ]
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="asset-wrapper">
            <div className="commodo-card mb-3 assetcard-head">
              <h2>Commodo Assets</h2>
              <p><span>Total Asset Balance</span> $123,456,789</p>
            </div>
            <div className="commodo-card py-3">
              <div className="card-content">
                <Table
                  className="custom-table liquidation-table"
                  dataSource={tableData}
                  columns={columns}
                  pagination={false}
                  scroll={{ x: "100%", y: "calc(100vh - 280px)" }}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Assets.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Assets);
