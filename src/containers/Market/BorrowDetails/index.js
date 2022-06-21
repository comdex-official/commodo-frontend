import * as PropTypes from "prop-types";
import { Col, Row } from "../../../components/common";
import { connect } from "react-redux";
import { Button, Tabs } from "antd";
import BorrowTab from "./Borrow";
import RepayTab from "./Repay";
import "./index.less";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;

const BackButton = {
  right: (
    <Link to="/market">
      <Button className="back-btn" type="primary">
        Back
      </Button>
    </Link>
  ),
};

const BorrowDetails = () => {
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <Tabs
            className="commodo-tabs"
            defaultActiveKey="1"
            tabBarExtraContent={BackButton}
          >
            <TabPane tab="Borrow" key="1">
              <BorrowTab />
            </TabPane>
            <TabPane tab="Repay" key="2">
              <RepayTab />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

BorrowDetails.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(BorrowDetails);
