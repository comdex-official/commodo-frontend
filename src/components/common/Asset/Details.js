import { List, message } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setAssetStatMap } from "../../../actions/asset";
import { ibcDenoms } from "../../../config/network";
import {
  DOLLAR_DECIMALS,
  ZERO_DOLLAR_DECIMALS,
} from "../../../constants/common";
import {
  queryAssetPoolFundBalance,
  queryModuleBalance,
  QueryPoolAssetLBMapping,
} from "../../../services/lend/query";
import {
  amountConversion,
  commaSeparatorWithRounding,
  denomConversion,
} from "../../../utils/coin";
import {
  commaSeparator,
  decimalConversion,
  formatNumber,
  marketPrice,
} from "../../../utils/number";
import { iconNameFromDenom } from "../../../utils/string";
import DistributionAPY from "../DistributionAPY";
import { SvgIcon, TooltipIcon } from "../index";

const Details = ({
  assetId,
  assetDenom,
  poolId,
  markets,
  refreshBalance,
  parent,
  assetDenomMap,
  setAssetStatMap,
}) => {
  const [stats, setStats] = useState();
  const [moduleBalanceStats, setModuleBalanceStats] = useState([]);
  const [assetPoolFunds, setAssetPoolFunds] = useState({});

  console.log(stats);
  useEffect(() => {
    if (assetId && poolId) {
      QueryPoolAssetLBMapping(assetId, poolId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }
        console.log(result?.PoolAssetLBMapping);
        setStats(result?.PoolAssetLBMapping);
      });

      queryAssetPoolFundBalance(assetId, poolId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }
        console.log(result?.amount);
        setAssetPoolFunds(result?.amount);
      });
    } else if (stats?.poolId) {
      setStats();
    }
  }, [assetId, poolId, refreshBalance]);

  useEffect(() => {
    if (poolId) {
      queryModuleBalance(poolId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        setModuleBalanceStats(result?.ModuleBalance?.moduleBalanceStats);
      });
    }
  }, [poolId, refreshBalance]);

  let assetStats = moduleBalanceStats?.filter(
    (item) => item?.assetId?.toNumber() === Number(assetId)
  )[0];

  console.log(moduleBalanceStats);

  useEffect(() => {
    setAssetStatMap(assetId, assetStats?.balance);
  }, [assetStats]);

  let data = [
    {
      title: parent === "lend" ? "Deposited" : "Borrowed",
      counts: `$${formatNumber(
        Number(
          amountConversion(
            (parent === "lend" ? stats?.totalLend : stats?.totalBorrowed) || 0
          ) * marketPrice(markets, assetDenom, assetDenomMap[assetDenom]?.id),
          assetDenomMap[assetDenom]?.decimals
        ) +
          (parent === "lend"
            ? Number(
                amountConversion(
                  assetPoolFunds?.amount,
                  assetDenomMap[assetPoolFunds?.denom]?.decimals
                ) *
                  marketPrice(
                    markets,
                    assetPoolFunds?.denom,
                    assetDenomMap[assetPoolFunds?.denom]?.id
                  )
              )
            : 0),
        DOLLAR_DECIMALS
      )}`,
      tooltipText:
        parent === "lend" ? "Total funds Deposited" : "Total funds Borrowed",
    },
    {
      title: "Available",
      counts: `$${formatNumber(
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
        ZERO_DOLLAR_DECIMALS
      )}`,

      tooltipText:
        parent === "lend" ? "Total funds Available" : "Total funds Available",
    },
    {
      title: "Utilization",
      counts: (
        <>
          {Number(decimalConversion(stats?.utilisationRatio) * 100).toFixed(
            DOLLAR_DECIMALS
          )}
          %
        </>
      ),
      tooltipText:
        parent === "lend" ? "Asset Utilization" : "Asset Utilization",
    },
    {
      title: parent === "lend" ? "Lend APY" : "Borrow APY",
      counts: (
        <>
          <>
            {Number(
              decimalConversion(
                parent === "lend" ? stats?.lendApr : stats?.borrowApr
              ) * 100
            ).toFixed(DOLLAR_DECIMALS)}
            %
          </>
          {/* TODO: take the condition dynamically */}
          {parent === "lend" ? null : assetDenom === "uatom" ||
            assetDenom === ibcDenoms["uatom"] ||
            assetDenom === "ucmst" ? (
            <DistributionAPY assetId={assetId} poolId={poolId} margin={"top"} />
          ) : null}
        </>
      ),
      tooltipText:
        parent === "lend" ? "Lend APY of Asset" : "Borrow APY of Asset",
    },
  ];

  return (
    <>
      <div className="card-head">
        <div className="head-left">
          <div className="assets-col">
            <div className="assets-icon">
              <SvgIcon name={iconNameFromDenom(assetDenom)} />
            </div>
            {denomConversion(assetDenom)}
          </div>
        </div>
        <div className="head-right">
          <span>Oracle Price</span> : $
          {commaSeparator(
            Number(
              marketPrice(markets, assetDenom, assetDenomMap[assetDenom]?.id)
            ).toFixed(DOLLAR_DECIMALS)
          )}
        </div>
      </div>
      <List
        grid={{
          gutter: 16,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div>
              <p>
                {item.title} <TooltipIcon text={item.tooltipText} />
              </p>
              <h3>{item.counts}</h3>
            </div>
          </List.Item>
        )}
      />
    </>
  );
};

Details.propTypes = {
  refreshBalance: PropTypes.number.isRequired,
  setAssetStatMap: PropTypes.func.isRequired,
  assetId: PropTypes.number,
  assetDenom: PropTypes.string,
  assetDenomMap: PropTypes.object,
  markets: PropTypes.object,
  newBalance: PropTypes.number,
  parent: PropTypes.string,
  poolId: PropTypes.shape({
    low: PropTypes.number,
  }),
};

const stateToProps = (state) => {
  return {
    markets: state.oracle.market,
    refreshBalance: state.account.refreshBalance,
    assetDenomMap: state.asset._.assetDenomMap,
  };
};

const actionsToProps = {
  setAssetStatMap,
};

export default connect(stateToProps, actionsToProps)(Details);
