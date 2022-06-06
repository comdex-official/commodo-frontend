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
      width: 120
    },
    {
      title: <>Bridge <br /> Asset 1</>,
      dataIndex: "bridge_asset",
      key: "bridge_asset",
      width: 120
    },
    {
      title: <>Bridge <br /> Asset 2</>,
      dataIndex: "bridge_asset2",
      key: "bridge_asset2",
      width: 120
    },
    {
      title: <>Total <br /> Deposited</>,
      dataIndex: "total_deposited",
      key: "total_deposited",
      width: 130,
      render: (total_deposited) => (
        <>$ {total_deposited}</>
      ),
    },
    {
      title: <>Asset <br /> APY</>,
      dataIndex: "asset_apy",
      key: "asset_apy",
      width: 110,
      render: (asset_apy) => (
        <>
          <div>{asset_apy}%</div>
        </>
      ),
    },
    {
      title: <>Bridge Asset 1 <br /> APY</>,
      dataIndex: "bridge_apy",
      key: "bridge_apy",
      width: 120,
      render: (bridge_apy) => (
        <>
          <div>{bridge_apy}%</div>
        </>
      ),
    },
    {
      title: <>Bridge Asset 2 <br /> APY</>,
      dataIndex: "bridge_apy2",
      key: "bridge_apy2",
      width: 110,
      render: (bridge_apy) => (
        <>
          <div>{bridge_apy}%</div>
        </>
      ),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 120,
      render: () => (
        <>
          <Link to='/supply-details'><Button
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
      width: 120
    },
    {
      title: <>Bridge <br /> Asset 1</>,
      dataIndex: "bridge_asset",
      key: "bridge_asset",
      width: 120
    },
    {
      title: <>Bridge <br />  Asset 2</>,
      dataIndex: "bridge_asset2",
      key: "bridge_asset2",
      width: 120
    },
    {
      title: <>Available to <br /> Borrow</>,
      dataIndex: "total_deposited",
      key: "total_deposited",
      width: 130,
      render: (total_deposited) => (
        <>$ {total_deposited}</>
      ),
    },
    {
      title: <>Asset <br /> APY</>,
      dataIndex: "asset_apy",
      key: "asset_apy",
      width: 100,
      render: (asset_apy) => (
        <>
          <div>{asset_apy}% </div>
        </>
      ),
    },
    {
      title: <>Bridge Asset 1 <br /> APY</>,
      dataIndex: "bridge_apy",
      key: "bridge_apy",
      width: 140,
    },
    {
      title: <>Bridge Asset 2 <br /> APY</>,
      dataIndex: "bridge_apy2",
      key: "bridge_apy2",
      width: 110,
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 120,
      render: () => (
        <>
          <Link to='/borrow-details'><Button
            type="primary"
            size="small"
          >
            Details
          </Button></Link>
        </>
      ),
    },
  ];

  const tableDataSupply = [
    {
      key: 1,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="cmdx-icon"
              />
            </div>
            CDMX
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
      bridge_asset2: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
              />
            </div>
            Atom
          </div>
        </>
      ),
      total_deposited: "18,233,765",
      asset_apy: "7.88",
      bridge_apy: "8.92",
      bridge_apy2: "7.24",
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
      bridge_asset2: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
              />
            </div>
            Atom
          </div>
        </>
      ),
      total_deposited: "11,975,385",
      asset_apy: "6.38",
      bridge_apy: "8.92",
      bridge_apy2: "7.29",
    },
  ];

  const tableDataBorrow = [
    {
      key: 1,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="cmdx-icon"
              />
            </div>
            CDMX
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
      bridge_asset2: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
              />
            </div>
            Atom
          </div>
        </>
      ),
      total_deposited: "8,256,335",
      asset_apy: "12.76",
      bridge_apy: <div className="d-flex align-items-center">12.33% <div className="apy-percents">+6.18% <SvgIcon name="cmdx-icon" /></div></div>,
      bridge_apy2: "13.33%",
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
      bridge_asset2: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
              />
            </div>
            Atom
          </div>
        </>
      ),
      total_deposited: "4,358,675",
      asset_apy: "11.56",
      bridge_apy: "12.33%",
      bridge_apy2: <div className="d-flex align-items-center">13.33% <div className="apy-percents">+6.18% <SvgIcon name="cmdx-icon" /></div></div>,
    },
  ]
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card bg-none">
            <div className="card-header">
              AssetS to supply
            </div>
            <div className="card-content">
              <Table
                className="custom-table market-table1"
                dataSource={tableDataSupply}
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
          <div className="commodo-card bg-none">
            <div className="card-header">
              AssetS to BORROW
            </div>
            <div className="card-content">
              <Table
                className="custom-table market-table2"
                dataSource={tableDataBorrow}
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
