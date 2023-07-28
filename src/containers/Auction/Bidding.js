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
  DEFAULT_PAGE_NUMBER,
} from "../../constants/common";
import { queryDutchBiddingList } from "../../services/auction";
import { amountConversionWithComma, denomConversion } from "../../utils/coin";
import { iconNameFromDenom } from "../../utils/string";
import Pending from "../../assets/images/pending.svg";
import Completed from "../../assets/images/completed.svg";
import Rejected from "../../assets/images/rejected.svg";

export const Bidding = ({
  setBiddings,
  biddings,
  address,
  refreshBalance,
  assetDenomMap,
}) => {
  const [inProgress, setInProgress] = useState(false);
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_BIDDING_PAGE_SIZE);
  const [biddingsTotalCount, setBiddingsTotalCounts] = useState(0);

  const columnsBidding = [
    {
      title: (
        <>
          Collateral <TooltipIcon text="Asset to be sold in the auction" />
        </>
      ),
      dataIndex: "inflowToken",
      key: "inflowToken",
      width: 200,
    },
    {
      title: (
        <>
          Bid Denom <TooltipIcon text="Asset used to buy the auctioned asset" />
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
          Your Bid <TooltipIcon text="Status of auction" />
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

  const auctionStatusConverter = (status) => {
    if (status === "inactive") {
      return "Completed";
    } else {
      return status;
    }
  };

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
              {amountConversionWithComma(
                item?.outflowTokenAmount?.amount || 0,
                assetDenomMap[item?.outflowTokenAmount?.denom]?.decimals
              )}{" "}
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
              {amountConversionWithComma(
                item?.inflowTokenAmount?.amount || 0,
                assetDenomMap[item?.inflowTokenAmount?.denom]?.decimals
              )}{" "}
              {denomConversion(item?.inflowTokenAmount?.denom)}
            </div>
          </>
        ),
        timestamp: moment(item?.biddingTimestamp).format("MMM DD, YYYY HH:mm"),
        auctionStatus: "20 ATM",
        action: (
          <>
            {item?.biddingStatus === "placed" ? (
              <div className="bidding-action">
                <img src={Pending} alt="" />
                {item?.biddingStatus}
              </div>
            ) : item?.biddingStatus === "success" ? (
              <div className="bidding-action">
                <img src={Completed} alt="" />
                {item?.biddingStatus}
              </div>
            ) : item?.biddingStatus === "rejected" ? (
              <div className="bidding-action">
                <img src={Rejected} alt="" />
                {item?.biddingStatus}
              </div>
            ) : (
              ""
            )}
          </>
        ),
      };
    });

  const fetchBiddings = (
    address,
    offset,
    limit,
    countTotal,
    reverse,
    history
  ) => {
    setInProgress(true);

    queryDutchBiddingList(
      address,
      offset,
      limit,
      countTotal,
      reverse,
      history,
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
      true,
      false
    );
  };

  useEffect(() => {
    fetchBiddings(
      address,
      (pageNumber - 1) * pageSize,
      pageSize,
      true,
      true,
      false
    );
  }, [address, refreshBalance]);

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card pb-3 bg-none">
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
  assetDenomMap: PropTypes.object,
  biddings: PropTypes.array,
  refreshBalance: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
  return {
    biddings: state.auction.bidding.list,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

const actionsToProps = {
  setBiddings,
};

export default connect(stateToProps, actionsToProps)(Bidding);
