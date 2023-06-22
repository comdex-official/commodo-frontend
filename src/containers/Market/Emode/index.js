import { Button, message, Spin, Tooltip } from "antd";
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

const EmodeList = ({ assetMap, setPools, pools, lendPools, userLendList }) => {
  const [inProgress, setInProgress] = useState(false);
  const [eModData, setEModData] = useState(false);

  const fetchLendPools = () => {
    setInProgress(true);
    queryEMode((error, result) => {
      setInProgress(false);

      if (error) {
        message.error(error);
        return;
      }
      console.log(result?.data);
      setEModData(result?.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetchLendPools();
  };

  console.log(eModData);

  const navigate = useNavigate();

  if (inProgress) {
    return <Spin />;
  }

  return (
    <div className="commodo-card bg-none">
      <div className="card-header d-flex align-items-center justify-content-between mb-3 ">
        <div>E-MODE markets</div>
        <div className="market-header-right">
          <Button onClick={() => navigate({ pathname: `/market` })}>
            Market
          </Button>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title="Lend and Borrow in one click"
          >
            <Button onClick={() => navigate({ pathname: `/borrow/direct` })}>
              Direct Borrow
            </Button>
          </Tooltip>
          <Button
            onClick={() => navigate({ pathname: `/deprecated-cpool/${1}` })}
          >
            Deprecated cPool
          </Button>
        </div>
      </div>
      <div className="card-content">
        <div className="market-list">
          {eModData &&
            eModData.map((item, i) => (
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
            ))}
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
