import { SvgIcon, TooltipIcon } from "../index";
import { List, message } from "antd";
import * as PropTypes from "prop-types";
import {
  amountConversionWithComma,
  denomConversion,
} from "../../../utils/coin";
import { iconNameFromDenom } from "../../../utils/string";
import { useEffect, useState } from "react";
import { queryAssetStats } from "../../../services/lend/query";
import { decimalConversion, marketPrice } from "../../../utils/number";
import { DOLLAR_DECIMALS } from "../../../constants/common";
import { connect } from "react-redux";

const Details = ({ asset, poolId, markets }) => {
  const [stats, setStats] = useState();

  useEffect(() => {
    if (asset?.id && poolId) {
      queryAssetStats(asset?.id, poolId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        setStats(result?.AssetStats);
      });
    }
  }, [asset, poolId]);

  const data = [
    {
      title: "Total Deposited",
      counts: `$${amountConversionWithComma(
        Number(stats?.totalLend || 0) * marketPrice(markets, asset?.denom),
        DOLLAR_DECIMALS
      )}`,
    },
    {
      title: "Total Borrowed",
      counts: `$${amountConversionWithComma(
        Number(stats?.totalBorrowed || 0) * marketPrice(markets, asset?.denom),
        DOLLAR_DECIMALS
      )}`,
    },
    {
      title: "Available",
      counts: "$1,234.20",
    },
    {
      title: "Utilization",
      counts: "30.45%",
    },
    {
      title: "Deposit APY",
      counts: <>{Number(decimalConversion(stats?.lendApr)) * 100}%</>,
    },
    {
      title: "Borrow APY",
      counts: <>{Number(decimalConversion(stats?.borrowApr)) * 100}%</>,
    },
  ];

  return (
    <>
      <div className="card-head">
        <div className="head-left">
          <div className="assets-col">
            <div className="assets-icon">
              <SvgIcon name={iconNameFromDenom(asset?.denom)} />
            </div>
            {denomConversion(asset?.denom)}
          </div>
        </div>
        <div className="head-right">
          <span>Oracle Price</span> : ${marketPrice(markets, asset?.denom)}
        </div>
      </div>
      <List
        grid={{
          gutter: 16,
          xs: 2,
          sm: 2,
          md: 2,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div>
              <p>
                {item.title} <TooltipIcon />
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
  asset: PropTypes.shape({
    denom: PropTypes.string,
  }),
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.string,
    })
  ),
  poolId: PropTypes.shape({
    low: PropTypes.number,
  }),
};

const stateToProps = (state) => {
  return {
    markets: state.oracle.market.list,
  };
};

export default connect(stateToProps)(Details);
