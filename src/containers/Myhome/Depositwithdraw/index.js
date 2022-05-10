import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../../components/common";
import { connect } from "react-redux";
import variables from "../../../utils/variables";
import { Button, Tabs } from "antd";
import WithdrawTab from "./Withdraw";
import DepositTab from "./Deposit";
import "./index.less";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;

const BackButton = {
  right: <Link to="/myhome"><Button className="back-btn" type="primary">Back</Button></Link>
}

const Deposit = (lang) => {
  return (
    <div className="app-content-wrapper">
        <Row>
            <Col>
                <Tabs className="commodo-tabs" defaultActiveKey="1" tabBarExtraContent={BackButton}>
                    <TabPane tab="Deposit" key="1">
                      <DepositTab />
                    </TabPane>
                    <TabPane tab="Withdraw" key="2">
                      <WithdrawTab />
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
    </div>
  );
};

Deposit.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Deposit);
