import * as PropTypes from "prop-types";
import { Button, Modal, Checkbox, Form, Slider, Divider } from "antd";
import { Row, Col, SvgIcon } from "../../../components/common";
import { connect } from "react-redux";
import React, { useState } from "react";
import "./index.less";

const marks = {
  0: "00:00hrs",
  100: "3d:00h:00m",
};

const FilterModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        className="filter-button"
        type="primary"
        size="small"
        onClick={showModal}
        icon={<SvgIcon name="filter" viewbox="0 0 13.579 13.385" />}
      >
        Filter
      </Button>
      <Modal
        centered={true}
        className="filter-modal"
        footer={null}
        header={null}
        visible={isModalVisible}
        width={530}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={<SvgIcon name="close" viewbox="0 0 19 19" />}
        title="Filter"
      >
        <div className="filter-modal-inner">
          <Form layout="vertical">
            <Row>
              <Col sm="12">
                <label className="labels">Auctioned Asset</label>
                <Checkbox>ATOM</Checkbox>
                <Checkbox>XPRT</Checkbox>
                <Checkbox>AKT</Checkbox>
                <Checkbox>CMDX</Checkbox>
                <Checkbox>DVPN</Checkbox>
              </Col>
            </Row>
            <Row>
              <Col>
                <Divider />
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <label className="labels">Bidding Asset</label>
                <Checkbox>CMST</Checkbox>
              </Col>
            </Row>
            <Row>
              <Col>
                <Divider />
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <div className="filter-timer">
                  <label className="labels">Timer</label>
                  <div className="timer-card">1d:12h:1m</div>
                </div>
                <Slider
                  marks={marks}
                  defaultValue={37}
                  tooltipVisible={false}
                  className="commodo-slider"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Divider />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col className="text-left">
                <Button type="primary" size="large" onClick={handleCancel} block>
                  Cancel
                </Button>
              </Col>
              <Col className="text-right">
                <Button type="primary" className="btn-filled" size="large" onClick={handleOk} block>
                  Apply
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
};

FilterModal.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(FilterModal);
