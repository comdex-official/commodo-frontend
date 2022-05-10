import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../../components/common";
import { connect } from "react-redux";
import variables from "../../../utils/variables";
import { Button, List } from "antd";
import "./index.less";

const BorrowTab = (lang) => {
  const data = [
    {
      title: "Total Borrowed",
      counts: '$1,234.20'
    },
    {
      title: "Available",
      counts: "$1,234.20"
    },
    {
      title: "Utilization",
      counts: "30.45%"
    },
    {
      title: "Borrow APY",
      counts: "30.45%"
    }
  ];
  return (
    <div className="details-wrapper">
      <div className="details-left commodo-card">
          
      </div>
      <div className="details-right">
      <div className="commodo-card">
            <div className="card-head">
              <div className="head-left">
                <div className="assets-col">
                  <div className="assets-icon">
                    <SvgIcon name="atom-icon" />
                  </div>
                  USCX
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
                md: 3,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
              dataSource={data}
              renderItem={item => (
                <List.Item>
                    <div>
                      <p>{item.title}</p>
                      <h3>{item.counts}</h3>
                    </div>
                </List.Item>
              )}
            />
          </div>
          <div className="commodo-card">
            <div className="card-head">
              <div className="head-left">
                <div className="assets-col">
                  <div className="assets-icon">
                    <SvgIcon name="atom-icon" />
                  </div>
                  USCX
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
                md: 3,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
              dataSource={data}
              renderItem={item => (
                <List.Item>
                    <div>
                      <p>{item.title}</p>
                      <h3>{item.counts}</h3>
                    </div>
                </List.Item>
              )}
            />
          </div>
      </div>
  </div>
  );
};

BorrowTab.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(BorrowTab);
