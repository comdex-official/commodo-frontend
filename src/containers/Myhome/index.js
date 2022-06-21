import * as PropTypes from "prop-types";
import { Col, Row, TooltipIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Progress, Tabs, List } from "antd";
import Deposit from "./Deposit";
import Borrow from "./Borrow";
import History from "./History";
import "./index.less";

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

const data = [
  {
    title: <>Total Deposited <TooltipIcon text="Value of total Asset Deposited by User" /></>,
    counts: '$12,350'
  },
  {
    title: <>Total Borrowed <TooltipIcon text="Value of total Asset Borrowed by User" /></>,
    counts: "$2,345"
  }
];

const Myhome = (lang) => {
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card myhome-upper">
            <div className="myhome-upper-left">
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 2,
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
            <div className="myhome-upper-right">
              <div className="mb-3">Your Borrow Limit <TooltipIcon text="Borrow limit of User" /></div>
              <div className="borrow-limit-bar">
                <div className="borrow-limit-upper">
                  <div><h4>25%</h4></div>
                  <div className="small-text">Borrow Limit :$7255</div>
                </div>
                <div className="borrow-limit-middle">
                  <Progress percent={25} size="small" />
                </div>
                <div className="borrow-limit-bottom">
                  <div className="small-text">Collateral :$12,150</div>
                  <div className="small-text">Borrowed :$2345</div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs className="commodo-tabs" defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Deposit" key="1">
              <Deposit />
            </TabPane>
            <TabPane tab="Borrow" key="2">
              <Borrow />
            </TabPane>
            <TabPane tab="History" key="3">
              <History />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

Myhome.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Myhome);