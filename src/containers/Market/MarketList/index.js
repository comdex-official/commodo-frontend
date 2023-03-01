import { Button, message, Spin, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { setPools } from "../../../actions/lend";
import { SvgIcon } from "../../../components/common";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE
} from "../../../constants/common";
import { queryLendPools } from "../../../services/lend/query";
import { denomConversion } from "../../../utils/coin";
import { iconNameFromDenom } from "../../../utils/string";
import AssetApy from "../AssetApy";
import AvailableToBorrow from "../Borrow/AvailableToBorrow";
import "./index.less";

const MarketList = ({ assetMap, setPools, pools, lendPools, userLendList }) => {
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [inProgress, setInProgress] = useState(false);
  const [isLended, setIsLended] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetchLendPools((pageNumber - 1) * pageSize, pageSize, true, false);
  };

  const navigate = useNavigate();

  if (inProgress) {
    return <Spin />;
  }

  return (
    <div className="commodo-card bg-none">
      <div className="card-header d-flex align-items-center justify-content-between mb-3 ">
        <div>Markets</div>
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
        <div className="market-list">
          {pools?.length > 0 ? (
            pools &&
            pools?.map((item) => {
              return (
                <div
                  className="market-list-item"
                  onClick={() =>
                    navigate({
                      pathname: `/market-details/${item.poolId?.toNumber()}`,
                    })
                  }
                  key={item.poolId?.toNumber()}
                >
                  <div className="commodo-card">
                    <div className="header1">
                      <div className="assets-col mr-3">
                        <div className="assets-icon">
                          <SvgIcon
                            name={iconNameFromDenom(
                              assetMap[item?.transitAssetIds?.main?.toNumber()]
                                ?.denom
                            )}
                          />
                        </div>
                        {denomConversion(
                          assetMap[item?.transitAssetIds?.main?.toNumber()]
                            ?.denom
                        )}
                      </div>
                      <div className="right-col">
                        #{item.poolId?.toNumber()}
                      </div>
                    </div>
                    <div className="header2">
                      <div className="upper-label">Available to borrow</div>
                      <div className="header2-inner">
                        <AvailableToBorrow lendPool={item} />
                      </div>
                    </div>
                    <div className="details">
                      <table cellSpacing={0}>
                        <thead>
                          <tr>
                            <th></th>
                            <th>Lend APY</th>
                            <th>Borrow APY</th>
                          </tr>
                        </thead>

                        <tbody>
                          {Object.keys(item?.transitAssetIds).map(
                            (key, objectIndex) => {
                              return (
                                <React.Fragment key={objectIndex}>
                                  <tr>
                                    <th>
                                      {denomConversion(
                                        assetMap?.[item?.transitAssetIds[key]]
                                          ?.denom
                                      )}
                                    </th>
                                    <td>
                                      <AssetApy
                                        poolId={item?.poolId}
                                        assetId={item?.transitAssetIds[key]}
                                        parent="lend"
                                      />
                                    </td>
                                    <td>
                                      <AssetApy
                                        poolId={item?.poolId}
                                        assetId={item?.transitAssetIds[key]}
                                        parent="borrow"
                                      />
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center w-100">
              <h1>Sorry, No Data Found</h1>{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MarketList.propTypes = {
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
  pools: PropTypes.arrayOf(
    PropTypes.shape({
      poolId: PropTypes.shape({
        low: PropTypes.number,
      }),
      mainAssetId: PropTypes.shape({
        low: PropTypes.number,
      }),
      firstBridgedAssetId: PropTypes.shape({
        low: PropTypes.number,
      }),
      secondBridgedAssetId: PropTypes.shape({
        low: PropTypes.number,
      }),
    })
  ),
};

const stateToProps = (state) => {
  return {
    assetMap: state.asset._.map,
    lendPools: state.lend.pool.list,
    userLendList: state.lend.userLends,
    pools: state.lend.pool.list,
    address: state.account.address,
  };
};

const actionsToProps = {
  setPools,
};

export default connect(stateToProps, actionsToProps)(MarketList);
