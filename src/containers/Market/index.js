import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table } from "antd";
import "./index.less";
import { Link } from "react-router-dom";

const Market = (lang) => {
  const columns = [
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: 180
    },
    {
      title: "Bridge Asset",
      dataIndex: "bridge_asset",
      key: "bridge_asset",
      width: 180
    },
    {
      title: "Total Deposited",
      dataIndex: "total_deposited",
      key: "total_deposited",
      width: 150,
      render: (total_deposited) => (
        <>$ {total_deposited}</>
      ),
    },
    {
      title: "Asset APY",
      dataIndex: "asset_apy",
      key: "asset_apy",
      width: 150,
      render: (asset_apy) => (
        <>
          <div>{asset_apy}% <div className="apy-percents">+6.18% <SvgIcon name="commodo-icon" /></div></div>
        </>
      ),
    },
    {
      title: "Bridge APY",
      dataIndex: "bridge_apy",
      key: "bridge_apy",
      width: 150,
      render: (bridge_apy) => (
        <>
          <div>{bridge_apy}% <div className="apy-percents">+6.18% <SvgIcon name="commodo-icon" /></div></div>
        </>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 140,
      render: () => (
        <>
          <Link to='/deposit'><Button
            type="primary"
            size="small"
          >
            Details
          </Button></Link>
        </>
      ),
    },
  ];

  const Borrowcolumns = [
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: 180
    },
    {
      title: "Bridge Asset",
      dataIndex: "bridge_asset",
      key: "bridge_asset",
      width: 180
    },
    {
      title: "Total Deposited",
      dataIndex: "total_deposited",
      key: "total_deposited",
      width: 150,
      render: (total_deposited) => (
        <>$ {total_deposited}</>
      ),
    },
    {
      title: "Asset APY",
      dataIndex: "asset_apy",
      key: "asset_apy",
      width: 150,
      render: (asset_apy) => (
        <>
          <div>{asset_apy}% <div className="apy-percents">+6.18% <SvgIcon name="commodo-icon" viewbox="commodo-icon" /></div></div>
        </>
      ),
    },
    {
      title: "Bridge APY",
      dataIndex: "bridge_apy",
      key: "bridge_apy",
      width: 150,
      render: (bridge_apy) => (
        <>
          <div>{bridge_apy}% <div className="apy-percents">+6.18% <SvgIcon name="commodo-icon" viewbox="commodo-icon" /></div></div>
        </>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 140,
      render: () => (
        <>
          <Link to='/borrow'><Button
            type="primary"
            size="small"
          >
            Details
          </Button></Link>
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
                name="atom-icon"
              />
            </div>
            ATOM
          </div>
        </>
      ),
      bridge_asset: (
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
      total_deposited: "1,234.67",
      asset_apy: "4.9",
      bridge_apy: "4.99"
    },
    {
      key: 2,
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
      bridge_asset: (
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
      total_deposited: "1,234.67",
      asset_apy: "4.9",
      bridge_apy: "4.99"
    },
    {
      key: 3,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="ust-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMST
          </div>
        </>
      ),
      bridge_asset: (
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
      total_deposited: "1,234.67",
      asset_apy: "4.9",
      bridge_apy: "4.99"
    },
  ]
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card">
            <div className="card-header">
              AssetS to supply
            </div>
            <div className="card-content">
              <Table
                className="custom-table market-table1"
                dataSource={tableData}
                columns={columns}
                pagination={false}
                scroll={{ x: "100%", y: "30vh" }}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <div className="commodo-card">
            <div className="card-header">
              AssetS to BORROW
            </div>
            <div className="card-content">
              <Table
                className="custom-table market-table2"
                dataSource={tableData}
                columns={Borrowcolumns}
                pagination={false}
                scroll={{ x: "100%", y: "30vh" }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Market.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Market);
