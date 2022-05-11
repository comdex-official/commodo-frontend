import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table } from "antd";
import PlaceBidModal from "./PlaceBidModal";
import "./index.less";

const Liquidation = (lang) => {
  const columns = [
    {
      title: "Auctioned Asset",
      dataIndex: "auctioned_asset",
      key: "auctioned_asset",
      width: 180
    },
    {
      title: "Bridge Asset",
      dataIndex: "bridge_asset",
      key: "bridge_asset",
      width: 180
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 180
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
      width: 200,
      render: (end_time) => (
        <div className="endtime-badge">{end_time}</div>
      ),
    },
    {
      title: "Top Bid",
      dataIndex: "top_bid",
      key: "top_bid",
      width: 150,
      render: (asset_apy) => (
        <>
          {asset_apy} USCX
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
          <PlaceBidModal />
        </>
      ),
    },
  ];

  const tableData = [
    {
      key: 1,
      auctioned_asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
                viewBox="0 0 30 30"
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
                name="ust-icon"
                viewBox="0 0 30 30"
              />
            </div>
            USCX
          </div>
        </>
      ),
      quantity: "1  ATOM",
      end_time: "01D : 08H : 32M",
      top_bid: "11"
    },
    {
      key: 2,
      auctioned_asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
                viewBox="0 0 30 30"
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
                name="ust-icon"
                viewBox="0 0 30 30"
              />
            </div>
            USCX
          </div>
        </>
      ),
      quantity: "1  ATOM",
      end_time: "01D : 08H : 32M",
      top_bid: "11"
    },
    {
      key: 3,
      auctioned_asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
                viewBox="0 0 30 30"
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
                name="ust-icon"
                viewBox="0 0 30 30"
              />
            </div>
            USCX
          </div>
        </>
      ),
      quantity: "1  ATOM",
      end_time: "01D : 08H : 32M",
      top_bid: "11"
    },
    {
      key: 4,
      auctioned_asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
                viewBox="0 0 30 30"
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
                name="ust-icon"
                viewBox="0 0 30 30"
              />
            </div>
            USCX
          </div>
        </>
      ),
      quantity: "1  ATOM",
      end_time: "01D : 08H : 32M",
      top_bid: "11"
    },
    {
      key: 5,
      auctioned_asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
                viewBox="0 0 30 30"
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
                name="ust-icon"
                viewBox="0 0 30 30"
              />
            </div>
            USCX
          </div>
        </>
      ),
      quantity: "1  ATOM",
      end_time: "01D : 08H : 32M",
      top_bid: "11"
    },
    {
      key: 6,
      auctioned_asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
                viewBox="0 0 30 30"
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
                name="ust-icon"
                viewBox="0 0 30 30"
              />
            </div>
            USCX
          </div>
        </>
      ),
      quantity: "1  ATOM",
      end_time: "01D : 08H : 32M",
      top_bid: "11"
    },
    {
      key: 7,
      auctioned_asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
                viewBox="0 0 30 30"
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
                name="ust-icon"
                viewBox="0 0 30 30"
              />
            </div>
            USCX
          </div>
        </>
      ),
      quantity: "1  ATOM",
      end_time: "01D : 08H : 32M",
      top_bid: "11"
    },
    {
      key: 8,
      auctioned_asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
                viewBox="0 0 30 30"
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
                name="ust-icon"
                viewBox="0 0 30 30"
              />
            </div>
            USCX
          </div>
        </>
      ),
      quantity: "1  ATOM",
      end_time: "01D : 08H : 32M",
      top_bid: "11"
    },
  ]
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card py-3">
            <div className="card-content">
              <Table
                className="custom-table liquidation-table"
                dataSource={tableData}
                columns={columns}
                pagination={{ defaultPageSize: 10 }}
                scroll={{ x: "100%" }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Liquidation.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Liquidation);
