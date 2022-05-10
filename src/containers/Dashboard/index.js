import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table } from "antd";
import TooltipIcon from "../../components/TooltipIcon";
import "./index.less";

const Dashboard = (lang) => {
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          
        </Col>
      </Row>
    </div>
  );
};

Dashboard.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Dashboard);
