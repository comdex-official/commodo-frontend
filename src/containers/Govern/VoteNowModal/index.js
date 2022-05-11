import * as PropTypes from "prop-types";
import { Button, Radio, Modal, Space } from "antd";
import { Row, Col } from "../../../components/common";
import { connect } from "react-redux";
import React, { useState } from "react";
import variables from "../../../utils/variables";
import "./index.less"

const VoteNowModal = () => {
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
      <Button type="primary" className="btn-filled mb-n4" onClick={showModal}>Vote Now</Button>
      <Modal
        centered={true}
        className="votenow-modal"
        footer={null}
        header={null}
        visible={isModalVisible}
        width={550}
        closable={false}
        onOk={handleOk}
        closeIcon={null}
      >
        <div className="votenow-modal-inner">
          <Row>
            <Col sm="12">
              <h3>Your Vote</h3>
              <p>#2 Lorem Ipsum diote Lorem Ipsum diote Lorem Ipsum diote</p>
              <Radio.Group name="radiogroup">
                <Space direction="vertical">
                  <Radio value={1}>Yes</Radio>
                  <Radio value={2}>No</Radio>
                  <Radio value={3}>NoWithVeto</Radio>
                  <Radio value={4}>Abstain</Radio>
                </Space>
              </Radio.Group>
            </Col>
          </Row>
          <Row className="p-0">
            <Col className="text-right mt-3">
              <Button type="primary" className="px-5 mr-3" size="large" onClick={handleCancel}>
                Delete
              </Button>
              <Button type="primary" className="btn-filled px-5" size="large" onClick={handleCancel}>
                Confirm
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

VoteNowModal.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(VoteNowModal);
