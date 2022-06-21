import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { connect } from "react-redux";
import { Table } from "antd";
import PlaceBidModal from "./PlaceBidModal";
import "./index.less";
import FilterModal from "./FilterModal";

const Liquidation = () => {
  const columns = [
    {
      title: (
        <>
          Auctioned Asset <TooltipIcon text="" />
        </>
      ),
      dataIndex: "auctioned_asset",
      key: "auctioned_asset",
      width: 180,
    },
    {
      title: (
        <>
          Bidding Asset <TooltipIcon text="" />
        </>
      ),
      dataIndex: "bidding_asset",
      key: "bidding_asset",
      width: 180,
    },
    {
      title: (
        <>
          Quantity <TooltipIcon text="" />
        </>
      ),
      dataIndex: "quantity",
      key: "quantity",
      width: 180,
    },
    {
      title: (
        <>
          End Time <TooltipIcon text="" />
        </>
      ),
      dataIndex: "end_time",
      key: "end_time",
      width: 200,
      render: (end_time) => <div className="endtime-badge">{end_time}</div>,
    },
    {
      title: (
        <>
          Top Bid <TooltipIcon text="" />
        </>
      ),
      dataIndex: "top_bid",
      key: "top_bid",
      width: 150,
      render: (asset_apy) => <>{asset_apy}</>,
    },
    {
      title: <FilterModal />,
      dataIndex: "action",
      key: "action",
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
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name="cmdx-icon" viewBox="0 0 30 30" />
            </div>
            CMDX
          </div>
        </>
      ),
      bidding_asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name="cmst-icon" viewBox="0 0 30 30" />
            </div>
            CMST
          </div>
        </>
      ),
      quantity: "368 CMDX",
      end_time: "07D : 08H : 32M",
      top_bid: "11 CMST",
    },
    {
      key: 2,
      auctioned_asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name="osmosis-icon" viewBox="0 0 30 30" />
            </div>
            OSMO
          </div>
        </>
      ),
      bidding_asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name="cmst-icon" viewBox="0 0 30 30" />
            </div>
            CMST
          </div>
        </>
      ),
      quantity: "983 OSMO",
      end_time: "01D : 08H : 32M",
      top_bid: "1,285 CMST",
    },
    {
      key: 3,
      auctioned_asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name="cmst-icon" viewBox="0 0 30 30" />
            </div>
            CMST
          </div>
        </>
      ),
      bidding_asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name="atom-icon" viewBox="0 0 30 30" />
            </div>
            ATOM
          </div>
        </>
      ),
      quantity: "1386 CMST",
      end_time: "07D : 08H : 32M",
      top_bid: "107 ATOM",
    },
    {
      key: 4,
      auctioned_asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name="atom-icon" viewBox="0 0 30 30" />
            </div>
            ATOM
          </div>
        </>
      ),
      bidding_asset: (
        <>
          <div className="assets-with-icon">
            <div className="assets-icon">
              <SvgIcon name="cmst-icon" viewBox="0 0 30 30" />
            </div>
            CMST
          </div>
        </>
      ),
      quantity: "33 ATOM",
      end_time: "02D : 08H : 32M",
      top_bid: "325 CMST",
    },
  ];
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card py-3 bg-none">
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

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(Liquidation);
