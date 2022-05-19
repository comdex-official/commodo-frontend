import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table } from "antd";
import PlaceBidModal from "./PlaceBidModal";
import "./index.less";
import FilterModal from "./FilterModal";

const Liquidation = (lang) => {
  const columns = [
    {
      title: <>Auctioned Asset <TooltipIcon text="" /></>,
      dataIndex: "auctioned_asset",
      key: "auctioned_asset",
      width: 180
    },
    {
      title: <>Bridge Asset <TooltipIcon text="" /></>,
      dataIndex: "bridge_asset",
      key: "bridge_asset",
      width: 180
    },
    {
      title: <>Quantity <TooltipIcon text="" /></>,
      dataIndex: "quantity",
      key: "quantity",
      width: 180
    },
    {
      title: <>End Time <TooltipIcon text="" /></>,
      dataIndex: "end_time",
      key: "end_time",
      width: 200,
      render: (end_time) => (
        <div className="endtime-badge">{end_time}</div>
      ),
    },
    {
      title: <>Top Bid <TooltipIcon text="" /></>,
      dataIndex: "top_bid",
      key: "top_bid",
      width: 150,
      render: (asset_apy) => (
        <>
          {asset_apy} CMST
        </>
      ),
    },
    {
      title: <FilterModal />,
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 140,
      align: "center",
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
                name="cmst-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMST
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
                name="cmst-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMST
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
                name="cmst-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMST
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
                name="cmdx-icon"
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
                name="cmst-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMST
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
                name="cmdx-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMDX
          </div>
        </>
      ),
      bridge_asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="cmst-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMST
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
                name="cmdx-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMDX
          </div>
        </>
      ),
      bridge_asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="cmst-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMST
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
                name="cmdx-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMDX
          </div>
        </>
      ),
      bridge_asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="cmst-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMST
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
                name="cmst-icon"
                viewBox="0 0 30 30"
              />
            </div>
            CMST
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
