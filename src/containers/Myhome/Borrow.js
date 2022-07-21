import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { connect } from "react-redux";
import { Button, Table, Progress, message } from "antd";
import "./index.less";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { setUserBorrows } from "../../actions/lend";
import { queryUserBorrows } from "../../services/lend/query";
import AssetApy from "../Market/AssetApy";
import { iconNameFromDenom } from "../../utils/string";
import { amountConversionWithComma, denomConversion } from "../../utils/coin";

const Borrow = ({ address, setUserBorrows, userBorrowList }) => {
  const [inProgress, setInProgress] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUserBorrows([]);
  }, []);

  useEffect(() => {
    if (address) {
      fetchUserBorrows();
    }
  }, [address]);

  const fetchUserBorrows = () => {
    setInProgress(true);
    queryUserBorrows(address, (error, result) => {
      setInProgress(false);

      if (error) {
        message.error(error);
        return;
      }

      if (result?.borrows?.length > 0) {
        setUserBorrows(result?.borrows);
      }
    });
  };

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
  address: PropTypes.string,
  userBorrowList: PropTypes.arrayOf(
    PropTypes.shape({
      amountOut: PropTypes.shape({
        denom: PropTypes.string.isRequired,
        amount: PropTypes.string,
      }),
      borrowingId: PropTypes.shape({
        low: PropTypes.number,
      }),
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
    address: state.account.address,
    userBorrowList: state.lend.userBorrows,
  };
};

const actionsToProps = {
  setUserBorrows,
};

export default connect(stateToProps, actionsToProps)(Borrow);
