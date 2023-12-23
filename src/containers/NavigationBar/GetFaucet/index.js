import React, { useState } from "react";
import { Button, Modal, Input } from "antd";
import { SvgIcon } from "../../../components/common";
import "./index.scss";

const GetFaucet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        className="mr-3 faucet-btn"
        icon={<SvgIcon name="faucet-icon" viewbox="0 0 14.78 14.954" />}
      >
        Faucet
      </Button>
      <Modal
        centered
        width={800}
        className="faucet-modal"
        title={false}
        closable={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <Button
            type="primary"
            className="btn-filled"
            size="large"
            onClick={handleOk}
          >
            Send Tokens
          </Button>
        }
      >
        <h1>Get Faucet</h1>
        <p>Enter your comdex address to get the faucet tokens</p>
        <div>
          <Input placeholder="Enter your comdex address" />
        </div>
      </Modal>
    </>
  );
};

export default GetFaucet;
