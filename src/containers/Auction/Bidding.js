import { Button, message, Table } from "antd";
import moment from "moment";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setBiddings } from "../../actions/auction";
import { Col, NoDataIcon, Row, SvgIcon } from "../../components/common";
import TooltipIcon from "../../components/common/TooltipIcon/index";
import {
  DEFAULT_BIDDING_PAGE_SIZE,
  DEFAULT_PAGE_NUMBER
} from "../../constants/common";
import { queryDutchBiddingList } from "../../services/auction";
import { amountConversionWithComma, denomConversion } from "../../utils/coin";
import { iconNameFromDenom } from "../../utils/string";

export const Bidding = ({ setBiddings, biddings, address, refreshBalance }) => {
  const [inProgress, setInProgress] = useState(false);
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_BIDDING_PAGE_SIZE);
  const [biddingsTotalCount, setBiddingsTotalCounts] = useState(0);

  const columnsBidding = [
    {
      title: (
        <>
          Auctioned Asset <TooltipIcon text="Asset to be sold in the auction" />
        </>
      ),
      dataIndex: "inflowToken",
      key: "inflowToken",
      width: 200,
    },
    {
      title: (
        <>
          Bidding Asset{" "}
          <TooltipIcon text="Asset used to buy the auctioned asset" />
        </>
      ),
      dataIndex: "outflowToken",
      key: "outflowToken",
      width: 200,
      align: "center",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 200,
      align: "center",
      render: (end_time) => <div className="endtime-badge">{end_time}</div>,
    },
    {
      title: (
        <>
          Auction Status <TooltipIcon text="Status of auction" />
        </>
      ),
      dataIndex: "auctionStatus",
      key: "auctionStatus",
      align: "center",
      width: 150,
    },
    {
      title: (
        <>
          Bidding Status <TooltipIcon text="Bidding status of auction" />
        </>
      ),
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 150,
    },
  ];

  const tableBiddingData =
    biddings?.length > 0 &&
    biddings?.map((item, index) => {
      return {
        key: index,
        outflowToken: (
          <>
            <div className="assets-with-icon">
              <div className="assets-icon">
                <SvgIcon
                  name={iconNameFromDenom(item?.outflowTokenAmount?.denom)}
                />
              </div>
              {amountConversionWithComma(item?.outflowTokenAmount?.amount || 0)}{" "}
              {denomConversion(item?.outflowTokenAmount?.denom)}
            </div>
          </>
        ),
        inflowToken: (
          <>
            <div className="assets-with-icon">
              <div className="assets-icon">
                <SvgIcon
                  name={iconNameFromDenom(item?.inflowTokenAmount?.denom)}
                />
              </div>
              {amountConversionWithComma(item?.inflowTokenAmount?.amount || 0)}{" "}
              {denomConversion(item?.inflowTokenAmount?.denom)}
            </div>
          </>
        ),
        timestamp: moment(item?.biddingTimestamp).format("MMM DD, YYYY HH:mm"),
        auctionStatus: (
          <Button
            size="small"
            className={
              item?.auctionStatus === "active"
                ? "biddin-btn bid-btn-success"
                : item?.auctionStatus === "inactive"
                ? "biddin-btn bid-btn-rejected"
                : ""
            }
          >
            {item?.auctionStatus}
          </Button>
        ),
        action: (
          <Button
            size="small"
            className={
              item?.biddingStatus === "placed"
                ? "biddin-btn bid-btn-placed"
                : item?.biddingStatus === "success"
                ? "biddin-btn bid-btn-success"
                : item?.biddingStatus === "rejected"
                ? "biddin-btn bid-btn-rejected"
                : ""
            }
          >
            {item?.biddingStatus}
          </Button>
        ),
      };
    });

  const fetchBiddings = (address, offset, limit, countTotal, reverse) => {
    setInProgress(true);

    queryDutchBiddingList(
      address,
      offset,
      limit,
      countTotal,
      reverse,
      (error, result) => {
        setInProgress(false);

        if (error) {
          message.error(error);
          return;
        }
        if (result?.biddings?.length > 0) {
          let reverseData = result && result.biddings;
          setBiddings(reverseData);
          setBiddingsTotalCounts(result?.pagination?.total?.toNumber());
        }
      }
    );
  };

  const handleChange = (value) => {
    setPageNumber(value?.current);
    setPageSize(value?.pageSize);
    fetchBiddings(
      address,
      (value?.current - 1) * value?.pageSize,
      value?.pageSize,
      true,
      true
    );
  };

  useEffect(() => {
    fetchBiddings(address, (pageNumber - 1) * pageSize, pageSize, true, true);
  }, [address, refreshBalance]);

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card py-3 bg-none">
            <div className="card-content">
              <Table
                className="custom-table auction-table  bidding-bottom-table "
                dataSource={tableBiddingData}
                columns={columnsBidding}
                onChange={(event) => handleChange(event)}
                pagination={{
                  total: biddingsTotalCount,
                  pageSize,
                }}
                loading={inProgress && !biddings?.length}
                scroll={{ x: "100%" }}
                locale={{ emptyText: <NoDataIcon /> }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Bidding.propTypes = {
  setBiddings: PropTypes.func.isRequired,
  address: PropTypes.string,
  biddings: PropTypes.array,
  refreshBalance: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
  return {
    biddings: state.auction.bidding.list,
  };
};

const actionsToProps = {
  setBiddings,
};

export default connect(stateToProps, actionsToProps)(Bidding);
