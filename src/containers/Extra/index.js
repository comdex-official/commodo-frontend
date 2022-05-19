import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Modal, Button } from "antd";
import "./index.less";

const { confirm } = Modal;

const Extra = (lang) => {
  function showConfirm() {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <SvgIcon name='info-icon' viewbox='0 0 9 9' />,
      content: 'Some descriptions',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <Button onClick={showConfirm}>Confirm</Button>
        </Col>
      </Row>
    </div>
  );
};

Extra.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Extra);
