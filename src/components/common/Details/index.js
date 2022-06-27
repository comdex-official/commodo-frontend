import { SvgIcon, TooltipIcon } from "../index";
import { List } from "antd";
import * as PropTypes from "prop-types";
import { denomConversion } from "../../../utils/coin";
import { iconNameFromDenom } from "../../../utils/string";

const Details = ({ asset }) => {
  const data = [
    {
      title: "Total Deposited",
      counts: "$1,234.20",
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
      counts: "8.92%",
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
          <span>Oracle Price</span> : $123.45
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
};

export default Details;
