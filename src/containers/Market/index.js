import * as PropTypes from "prop-types";
import { Col, Row } from "../../components/common";
import { connect } from "react-redux";
import Supply from "./Supply";
import Borrow from "./Borrow"
import "./index.less";

const Market = () => {
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <Supply/>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Borrow/>
        </Col>
      </Row>
    </div>
  );
};

Market.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(Market);
