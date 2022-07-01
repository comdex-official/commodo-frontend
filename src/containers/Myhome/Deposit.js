import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { connect } from "react-redux";
import { Button, Table, message } from "antd";
import "./index.less";
import { useEffect, useState } from "react";
import { queryUserLends } from "../../services/lend/query";
import { iconNameFromDenom } from "../../utils/string";
import { amountConversionWithComma, denomConversion } from "../../utils/coin";
import { useNavigate } from "react-router";
import AssetApy from "../Market/AssetApy";
import { setUserLends } from "../../actions/lend";

const Deposit = ({ address, setUserLends, userLendList }) => {
  const [inProgress, setInProgress] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUserLends([]);
  }, []);

  useEffect(() => {
    if (address) {
      fetchUserLends();
    }
  }, [address]);

  const fetchUserLends = () => {
    setInProgress(true);
    queryUserLends(address, (error, result) => {
      setInProgress(false);

      if (error) {
        message.error(error);
        return;
      }

      if (result?.lends?.length > 0) {
        setUserLends(result?.lends);
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
          Available <TooltipIcon text="Balance after transaction" />
        </>
      ),
      dataIndex: "available",
      key: "available",
      width: 250,
    },
    {
      title: "APY",
      dataIndex: "apy",
      key: "apy",
      width: 150,
      render: (lend) => (
        <AssetApy poolId={lend?.poolId} assetId={lend?.assetId} parent="lend" />
      ),
    },
    {
      title: "Rewards",
      dataIndex: "rewards",
      key: "rewards",
      width: 200,
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
                navigate(`/deposit/${item?.lendingId?.toNumber()}`)
              }
              type="primary"
              className="btn-filled table-btn"
              size="small"
            >
              Deposit
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() =>
                navigate({
                  pathname: `/deposit/${item?.lendingId?.toNumber()}`,
                  hash: "withdraw",
                })
              }
              className="ml-2 table-btn"
            >
              Withdraw
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
            apy: item,
            rewards: (
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
            <div className="card-header">MY Deposited Assets</div>
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

Deposit.propTypes = {
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  userLendList: PropTypes.arrayOf(
    PropTypes.shape({
      amountIn: PropTypes.shape({
        denom: PropTypes.string.isRequired,
        amount: PropTypes.string,
      }),
      assetId: PropTypes.shape({
        low: PropTypes.number,
      }),
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
    address: state.account.address,
    userLendList: state.lend.userLends,
  };
};

const actionsToProps = {
  setUserLends,
};

export default connect(stateToProps, actionsToProps)(Deposit);
