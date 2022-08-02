import * as PropTypes from "prop-types";
import { Button, Input, Modal } from "antd";
import { Row, Col, SvgIcon } from "../../../components/common";
import { connect } from "react-redux";
import React, { useState } from "react";
import variables from "../../../utils/variables";
import "./index.less";

const PlaceBidModal = () => {
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
      <Button type="primary" size="small" className="px-3" onClick={showModal}>
        {" "}
        Place Bid{" "}
      </Button>
      <Modal
        centered={true}
        className="place-bid-modal"
        footer={null}
        header={null}
        visible={isModalVisible}
        width={550}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon={<SvgIcon name="close" viewbox="0 0 19 19" />}
      >
        <div className="place-bid-modal-inner">
          <div>
            <Row>
              <Col sm="6">
                <p>Remaining Time</p>
              </Col>
              <Col sm="6" className="text-right">
                <label>0.00</label>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Opening Auction Price</p>
              </Col>
              <Col sm="6" className="text-right">
                <label>$0.36</label>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Collateral Auction Price</p>
              </Col>
              <Col sm="6" className="text-right">
                <label>$0.36</label>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Auctioned Quantity</p>
              </Col>
              <Col sm="6" className="text-right">
                <label>97,192.0000 CMDX</label>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Quantity Bid For</p>
              </Col>
              <Col sm="6" className="text-right">
                <Input defaultValue="0.00" className="input-primary inputbig" />
                <span className="small-label">CMDX</span>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Your CMST Bid</p>
              </Col>
              <Col sm="6" className="text-right">
                <label>0.00 CMDX</label>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Acceptable Max Price</p>
              </Col>
              <Col sm="6" className="text-right">
                <Input defaultValue="0.00" className="input-primary inputbig" />
                <span className="small-label">CMDX</span>
              </Col>
            </Row>
          </div>
          {/* Please use below div onclick input */}
          {/* <div>
            <Row>
              <Col sm="6">
                <p>Opening Bid</p>
              </Col>
              <Col sm="6" className="text-right">
                <label>10 CMST</label>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Top Bid</p>
              </Col>
              <Col sm="6" className="text-right">
                <label>11 CMST</label>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Your Bid</p>
              </Col>
              <Col sm="6" className="text-right">
                <Input className="input-primary" />
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <p>Auction Discount</p>
              </Col>
              <Col sm="6" className="text-right">
                <label>5 %</label>
              </Col>
            </Row>
          </div> */}
          <Row className="p-0">
            <Col className="text-center mt-3">
              <Button
                type="primary"
                className="btn-filled px-5"
                size="large"
                onClick={handleCancel}
              >
                Place Bid
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

PlaceBidModal.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(PlaceBidModal);