import { Button, message, Table, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setPools } from "../../../actions/lend";
import { NoDataIcon, SvgIcon } from "../../../components/common";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "../../../constants/common";
import { queryLendPools } from "../../../services/lend/query";
import { denomConversion } from "../../../utils/coin";
import { iconNameFromDenom } from "../../../utils/string";
import { ActionButton } from "../ActionButton";
import "../index.scss";
import { columns } from "./data";

const Borrow = ({ assetMap, setPools, lendPools, userLendList }) => {
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [inProgress, setInProgress] = useState(false);
  const [isLended, setIsLended] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetchLendPools((pageNumber - 1) * pageSize, pageSize, true, false);
  };

  const fetchLendPools = (offset, limit, isTotal, isReverse) => {
    setInProgress(true);
    queryLendPools(offset, limit, isTotal, isReverse, (error, result) => {
      setInProgress(false);

      if (error) {
        message.error(error);
        return;
      }

      setPools(result?.pools);
    });
  };

  const handleChange = (value) => {
    setPageNumber(value?.current - 1);
    setPageSize(value?.pageSize);
    fetchLendPools(
      (value?.current - 1) * value?.pageSize,
      value?.pageSize,
      true,
      false
    );
  };

  useEffect(() => {
    setIsLended(!!userLendList?.length);
  }, [userLendList]);

  const tableData =
    lendPools?.length > 0
      ? lendPools?.map((item, index) => {
          return {
            key: index,
            pool_id: item.poolId?.toNumber(),
            asset: (
              <>
                <div className="assets-with-icon">
                  <div className="assets-icon">
                    <SvgIcon
                      name={iconNameFromDenom(
                        assetMap[item?.transitAssetIds?.main?.toNumber()]?.denom
                      )}
                    />
                  </div>
                  {denomConversion(
                    assetMap[item?.transitAssetIds?.main?.toNumber()]?.denom
                  )}
                </div>
              </>
            ),
            bridge_asset: (
              <>
                <div className="assets-with-icon">
                  <div className="assets-icon">
                    <SvgIcon
                      name={iconNameFromDenom(
                        assetMap[item?.transitAssetIds?.first?.toNumber()]
                          ?.denom
                      )}
                    />
                  </div>
                  {denomConversion(
                    assetMap[item?.transitAssetIds?.first?.toNumber()]?.denom
                  )}
                </div>
              </>
            ),
            bridge_asset2: (
              <>
                <div className="assets-with-icon">
                  <div className="assets-icon">
                    <SvgIcon
                      name={iconNameFromDenom(
                        assetMap[item?.transitAssetIds?.second?.toNumber()]
                          ?.denom
                      )}
                    />
                  </div>
                  {denomConversion(
                    assetMap[item?.transitAssetIds?.second?.toNumber()]?.denom
                  )}
                </div>
              </>
            ),
            available_to_borrow: item,
            asset_apy: item,
            bridge_apy: item,
            bridge_apy2: item,
            action: (
              <ActionButton
                name="Borrow"
                text={!isLended ? "Lend assets to open borrow positions" : ""}
                isDisabled={!isLended}
                path={`/borrow/${item?.poolId?.toNumber()}`}
              />
            ),
          };
        })
      : [];

  return (
    <div className="commodo-card bg-none">
      <div className="card-header d-flex justify-content-between">
        <div>Borrow Markets</div>
        <div>
          <Link to="/borrow/direct">
            <Tooltip
              overlayClassName="commodo-tooltip"
              title="Lend and Borrow in one click"
            >
              <Button
                className="back-btn ml-auto"
                icon={
                  <SvgIcon name="direct-borrow" viewbox="0 0 57.25 54.685" />
                }
                type="primary"
              >
                <span className="pl-1">Direct Borrow</span>
              </Button>
            </Tooltip>
          </Link>
        </div>
      </div>
      <div className="card-content">
        <Table
          className="custom-table market-table1"
          dataSource={tableData}
          columns={columns}
          loading={inProgress && !lendPools?.length}
          onChange={(event) => handleChange(event)}
          pagination={{
            total:
              lendPools && lendPools?.pagination && lendPools.pagination.total,
            pageSize,
          }}
          scroll={{ x: "100%", y: "30vh" }}
          locale={{ emptyText: <NoDataIcon /> }}
        />
      </div>
    </div>
  );
};

Borrow.propTypes = {
  setPools: PropTypes.func.isRequired,
  assetMap: PropTypes.object,
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
    assetMap: state.asset._.map,
    lendPools: state.lend.pool.list,
    userLendList: state.lend.userLends,
  };
};

const actionsToProps = {
  setPools,
};

export default connect(stateToProps, actionsToProps)(Borrow);
