import { Button, Table } from "antd";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { Col, NoDataIcon, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { amountConversionWithComma, denomConversion } from "../../utils/coin";
import { iconNameFromDenom } from "../../utils/string";
import AssetApy from "../Market/AssetApy";
import InterestAndReward from "./Calculate/InterestAndReward";
import "./index.less";

const Deposit = ({ lang, userLendList, inProgress }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: 130,
    },
    {
      title: (
        <>
          Available <TooltipIcon text="Balance after transaction" />
        </>
      ),
      dataIndex: "available",
      key: "available",
      width: 250,
    },
    {
      title: "cPool",
      dataIndex: "cpool",
      key: "cpool",
      width: 200,
    },
    {
      title: "Lend APY",
      dataIndex: "apy",
      key: "apy",
      width: 150,
      render: (lend) => (
        <AssetApy poolId={lend?.poolId} assetId={lend?.assetId} parent="lend" />
      ),
    },
    {
      title: (
        <>
          Interest <TooltipIcon text="Interest accrued by lending" />
        </>
      ),
      dataIndex: "interest",
      key: "interest",
      width: 350,
      className: "rewards-column",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 200,
      render: (item) => (
        <>
          <div className="d-flex">
            <Button
              onClick={() =>
                navigate(`/myhome/deposit/${item?.lendingId?.toNumber()}`)
              }
              type="primary"
              className="btn-filled table-btn"
              size="small"
            >
              Edit
            </Button>
          </div>
        </>
      ),
    },
  ];

  const tableData =
    userLendList?.length > 0
      ? userLendList?.map((item, index) => {
          return {
            key: index,
            asset: (
              <>
                <div className="assets-with-icon">
                  <div className="assets-icon">
                    <SvgIcon name={iconNameFromDenom(item?.amountIn?.denom)} />
                  </div>
                  {denomConversion(item?.amountIn?.denom)}
                </div>
              </>
            ),
            available: (
              <>
                {" "}
                {amountConversionWithComma(item?.amountIn?.amount)}{" "}
                {denomConversion(item?.amountIn?.denom)}
              </>
            ),
            cpool: item?.cpoolName,
            apy: item,
            interest: (
              <>
                {amountConversionWithComma(item?.rewardAccumulated)}{" "}
                {denomConversion(item?.amountIn?.denom)}
              </>
            ),
            action: item,
          };
        })
      : [];

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card bg-none">
            <div className="d-flex align-items-center">
              <div className="card-header text-left">MY Deposited Assets</div>
              <InterestAndReward parent="lend" />
            </div>
            <div className="card-content">
              <Table
                className="custom-table"
                dataSource={tableData}
                loading={inProgress}
                columns={columns}
                pagination={false}
                scroll={{ x: "100%" }}
                locale={{emptyText: <NoDataIcon />}}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Deposit.propTypes = {
  lang: PropTypes.string.isRequired,
  userLendList: PropTypes.arrayOf(
    PropTypes.shape({
      amountIn: PropTypes.shape({
        denom: PropTypes.string.isRequired,
        amount: PropTypes.string,
      }),
      assetId: PropTypes.shape({
        low: PropTypes.number,
      }),
      cpoolName: PropTypes.string,
      poolId: PropTypes.shape({
        low: PropTypes.number,
      }),
      rewardAccumulated: PropTypes.string,
    })
  ),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    userLendList: state.lend.userLends,
  };
};

export default connect(stateToProps)(Deposit);
