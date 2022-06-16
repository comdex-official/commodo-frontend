import * as PropTypes from "prop-types";
import { Button, Modal, Input, Form } from "antd";
import { Row, Col, SvgIcon } from "../../../components/common";
import { connect } from "react-redux";
import React, { useState } from "react";
import variables from "../../../utils/variables";
import "./index.less"

const DepositModal = (lang) => {
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
      <Button type="primary" size="small" onClick={showModal}>Deposit</Button>
      <Modal
        centered={true}
        className="assets-modal"
        footer={null}
        header={null}
        visible={isModalVisible}
        width={550}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={<SvgIcon name="close" viewbox="0 0 19 19" />}
        title="IBC Deposit"
      >
        <div className="assets-modal-inner">
          <Form layout="vertical">
            <Row>
              <Col>
                <Form.Item label="From">
                  <Input type="text" />
                </Form.Item>
              </Col>
              <SvgIcon name="arrow-right" viewbox="0 0 17.04 15.13" />
              <Col>
                <Form.Item label="To">
                  <Input type="text" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col className="position-relative mt-3">
                <div className="availabe-balance">
                  Available
                  <span className="ml-1">
                    1,400 ATOM
                  </span>
                </div>
                <Form.Item label="Amount to Deposit" className="assets-input-box">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row className="p-0">
              <Col className="text-center mt-3">
                <Button type="primary" className="btn-filled px-5" size="large" onClick={handleCancel}>
                  Deposit
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
};

DepositModal.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(DepositModal);
