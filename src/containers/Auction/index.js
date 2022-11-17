import { Button, message, Table } from "antd";
import moment from "moment";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Col, NoDataIcon, Row, SvgIcon, TooltipIcon } from "../../components/common";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DOLLAR_DECIMALS
} from "../../constants/common";
import {
  queryDutchAuctionList,
  queryDutchBiddingList
} from "../../services/auction";
import { queryAuctionMippingIdParams } from "../../services/lend/query";
import { amountConversionWithComma, denomConversion } from "../../utils/coin";
import { commaSeparator, decimalConversion } from "../../utils/number";
import { iconNameFromDenom } from "../../utils/string";
import Bidding from "./Bidding";
import "./index.less";
import PlaceBidModal from "./PlaceBidModal";

const Auction = ({ address, refreshBalance }) => {
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [params, setParams] = useState({});
  const [auctions, setAuctions] = useState();
  const [loading, setLoading] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [biddings, setBiddings] = useState("");
  const [disableFetchButton, setdisableFetchButton] = useState(false);

  const columns = [
    {
      title: (
        <>
          Auctioned Asset <TooltipIcon text="Asset to be sold in the auction" />
        </>
      ),
      dataIndex: "auctioned_asset",
      key: "auctioned_asset",
      width: 180,
    },
    {
      title: (
        <>
          Bidding Asset{" "}
          <TooltipIcon text="Asset used to buy the auctioned asset" />
        </>
      ),
      dataIndex: "bidding_asset",
      key: "bidding_asset",
      width: 160,
      align: "center",
    },
    {
      title: (
        <>
          Quantity <TooltipIcon text="Amount of Auctioned asset being sold" />
        </>
      ),
      dataIndex: "quantity",
      key: "quantity",
      width: 200,
      align: "center",
    },
    {
      title: (
        <>
          End Time <TooltipIcon text="Auction closing time" />
        </>
      ),
      dataIndex: "end_time",
      key: "end_time",
      width: 200,
      align: "center",
      render: (end_time) => <div className="endtime-badge">{end_time}</div>,
    },
    {
      title: (
        <>
          Current Auction Price{" "}
          <TooltipIcon text="Current price of auction asset" />
        </>
      ),
      dataIndex: "current_price",
      key: "current_price",
      width: 160,
      align: "center",
      render: (price) => (
        <>
          $
          {commaSeparator(
            Number(
              amountConversionWithComma(decimalConversion(price) || 0) || 0
            ).toFixed(DOLLAR_DECIMALS)
          )}
        </>
      ),
    },
    {
      title: <>Bid</>,
      dataIndex: "action",
      key: "action",
      width: 140,
      align: "center",
      render: (item) => (
        <>
          <PlaceBidModal
            params={params}
            auction={item}
            discount={params?.auctionDiscountPercent}
          />
        </>
      ),
    },
  ];

  const tableData =
    auctions && auctions?.auctions?.length > 0
      ? auctions?.auctions?.map((item, index) => {
          return {
            key: index,
            auctioned_asset: (
              <>
                <div className="assets-with-icon">
                  <div className="assets-icon">
                    <SvgIcon
                      name={iconNameFromDenom(
                        item?.outflowTokenInitAmount?.denom
                      )}
                    />
                  </div>
                  {denomConversion(item?.outflowTokenInitAmount?.denom)}
                </div>
              </>
            ),
            bidding_asset: (
              <>
                <div className="assets-with-icon">
                  <div className="assets-icon">
                    <SvgIcon
                      name={iconNameFromDenom(
                        item?.inflowTokenCurrentAmount?.denom
                      )}
                    />
                  </div>
                  {denomConversion(item?.inflowTokenCurrentAmount?.denom)}
                </div>
              </>
            ),
            quantity: (
              <>
                {item?.outflowTokenCurrentAmount?.amount &&
                  amountConversionWithComma(
                    item?.outflowTokenCurrentAmount?.amount
                  )}{" "}
                {denomConversion(item?.outflowTokenCurrentAmount?.denom)}
              </>
            ),
            end_time: moment(item && item.endTime).format("MMM DD, YYYY HH:mm"),
            current_price: item?.outflowTokenCurrentPrice,
            action: item,
          };
        })
      : [];

  useEffect(() => {
    fetchAuctions((pageNumber - 1) * pageSize, pageSize, true, true);
  }, [address, refreshBalance]);

  useEffect(() => {
    queryParams();
  }, [address]);


  const queryParams = () => {
    queryAuctionMippingIdParams((error, result) => {
      if (error) {
        return;
      }

      setParams(result?.auctionParams);
    });
  };

  const fetchAuctions = (offset, limit, isTotal, isReverse) => {
    setLoading(true);

    queryDutchAuctionList(
      offset,
      limit,
      isTotal,
      isReverse,
      (error, result) => {
        setLoading(false);

        if (error) {
          message.error(error);
          return;
        }
        if (result?.auctions?.length > 0) {
          setAuctions(result && result);
        }
      }
    );
  };

  const fetchLatestPrice = () => {
    setdisableFetchButton(true)
    fetchAuctions((pageNumber - 1) * pageSize, pageSize, true, true);
  }

  useEffect(() => {
    const interval = setTimeout(() => {
      setdisableFetchButton(false)
    }, 6000);
    return () => {
      clearInterval(interval);
    }
  }, [disableFetchButton])

  const handleChange = (value) => {
    setPageNumber(value.current);
    setPageSize(value.pageSize);
    fetchAuctions(
      (value.current - 1) * value.pageSize,
      value.pageSize,
      true,
      true
    );
  };


  return (
    <div className="app-content-wrapper">
      <Row>
        <div className="update-btn-main-container">

          <div className="locker-up-main-container">
            <div className="locker-up-container mr-4">
              <div className="claim-container ">
                <div className="claim-btn">
                  <Button
                    type="primary"
                    className="btn-filled mr-1"
                    disabled={disableFetchButton}
                    onClick={() => fetchLatestPrice()}
                  >Update Auction Price </Button> <TooltipIcon text="The price of the auction changes every block, click on the button to update the price for placing accurate bids." />
                </div>
              </div>
            </div>
          </div>

        </div>
      </Row>
      <Row>
        <Col>
          <div className="commodo-card py-3 bg-none">
            <div className="card-content">
              <Table
                className="custom-table auction-table"
                dataSource={tableData}
                columns={columns}
                onChange={(event) => handleChange(event)}
                pagination={{
                  total:
                    auctions &&
                    auctions.pagination &&
                    auctions.pagination?.total?.toNumber(),
                  pageSize,
                }}
                scroll={{ x: "100%" }}
                loading={loading}
                locale={{emptyText: <NoDataIcon />}}
              />
            </div>
          </div>

          <div className="more-bottom">
            <h3 className="title">Bidding History</h3>
            <div className="more-bottom-card">
              <Bidding address={address} refreshBalance={refreshBalance} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Auction.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  refreshBalance: PropTypes.number.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    refreshBalance: state.account.refreshBalance,
  };
};

export default connect(stateToProps)(Auction);
