import { Button, Checkbox, Divider, Form, Modal, Slider } from "antd";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { setAuctionedAsset } from "../../../actions/auction";
import { setSelectedAuctionedAsset } from '../../../actions/auction'
import { Col, Row, SvgIcon } from "../../../components/common";
import { SET_AUCTIONED_ASSET } from "../../../constants/auction";
import "./index.less";

const marks = {
  0: "00:00hrs",
  100: "3d:00h:00m",
};

const FilterModal = ({ auctions, setAuctions, selectedAuctionedAsset, setSelectedAuctionedAsset }) => {
  const dispatch = useDispatch()
  const auctionedAsset = useSelector((state) => state.auction.auctionedAsset[0])
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedAuctionedAsset, setSelectedAuctionedAsset] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState([])
  const [auctionedAsseted, setAuctionedAsseted] = useState([{
    atom: false,
    akt: false,
    cmdx: false,
    dvpn: false
  }])
  let newSelectedAsset = new Array();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // selectedAuctionedAssets()
    dispatch(setAuctionedAsset(auctionedAsseted))
    setSelectedAuctionedAsset(selectedAsset)
    setIsModalVisible(false);

  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChange = (e) => {
    let removedData;
    setAuctionedAsseted([{ ...auctionedAsseted[0], [e.target.name]: e.target.checked }])
    // console.log({ [e.target.name]: e.target.checked });
    if (e.target.checked) {
      // console.log([e.target.name], "yes true");
      // setSelectedAuctionedAsset((prev) => [...prev, e.target.name])
      setSelectedAsset((prev) => [...prev, e.target.name])
    }
    else {
      console.log([e.target.name], "No false ");
      let name = [e.target.name]
      removedData = selectedAsset.filter(function (item) {
        return item !== name[0]
      })
      // console.log(removedData, "removedData");
      // setSelectedAuctionedAsset(removedData)
      setSelectedAsset(removedData)
    }
    // dispatch(setAuctionedAsset([{ ...auctionedAsset, [e.target.name]: e.target.checked }]))
  };

  const selectedAuctionedAssets = () => {

    let entries = Object.entries(auctionedAsseted[0])
    let data = entries.map(([key, val] = entry) => {
      if (auctionedAsseted[0][key] === true) {
        console.log(`${key}: ${val}, Data object single`);
        console.log({ key: val });
      }
    });
  }


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
                <Checkbox name="atom" onChange={(e) => { onChange(e) }}>ATOM</Checkbox>
                <Checkbox name="akt" onChange={onChange}>AKT</Checkbox>
                <Checkbox name="cmdx" onChange={onChange}>CMDX</Checkbox>
                <Checkbox name="dvpn" onChange={onChange}>DVPN</Checkbox>
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
                <Button
                  type="primary"
                  size="large"
                  onClick={handleCancel}
                  block
                >
                  Cancel
                </Button>
              </Col>
              <Col className="text-right">
                <Button
                  type="primary"
                  className="btn-filled"
                  size="large"
                  onClick={handleOk}
                  block
                >
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
  selectedAuctionedAsset: PropTypes.array,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    selectedAuctionedAsset: state.auction.selectedAuctionedAsset,
  };
};

const actionsToProps = {
  setSelectedAuctionedAsset,
};

export default connect(stateToProps, actionsToProps)(FilterModal);
