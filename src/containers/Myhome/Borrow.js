import { Button, Progress, Table } from "antd";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { amountConversionWithComma, denomConversion } from "../../utils/coin";
import { iconNameFromDenom } from "../../utils/string";
import AssetApy from "../Market/AssetApy";
import "./index.less";

const Borrow = ({ userBorrowList, inProgress }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: 180,
    },
    {
      title: (
        <>
          Debt <TooltipIcon text="Current Outstanding Debt" />
        </>
      ),
      dataIndex: "debt",
      key: "debt",
      width: 150,
    },
    {
      title: "cPool",
      dataIndex: "cpool",
      key: "cpool",
      width: 180,
    },
    {
      title: "APY",
      dataIndex: "apy",
      key: "apy",
      width: 110,
      render: (borrow) => (
        <AssetApy
          poolId={borrow?.poolId}
          assetId={borrow?.assetId}
          parent="borrow"
        />
      ),
    },
    {
      title: "Health",
      dataIndex: "health",
      key: "health",
      width: 300,
      align: "center",
      render: (text) => (
        // TODO : integrate health
        <Progress
          className="health-progress"
          style={{ width: 150 }}
          percent={"-"}
          size="small"
        />
      ),
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
                navigate(`/borrow/${item?.borrowingId?.toNumber()}`)
              }
              type="primary"
              className="btn-filled"
              size="small"
            >
              Borrow
            </Button>
            <Button
              onClick={() =>
                navigate({
                  pathname: `/borrow/${item?.borrowingId?.toNumber()}`,
                  hash: "repay",
                })
              }
              type="primary"
              size="small"
              className="ml-2"
            >
              Repay
            </Button>
          </div>
        </>
      ),
    },
  ];

  const tableData =
    userBorrowList?.length > 0
      ? userBorrowList?.map((item, index) => {
          return {
            key: index,
            asset: (
              <>
                <div className="assets-with-icon">
                  <div className="assets-icon">
                    <SvgIcon name={iconNameFromDenom(item?.amountOut?.denom)} />
                  </div>
                  {denomConversion(item?.amountOut?.denom)}
                </div>
              </>
            ),
            debt: (
              <>
                {" "}
                {amountConversionWithComma(item?.amountOut?.amount)}{" "}
                {denomConversion(item?.amountOut?.denom)}
              </>
            ),
            cpool: item?.cpoolName,
            apy: item,
            health: item,
            action: item,
          };
        })
      : [];

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card bg-none">
            <div className="card-header">MY Borrowed AssetS</div>
            <div className="card-content">
              <Table
                className="custom-table"
                dataSource={tableData}
                loading={inProgress}
                columns={columns}
                pagination={false}
                scroll={{ x: "100%" }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Borrow.propTypes = {
  lang: PropTypes.string.isRequired,
  inProgress: PropTypes.bool,
  userBorrowList: PropTypes.arrayOf(
    PropTypes.shape({
      amountOut: PropTypes.shape({
        denom: PropTypes.string.isRequired,
        amount: PropTypes.string,
      }),
      borrowingId: PropTypes.shape({
        low: PropTypes.number,
      }),
      cpoolName: PropTypes.string,
      lendingId: PropTypes.shape({
        low: PropTypes.number,
      }),
      pairId: PropTypes.shape({
        low: PropTypes.number,
      }),
      interestAccumulated: PropTypes.string,
    })
  ),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    userBorrowList: state.lend.userBorrows,
  };
};

export default connect(stateToProps)(Borrow);
