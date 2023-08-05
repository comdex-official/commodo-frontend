import { Button, Input, message, Spin, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { setPools } from "../../../actions/lend";
import { SvgIcon } from "../../../components/common";
import DistributionAPY from "../../../components/common/DistributionAPY";
import AssetApy from "../AssetApy";
import "./index.less";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "../../../constants/common";
import {
  queryEMode,
  queryLendPools,
  QueryPoolAssetLBMapping,
  queryModuleBalance,
  queryAssetPoolFundBalance,
} from "../../../services/lend/query";
import { denomConversion } from "../../../utils/coin";
import { iconNameFromDenom } from "../../../utils/string";
import AvailableToBorrow from "../Borrow/AvailableToBorrow";
import DPool from "../../../assets/images/d-pool.svg";
import Market from "../../../assets/images/market.svg";
import DBorrow from "../../../assets/images/d-borrow.svg";

const EmodeList = ({ assetMap, setPools, pools, lendPools, userLendList }) => {
  const [inProgress, setInProgress] = useState(false);
  const [eModData, setEModData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [filterPool, setFilterPool] = useState();

  const onSearchChange = (searchKey) => {
    setSearchKey(searchKey.trim().toLowerCase());
  };

  const fetchLendPools = () => {
    setInProgress(true);
    queryEMode((error, result) => {
      setInProgress(false);

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

  const navigate = useNavigate();

  const uniqueEnvironments = {}; // Temporary object to store unique environments

  const result = eModData.filter((obj) => {
    if (!uniqueEnvironments[obj?.asset_in_pool_id]) {
      uniqueEnvironments[obj?.asset_in_pool_id] = true; // Mark environment as encountered
      return true; // Include the object in the filtered result
    }
    return false; // Exclude duplicate objects
  });

  useEffect(() => {
    if (searchKey.length > 0) {
      const res = result.filter(
        (item) =>
          denomConversion(assetMap[Number(item?.asset_in)]?.denom)
            .trim()
            .toLowerCase()
            .includes(searchKey) ||
          denomConversion(assetMap[Number(item?.asset_out)]?.denom)
            .trim()
            .toLowerCase()
            .includes(searchKey)
      );
      setFilterPool(res);
    }
  }, [searchKey]);

  if (inProgress) {
    return <Spin />;
  }

  return (
    <div className="commodo-card bg-none">
      <div className="card-header d-flex align-items-center justify-content-between mb-3 ">
        <div>E-MODE markets</div>
        <div className="market-header-right">
          <Tooltip
            overlayClassName="commodo-tooltip"
            title="Explore available lending-borrowing markets"
          >
            <Button onClick={() => navigate({ pathname: `/market` })}>
              <div className="title-wrap">
                <img src={Market} alt="Market" /> Market
              </div>
            </Button>
          </Tooltip>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title="Lend and Borrow in one click"
          >
            <Button onClick={() => navigate({ pathname: `/borrow/direct` })}>
              <div className="title-wrap">
                <img src={DBorrow} alt="DBorrow" /> Direct Borrow
              </div>
            </Button>
          </Tooltip>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title={"Deprecating cPool, Repay debt and Withdraw your funds asap"}
          >
            <Button
              onClick={() => navigate({ pathname: `/deprecated-cpool/${1}` })}
            >
              <div className="title-wrap">
                <img src={DPool} alt="DPool" /> Deprecated cPool
              </div>
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="assets-search-section">
        <Input
          placeholder="Search Asset.."
          onChange={(event) => onSearchChange(event.target.value)}
          suffix={<SvgIcon name="search" viewbox="0 0 18 18" />}
        />
      </div>
      <div className="card-content">
        <div className="market-list">
          {searchKey?.length > 0 ? (
            filterPool?.length > 0 ? (
              filterPool.map((item, i) => (
                <div
                  key={i}
                  className="market-list-item"
                  onClick={() =>
                    navigate({
                      pathname: `/e-mode-details/${Number(
                        item.asset_in_pool_id
                      )}/${Number(item.asset_in)}/${Number(
                        item.asset_out
                      )}/${Number(item.id)}`,
                    })
                  }
                >
                  <div className="commodo-card">
                    <div className="header1 emode-header">
                      <div className="assets-col mr-3">
                        <div className="assets-icon">
                          <SvgIcon
                            name={iconNameFromDenom(
                              assetMap[Number(item?.asset_in)]?.denom
                            )}
                          />
                        </div>
                        <div className="assets-icon">
                          <SvgIcon
                            name={iconNameFromDenom(
                              assetMap[Number(item?.asset_out)]?.denom
                            )}
                          />
                        </div>
                        {denomConversion(
                          assetMap[Number(item?.asset_in)]?.denom
                        )}{" "}
                        -
                        {denomConversion(
                          assetMap[Number(item?.asset_out)]?.denom
                        )}
                      </div>
                    </div>
                    <div className="header2 d-flex">
                      <div>
                        <div className="upper-label">Available to borrow</div>
                        <AvailableToBorrow
                          eMode={true}
                          assetInn={Number(item?.asset_in)}
                          assetOut={Number(item?.asset_out)}
                          lendPool={{
                            poolId: Number(item?.asset_out_pool_id),
                          }}
                        />
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
                          <tr>
                            <th>
                              {denomConversion(
                                assetMap[Number(item?.asset_in)]?.denom
                              )}
                            </th>
                            <td>
                              <AssetApy
                                poolId={Number(item?.asset_in_pool_id)}
                                assetId={Number(item?.asset_in)}
                                parent="lend"
                              />
                            </td>
                            <td>
                              <div className="d-flex">
                                <AssetApy
                                  poolId={Number(item?.asset_in_pool_id)}
                                  assetId={Number(item?.asset_in)}
                                  parent="borrow"
                                />
                                <Tooltip
                                  placement="topLeft"
                                  className="distribution-apy-button"
                                  title={"Boosted rewards for Borrowing"}
                                >
                                  <DistributionAPY
                                    poolId={Number(item?.asset_in_pool_id)}
                                    assetId={Number(item?.asset_in)}
                                  />
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>
                              {denomConversion(
                                assetMap[Number(item?.asset_out)]?.denom
                              )}
                            </th>
                            <td>
                              <AssetApy
                                poolId={Number(item?.asset_out_pool_id)}
                                assetId={Number(item?.asset_out)}
                                parent="lend"
                              />
                            </td>
                            <td>
                              <div className="d-flex">
                                <AssetApy
                                  poolId={Number(item?.asset_out_pool_id)}
                                  assetId={Number(item?.asset_out)}
                                  parent="borrow"
                                />
                                <Tooltip
                                  placement="topLeft"
                                  className="distribution-apy-button"
                                  title={"Boosted rewards for Borrowing"}
                                >
                                  <DistributionAPY
                                    poolId={Number(item?.asset_out_pool_id)}
                                    assetId={Number(item?.asset_out)}
                                  />
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center w-100">
                <h1>Sorry, No Data Found</h1>{" "}
              </div>
            )
          ) : result?.length > 0 ? (
            result &&
            result.map((item, i) => (
              <div
                key={i}
                className="market-list-item"
                onClick={() =>
                  navigate({
                    pathname: `/e-mode-details/${Number(
                      item.asset_in_pool_id
                    )}/${Number(item.asset_in)}/${Number(
                      item.asset_out
                    )}/${Number(item.id)}`,
                  })
                }
              >
                <div className="commodo-card">
                  <div className="header1 emode-header">
                    <div className="assets-col mr-3">
                      <div className="assets-icon">
                        <SvgIcon
                          name={iconNameFromDenom(
                            assetMap[Number(item?.asset_in)]?.denom
                          )}
                        />
                      </div>
                      <div className="assets-icon">
                        <SvgIcon
                          name={iconNameFromDenom(
                            assetMap[Number(item?.asset_out)]?.denom
                          )}
                        />
                      </div>
                      {denomConversion(assetMap[Number(item?.asset_in)]?.denom)}{" "}
                      -
                      {denomConversion(
                        assetMap[Number(item?.asset_out)]?.denom
                      )}
                    </div>
                  </div>
                  <div className="header2 d-flex">
                    <div>
                      <div className="upper-label">Available to borrow</div>
                      {/* <div className="header2-inner">
              <div className="assets-col mr-3">
                <div className="assets-icon">
                  <SvgIcon
                    name={iconNameFromDenom(
                      assetMap[Number(item?.asset_in)]?.denom
                    )}
                  />
                </div>
                2.7M
                {`$${commaSeparatorWithRounding(
Number(
amountConversion(
  marketPrice(
    markets,
    assetStats?.balance?.denom,
    assetDenomMap[assetStats?.balance?.denom]?.id
  ) * assetStats?.balance.amount || 0,
  assetDenomMap[assetStats?.balance?.denom]?.decimals
)
),
DOLLAR_DECIMALS
)}`}
              </div>
              <div className="assets-col mr-3">
                <div className="assets-icon">
                  <SvgIcon
                    name={iconNameFromDenom(
                      assetMap[Number(item?.asset_out)]?.denom
                    )}
                  />
                </div>
                1.8M
              </div>
            </div> */}
                      <AvailableToBorrow
                        eMode={true}
                        assetInn={Number(item?.asset_in)}
                        assetOut={Number(item?.asset_out)}
                        lendPool={{
                          poolId: Number(item?.asset_out_pool_id),
                        }}
                      />
                    </div>

                    {/* <div className="pl-3">
            <div className="upper-label">TVL</div>
            <div className="tvl-col mt-2">22.34%</div>
          </div> */}
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
                        <tr>
                          <th>
                            {denomConversion(
                              assetMap[Number(item?.asset_in)]?.denom
                            )}
                          </th>
                          <td>
                            <AssetApy
                              poolId={Number(item?.asset_in_pool_id)}
                              assetId={Number(item?.asset_in)}
                              parent="lend"
                            />
                          </td>
                          <td>
                            <div className="d-flex">
                              <AssetApy
                                poolId={Number(item?.asset_in_pool_id)}
                                assetId={Number(item?.asset_in)}
                                parent="borrow"
                              />
                              <Tooltip
                                placement="topLeft"
                                className="distribution-apy-button"
                                title={"Boosted rewards for Borrowing"}
                              >
                                <DistributionAPY
                                  poolId={Number(item?.asset_in_pool_id)}
                                  assetId={Number(item?.asset_in)}
                                />
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>
                            {denomConversion(
                              assetMap[Number(item?.asset_out)]?.denom
                            )}
                          </th>
                          <td>
                            <AssetApy
                              poolId={Number(item?.asset_out_pool_id)}
                              assetId={Number(item?.asset_out)}
                              parent="lend"
                            />
                          </td>
                          <td>
                            <div className="d-flex">
                              <AssetApy
                                poolId={Number(item?.asset_out_pool_id)}
                                assetId={Number(item?.asset_out)}
                                parent="borrow"
                              />
                              <Tooltip
                                placement="topLeft"
                                className="distribution-apy-button"
                                title={"Boosted rewards for Borrowing"}
                              >
                                <DistributionAPY
                                  poolId={Number(item?.asset_out_pool_id)}
                                  assetId={Number(item?.asset_out)}
                                />
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))
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

EmodeList.propTypes = {
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

export default connect(stateToProps, actionsToProps)(EmodeList);
