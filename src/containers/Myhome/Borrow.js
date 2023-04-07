import { Button, Table, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import { useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import {
  Col,
  NoDataIcon,
  Row,
  SvgIcon,
  TooltipIcon
} from "../../components/common";
import HealthFactor from "../../components/HealthFactor";
import { DOLLAR_DECIMALS } from "../../constants/common";
import { queryLendPair, queryLendPosition } from "../../services/lend/query";
import {
  amountConversion,
  amountConversionWithComma,
  commaSeparatorWithRounding,
  denomConversion
} from "../../utils/coin";
import { decimalConversion, marketPrice } from "../../utils/number";
import { iconNameFromDenom, ucDenomToDenom } from "../../utils/string";
import AssetApy from "../Market/AssetApy";
import InterestAndReward from "./Calculate/InterestAndReward";
import "./index.less";

const Borrow = ({
  lang,
  userBorrowList,
  inProgress,
  address,
  fetchUserBorrows,
  assetDenomMap,
  assetNameMap,
  markets,
}) => {
  const navigate = useNavigate();
  const [navigateInProgress, setNavigateInProgress] = useState(false);

  const handleNavigate = (borrow) => {
    setNavigateInProgress(true);

    queryLendPair(borrow?.pairId, (error, pairResult) => {
      if (error) {
        setNavigateInProgress(false);
        return;
      }

      const lendPair = pairResult?.ExtendedPair;

      if (!lendPair?.isInterPool) {
        navigate(`/market-details/${lendPair?.assetOutPoolId}/#repay`, {
          state: {
            lendingIdFromRoute: borrow?.lendingId?.toNumber(),
            borrowAssetMinimalDenomFromRoute: borrow?.amountOut?.denom,
            pairIdFromRoute: borrow?.pairId,
            collateralAssetIdFromRoute: lendPair?.assetIn?.toNumber(),
          },
        });
      } else {
        queryLendPosition(borrow?.lendingId, (error, result) => {
          if (error) {
            message.error(error);
            return;
          }

          if (result?.lend?.poolId) {
            navigate(`/market-details/${result?.lend?.poolId}/#repay`, {
              state: {
                lendingIdFromRoute: borrow?.lendingId?.toNumber(),
                borrowAssetMinimalDenomFromRoute: borrow?.amountOut?.denom,
                pairIdFromRoute: borrow?.pairId,
                collateralAssetIdFromRoute: lendPair?.assetIn?.toNumber(),
              },
            });
          }
        });
      }
    });
  };
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
          Debt <TooltipIcon text="Current outstanding debt" />
        </>
      ),
      dataIndex: "debt",
      key: "debt",
      width: 300,
      render: (text) => <div className="myhome-avaliablevalues">{text}</div>,
    },
    {
      title: (
        <>
          Collateral{" "}
          <TooltipIcon text="cTokens are the collateral tokens locked in the debt" />
        </>
      ),
      dataIndex: "collateral",
      key: "collateral",
      width: 300,
      render: (text) => <div className="myhome-avaliablevalues">{text}</div>,
    },
    {
      title: (
        <>
          Health Factor{" "}
          <TooltipIcon text="Numeric representation of your position's safety. Liquidation at H.F<1.0" />
        </>
      ),
      dataIndex: "health",
      key: "health",
      width: 250,
      align: "center",
      render: (item) => <HealthFactor parent="table" borrow={item} />,
    },
    {
      title: "Borrow APY",
      dataIndex: "apy",
      key: "apy",
      width: 180,
      render: (borrow) => <AssetApy borrowPosition={borrow} parent="borrow" />,
    },
    {
      title: (
        <>
          Interest <TooltipIcon text="Interest accrued by borrowing" />
        </>
      ),
      dataIndex: "interest",
      key: "interest",
      width: 250,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "right",
      width: 120,
      render: (item) => (
        <>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title={
              item?.isLiquidated ? "Position has been sent for Auction." : ""
            }
          >
            <Button
              disabled={item?.isLiquidated || navigateInProgress}
              onClick={() => handleNavigate(item)}
              type="primary"
              className="btn-filled"
              size="small"
            >
              Edit
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  const tableData =
    userBorrowList?.length > 0
      ? userBorrowList?.map((item, index) => {
          let collateralAsset =
            assetNameMap[
              ucDenomToDenom(item?.amountIn?.denom)?.substring(1)?.toUpperCase()
            ];

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
                <div>
                  {amountConversionWithComma(
                    item?.amountOut?.amount,
                    assetDenomMap[item?.amountOut?.denom]?.decimals
                  )}{" "}
                  {denomConversion(item?.amountOut?.denom)}
                </div>
                <div className="doller-values">
                  $
                  {commaSeparatorWithRounding(
                    Number(
                      amountConversion(
                        item?.amountOut?.amount,
                        assetDenomMap[item?.amountOut?.denom]?.decimals
                      ) || 0
                    ) *
                      marketPrice(
                        markets,
                        item?.amountOut?.denom,
                        assetDenomMap[item?.amountOut?.denom]?.id
                      ) || 0,
                    DOLLAR_DECIMALS
                  )}
                </div>
              </>
            ),
            collateral: (
              <>
                <div>
                  {amountConversionWithComma(
                    item?.amountIn?.amount,
                    collateralAsset?.decimals
                  )}{" "}
                  {denomConversion(item?.amountIn?.denom)}
                </div>
                <div className="doller-values">
                  $
                  {commaSeparatorWithRounding(
                    Number(
                      amountConversion(
                        item?.amountIn?.amount,
                        collateralAsset?.decimals
                      ) || 0
                    ) *
                      marketPrice(
                        markets,
                        ucDenomToDenom(item?.amountIn?.denom),
                        collateralAsset?.id
                      ) || 0,
                    DOLLAR_DECIMALS
                  )}
                </div>
              </>
            ),
            apy: item,
            interest: (
              <>
                {amountConversionWithComma(
                  decimalConversion(
                    item?.interestAccumulated,
                    assetDenomMap[item?.amountOut?.denom]?.decimals
                  )
                )}{" "}
                {denomConversion(item?.amountOut?.denom)}
              </>
            ),
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
            <div className="d-flex w-100 align-items-center justify-content-between">
              <div className="card-header text-left">MY Borrowed AssetS</div>
              <InterestAndReward
                lang={lang}
                address={address}
                updateDetails={fetchUserBorrows}
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

Borrow.propTypes = {
  fetchUserBorrows: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  address: PropTypes.string,
  assetDenomMap: PropTypes.object,
  assetNameMap: PropTypes.object,
  inProgress: PropTypes.bool,
  markets: PropTypes.object,
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
    address: state.account.address,
    assetDenomMap: state.asset._.assetDenomMap,
    assetNameMap: state.asset._.assetNameMap,
    markets: state.oracle.market,
  };
};

export default connect(stateToProps)(Borrow);
