import { Button, message, Modal, Table, Tabs } from "antd";
import moment from "moment";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setAuctions } from "../../actions/auction";
import {
  Col,
  NoDataIcon,
  Row,
  SvgIcon,
  TooltipIcon,
} from "../../components/common";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DOLLAR_DECIMALS,
} from "../../constants/common";
import { queryDutchAuctionList } from "../../services/auction";
import { queryAuctionParams } from "../../services/lend/query";
import { amountConversionWithComma, denomConversion } from "../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  marketPrice,
} from "../../utils/number";
import { iconNameFromDenom } from "../../utils/string";
import Bidding from "./Bidding";
import { InActiveBidding } from "./inActiveBidding";
import "./index.less";
import PlaceBidModal from "./PlaceBidModal";
import CustomInput from "../../components/CustomInput";

const Auction = ({
  address,
  setAuctions,
  auctions,
  refreshBalance,
  assetDenomMap,
  markets,
}) => {
  const { TabPane } = Tabs;

  const tabItems = [
    {
      label: "Active",
      key: "1",
      children: <Bidding address={address} refreshBalance={refreshBalance} />,
    },
    {
      label: "Completed",
      key: "2",
      children: (
        <InActiveBidding
          address={address}
          refreshBalance={refreshBalance}
          assetDenomMap={assetDenomMap}
        />
      ),
    },
  ];

  const callback = (key) => {
    setActiveKey(key);
  };

  const [activeKey, setActiveKey] = useState("1");
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(true);
  const [disableFetchButton, setdisableFetchButton] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      title: (
        <>
          Auction Asset <TooltipIcon text="Asset to be sold in the auction" />
        </>
      ),
      dataIndex: "auctioned_asset",
      key: "auctioned_asset",
      width: 180,
    },
    {
      title: (
        <>
          Bid Asset <TooltipIcon text="Asset used to buy the auctioned asset" />
        </>
      ),
      dataIndex: "bidding_asset",
      key: "bidding_asset",
      width: 160,
      align: "center",
    },
    // {
    //   title: (
    //     <>
    //       Quantity <TooltipIcon text="Amount of Auctioned asset being sold" />
    //     </>
    //   ),
    //   dataIndex: "quantity",
    //   key: "quantity",
    //   width: 200,
    //   align: "center",
    // },
    {
      title: (
        <>
          Time Remaining <TooltipIcon text="Auction closing time" />
        </>
      ),
      dataIndex: "end_time",
      key: "end_time",
      width: 200,
      align: "center",
      render: (end_time) => <div className="endtime-badge">{end_time}</div>,
    },
    {
      title: <>Oracle Price</>,
      dataIndex: "oracle_price",
      key: "oracle_price",
      width: 120,
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
      render: (item) => (
        <>${commaSeparator(Number(5445 || 0).toFixed(DOLLAR_DECIMALS))}</>
      ),
    },
    // {
    //   title: <>Bid</>,
    //   dataIndex: "action",
    //   key: "action",
    //   width: 140,
    //   align: "center",
    //   render: (item) => (
    //     <>
    //       <PlaceBidModal
    //         params={params}
    //         auction={item}
    //         discount={params?.auctionDiscountPercent}
    //       />
    //     </>
    //   ),
    // },
  ];

  const tableData =
    auctions && auctions?.list?.length > 0
      ? auctions?.list?.map((item, index) => {
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
                    item?.outflowTokenCurrentAmount?.amount,
                    assetDenomMap[item?.outflowTokenCurrentAmount?.denom]
                      ?.decimals
                  )}{" "}
                {denomConversion(item?.outflowTokenCurrentAmount?.denom)}
              </>
            ),
            end_time: moment(item && item.endTime).format(
              "HH[H] : mm[M] : ss[S]"
            ),
            oracle_price:
              "$" +
              Number(
                marketPrice(
                  markets,
                  item?.outflowTokenCurrentAmount?.denom,
                  assetDenomMap[item?.outflowTokenCurrentAmount?.denom]?.id
                ) || 0
              ),
            current_price: item,
            action: item,
          };
        })
      : [];

  const limitColumns = [
    {
      title: (
        <>
          Auction Asset <TooltipIcon text="Asset to be sold in the auction" />
        </>
      ),
      dataIndex: "auctioned_asset",
      key: "auctioned_asset",
      width: 180,
    },
    {
      title: (
        <>
          Bid Asset <TooltipIcon text="Asset used to buy the auctioned asset" />
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
          Bid Value <TooltipIcon text="Amount of Auctioned asset being sold" />
        </>
      ),
      dataIndex: "bidding_value",
      key: "bidding_value",
      width: 200,
      align: "center",
    },
    {
      title: (
        <>
          Max Discount{" "}
          <TooltipIcon text="Amount of Auctioned asset being sold" />
        </>
      ),
      dataIndex: "max_discount",
      key: "max_discount",
      width: 200,
      align: "center",
    },
    {
      title: <>Your Bid</>,
      dataIndex: "your_bid",
      key: "your_bid",
      width: 120,
    },
  ];

  const limitTableData =
    auctions && auctions?.list?.length > 0
      ? auctions?.list?.map((item, index) => {
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
            bidding_value: <>{"40.50k"}</>,
            max_discount: "30%",

            your_bid: 0.0,
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
    queryAuctionParams((error, result) => {
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
          setAuctions(
            result && result?.auctions,
            result?.pagination?.total?.toNumber()
          );
        }
      }
    );
  };

  const fetchLatestPrice = () => {
    setdisableFetchButton(true);
    fetchAuctions((pageNumber - 1) * pageSize, pageSize, true, true);
  };

  useEffect(() => {
    const interval = setTimeout(() => {
      setdisableFetchButton(false);
    }, 6000);
    return () => {
      clearInterval(interval);
    };
  }, [disableFetchButton]);

  const handleChange = (value) => {
    setPageNumber(value?.current);
    setPageSize(value?.pageSize);
    fetchAuctions(
      (value?.current - 1) * value?.pageSize,
      value?.pageSize,
      true,
      true
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handelClickAuctionTable = (e, rowIndex) => {
    console.log(e, rowIndex, "e");
    setSelectedRow(e?.action);
    showModal();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="app-content-wrapper">
      <Row>
        <div className="update-btn-main-container">
          <div className="claim-title">Live Auctions</div>
          <div className="locker-up-main-container">
            <div className="locker-up-container mr-4">
              <div className="claim-container ">
                <div className="claim-btn">
                  <Button
                    type="primary"
                    className="mr-1"
                    disabled={disableFetchButton}
                    onClick={() => fetchLatestPrice()}
                  >
                    Update Auction Price{" "}
                  </Button>{" "}
                  <TooltipIcon text="The price of the auction changes every block, click on the button to update the price for placing accurate bids." />
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
                  total: auctions && auctions.pagination,
                  pageSize,
                }}
                scroll={{ x: "100%" }}
                loading={loading && !auctions?.length}
                locale={{ emptyText: <NoDataIcon /> }}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: () => handelClickAuctionTable(record, rowIndex),
                  };
                }}
              />
            </div>
          </div>

          <div className="commodo-card py-3 bg-none">
            <h3 className="title">Limit Order Bid</h3>
            <div className="card-content">
              <Table
                className="custom-table auction-table"
                dataSource={limitTableData}
                columns={limitColumns}
                onChange={(event) => handleChange(event)}
                pagination={{
                  total: auctions && auctions.pagination,
                  pageSize,
                }}
                scroll={{ x: "100%" }}
                loading={loading && !auctions?.length}
                locale={{ emptyText: <NoDataIcon /> }}
              />
            </div>
          </div>

          <div className="more-bottom">
            <h3 className="title">Bidding History</h3>
            <div className="more-bottom-card">
              <Row>
                <Col>
                  <Tabs
                    className="commodo-tabs mt-3"
                    onChange={callback}
                    activeKey={activeKey}
                    items={tabItems}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      <Modal
        centered={true}
        className="palcebid-modal auction-placebid-modal"
        footer={null}
        header={null}
        open={isModalOpen}
        width={500}
        // closable={width < 650 ? true : null}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={null}
      >
        <>
          <div className="place_bid_modal_main_container">
            <div className="place_bid_modal_container">
              <div className="timer_container">
                <div className="hr_box time_box">
                  <div className="time">04</div>
                  <div className="value">Hours</div>
                </div>
                <div className="min_box time_box">
                  <div className="time">24</div>
                  <div className="value">Minutes</div>
                </div>
                <div className="sec_box time_box">
                  <div className="time">24</div>
                  <div className="value">Seconds</div>
                </div>
              </div>
              <div className="auction_quantity_container">
                <div className="price_box">
                  <div className="text">Current Auction Price</div>
                  <div className="value">$13.5432</div>
                </div>
                <div className="target_cmst_box">
                  <div className="text">Target CMST</div>
                  <div className="value">35 CMST</div>
                </div>
              </div>
              <div className="balance_container">
                <div className="title_text">Quantity Bid For</div>
                <div className="value_box">
                  <div className="btn_box">
                    <Button className="maxhalf"> MAX</Button>
                  </div>
                  24 CMST
                </div>
              </div>
              <div className="token_with_input_container">
                <div className="input_with_icon_container">
                  <div className="input_container">
                    <div className="icon_container">
                      <div className="assets-withicon">
                        <div className="assets-icons">
                          <SvgIcon name={iconNameFromDenom("ucmst")} />
                        </div>
                        <div className="name">CMST</div>
                      </div>
                    </div>

                    <CustomInput className="custom-input" />
                  </div>
                </div>
              </div>

              <div className="receiable_amount_box">
                <div className="text">You will Receive</div>
                <div className="value">50 CMST</div>
              </div>

              <div className="button_container">
                <Button type="primary" className="btn-filled bid-btn">
                  Place Bid
                </Button>
              </div>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
};

Auction.propTypes = {
  lang: PropTypes.string.isRequired,
  setAuctions: PropTypes.func.isRequired,
  address: PropTypes.string,
  assetDenomMap: PropTypes.object,
  auctions: PropTypes.array,
  refreshBalance: PropTypes.number.isRequired,
  markets: PropTypes.object,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
    auctions: state.auction.data,
    refreshBalance: state.account.refreshBalance,
    assetDenomMap: state.asset._.assetDenomMap,
    markets: state.oracle.market,
  };
};

const actionsToProps = {
  setAuctions,
};

export default connect(stateToProps, actionsToProps)(Auction);
