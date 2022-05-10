import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../../components/common";
import { connect } from "react-redux";
import variables from "../../../utils/variables";
import { Button, Tabs } from "antd";
import BorrowTab from "./Borrow";
import RepayTab from "./Repay";
import "./index.less";

const { TabPane } = Tabs;

const DetailsView = (lang) => {
  return (
    <div className="app-content-wrapper">
        <Row>
            <Col>
                <Tabs className="commodo-tabs" defaultActiveKey="1">
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

DetailsView.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(DetailsView);
