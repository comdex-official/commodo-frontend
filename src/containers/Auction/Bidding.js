import { Table, Button, message } from "antd";
import { SvgIcon } from "../../components/common";
import { iconNameFromDenom } from "../../utils/string";
import { denomConversion, amountConversionWithComma } from "../../utils/coin";
import TooltipIcon from "../../components/common/TooltipIcon/index";
import moment from "moment";

export const Bidding = ({ biddingList, inProgress }) => {
    const columnsBidding = [
        {
            title: (
                <>
                    Auctioned Asset <TooltipIcon text="Asset to be sold in the auction" />
                </>
            ),
            dataIndex: "inflowToken",
            key: "inflowToken",
            width: 250,
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
        },
        {
            title: "Timestamp",
            dataIndex: "timestamp",
            key: "timestamp",
            width: 200,
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
        },
    ];

    const tableBiddingData =
        biddingList &&
        biddingList.length > 0 &&
        biddingList.map((item, index) => {
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

    return (
        <div className="">

            <Table
                className="custom-table auction-table  bidding-bottom-table "
                dataSource={tableBiddingData}
                columns={columnsBidding}
                pagination={false}
                loading={inProgress}
                scroll={{ x: "100%" }}
            />
        </div>
    );
};

export default Bidding;
