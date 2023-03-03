import { Button, Dropdown, Menu, Table } from "antd";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import {
  Col,
  NoDataIcon,
  Row,
  SvgIcon,
  TooltipIcon
} from "../../components/common";
import { amountConversionWithComma, denomConversion } from "../../utils/coin";
import { iconNameFromDenom } from "../../utils/string";
import AssetApy from "../Market/AssetApy";
import InterestAndReward from "./Calculate/InterestAndReward";
import "./index.less";

const editItems = (
  <Menu>
    <Menu.Item>Deposit</Menu.Item>
    <Menu.Item>Withdraw</Menu.Item>
  </Menu>
);

const Deposit = ({
  lang,
  userLendList,
  inProgress,
  address,
  fetchUserLends,
  assetDenomMap,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "cPool",
      dataIndex: "cpool",
      key: "cpool",
      width: 200,
    },
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: 150,
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
      title: "Lend APY",
      dataIndex: "apy",
      key: "apy",
      width: 180,
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
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 200,
      render: (item) => (
        <>
          <Dropdown
            overlayClassName="edit-btn-dorp"
            trigger={["click"]}
            overlay={editItems}
          >
            <Button
              onClick={() =>
                navigate(
                  `/market-details/${item?.poolId?.toNumber()}/#withdraw`,
                  {
                    state: {
                      collateralAssetIdFromRoute: item?.assetId?.toNumber(),
                      lendingIdFromRoute: item?.lendingId?.toNumber(),
                    },
                  }
                )
              }
              type="primary"
              className="btn-filled"
              size="small"
            >
              Edit
            </Button>
          </Dropdown>
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
                {amountConversionWithComma(
                  item?.amountIn?.amount,
                  assetDenomMap[item?.amountIn?.denom]?.decimals
                )}{" "}
                {denomConversion(item?.amountIn?.denom)}
              </>
            ),
            cpool: item?.cpoolName,
            apy: item,
            interest: (
              <>
                {amountConversionWithComma(
                  item?.totalRewards,
                  assetDenomMap[item?.amountIn?.denom]?.decimals
                )}{" "}
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
            <div className="d-flex align-items-center justify-content-between">
              <div className="card-header text-left">MY Deposited Assets</div>
              <InterestAndReward
                lang={lang}
                address={address}
                updateDetails={fetchUserLends}
              />
            </div>
            <div className="card-content">
              <Table
                className="custom-table"
                dataSource={tableData}
                loading={inProgress}
                columns={columns}
                pagination={false}
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

Deposit.propTypes = {
  fetchUserLends: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  assetDenomMap: PropTypes.object,
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
    address: state.account.address,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

export default connect(stateToProps)(Deposit);
