import { Button, Dropdown, Menu, Table, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import {
  Col,
  NoDataIcon,
  Row,
  SvgIcon,
  TooltipIcon,
} from "../../components/common";
import { DOLLAR_DECIMALS } from "../../constants/common";
import {
  amountConversion,
  amountConversionWithComma,
  commaSeparatorWithRounding,
  denomConversion,
} from "../../utils/coin";
import { marketPrice } from "../../utils/number";
import { iconNameFromDenom } from "../../utils/string";
import AssetApy from "../Market/AssetApy";
import InterestAndReward from "./Calculate/InterestAndReward";
import "./index.less";
import { queryEMode } from "../../services/lend/query";
import { useEffect, useState } from "react";
import DPool from "../../assets/images/d-pool.png";

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
  markets,
}) => {
  const navigate = useNavigate();

  const columns = [
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
      width: 280,
      render: (text) => <div className="myhome-avaliablevalues">{text}</div>,
    },
    {
      title: "cPool",
      dataIndex: "cpool",
      key: "cpool",
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
      render: (item, row) => (
        <>
          <Dropdown
            overlayClassName="edit-btn-dorp"
            trigger={["click"]}
            overlay={editItems}
          >
            {row?.knowEmode ? (
              <Button
                onClick={() =>
                  navigate(
                    `/e-mode-details/${row?.getEmodeData[0]?.asset_in_pool_id}/${row?.getEmodeData[0]?.asset_in}/${row?.getEmodeData[0]?.asset_out}/${row?.getEmodeData[0]?.id}/#withdraw`,
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
            ) : row?.poolId ? (
              <Button
                onClick={() =>
                  navigate(`/deprecated-cpool/${1}/#withdraw`, {
                    state: {
                      collateralAssetIdFromRoute: item?.assetId?.toNumber(),
                      lendingIdFromRoute: item?.lendingId?.toNumber(),
                    },
                  })
                }
                type="primary"
                className="btn-filled"
                size="small"
              >
                Edit
              </Button>
            ) : (
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
            )}
          </Dropdown>
        </>
      ),
    },
  ];

  const [eModData, setEModData] = useState([]);

  const fetchLendPools = () => {
    queryEMode((error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setEModData(result?.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetchLendPools();
  };

  const knowEmode = (item) => {
    const results = eModData.filter(
      (item2) => Number(item2?.id) === Number(item?.pairId)
    );
    if (results.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const getEmodeData = (item) => {
    const results = eModData.filter(
      (item2) => Number(item2?.id) === Number(item?.pairId)
    );
    return results;
  };

  const tableData =
    userLendList?.length > 0
      ? userLendList?.map((item, index) => {
          return {
            key: index,
            asset: (
              <>
                <div className="assets-with-icon">
                  {Number(item?.poolId) === 1 ? (
                    <Tooltip
                      overlayClassName="commodo-tooltip"
                      title={
                        "Position is from a deprecating cPool, Repay debt and Withdraw funds asap. Click Edit button."
                      }
                    >
                      <img alt={"D-Pool"} src={DPool} className="e-mod-img" />
                    </Tooltip>
                  ) : (
                    ""
                  )}

                  <div className="assets-icon">
                    <SvgIcon name={iconNameFromDenom(item?.amountIn?.denom)} />
                  </div>
                  {denomConversion(item?.amountIn?.denom)}
                </div>
              </>
            ),
            available: (
              <>
                <div>
                  {amountConversionWithComma(
                    item?.amountIn?.amount,
                    assetDenomMap[item?.amountIn?.denom]?.decimals
                  )}{" "}
                  {denomConversion(item?.amountIn?.denom)}
                </div>
                <div className="doller-values">
                  $
                  {commaSeparatorWithRounding(
                    Number(
                      amountConversion(
                        item?.amountIn?.amount,
                        assetDenomMap[item?.amountIn?.denom]?.decimals
                      ) || 0
                    ) *
                      marketPrice(
                        markets,
                        item?.amountIn?.denom,
                        assetDenomMap[item?.amountIn?.denom]?.id
                      ) || 0,
                    DOLLAR_DECIMALS
                  )}
                </div>
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
            knowEmode: knowEmode(item),
            getEmodeData: getEmodeData(item),
            poolId: Number(item?.poolId),
          };
        })
      : [];

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card bg-none">
            <div className="d-flex align-items-center justify-content-between">
              <div className="card-header text-left">My Lend Assets</div>
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
  markets: PropTypes.object,
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
    markets: state.oracle.market,
  };
};

export default connect(stateToProps)(Deposit);
