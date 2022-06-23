import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../../components/common";
import { connect } from "react-redux";
import { Button, List, Select, Input, Progress } from "antd";
import "./index.less";

const { Option } = Select;

const CloseTab = () => {
  const data = [
    {
      title: "Total Borrowed",
      counts: "$1,234.20",
    },
    {
      title: "Available",
      counts: "$1,234.20",
    },
    {
      title: "Utilization",
      counts: "30.45%",
    },
    {
      title: "Borrow APY",
      counts: "12.33%",
    },
  ];
  const data2 = [
    {
      title: "Total Borrowed",
      counts: "$1,234.20",
    },
    {
      title: "Available",
      counts: "$1,234.20",
    },
    {
      title: "Utilization",
      counts: "30.45%",
    },
    {
      title: "Borrow APY",
      counts: "13.33%",
    },
  ];
  const data3 = [
    {
      title: "Total Borrowed",
      counts: "$1,234.20",
    },
    {
      title: "Available",
      counts: "$1,234.20",
    },
    {
      title: "Utilization",
      counts: "30.45%",
    },
    {
      title: "Borrow APY",
      counts: "12.76%",
    },
  ];
  return (
    <div className="details-wrapper">
      <div className="details-left commodo-card">
        <div className="assets-select-card mb-4">
          <div className="assets-left">
            <label className="left-label">
              Repay Asset <TooltipIcon text="" />
            </label>
            <div className="assets-select-wrapper">
              <Select
                className="assets-select"
                dropdownClassName="asset-select-dropdown"
                defaultValue="1"
                placeholder={
                  <div className="select-placeholder">
                    <div className="circle-icon">
                      <div className="circle-icon-inner" />
                    </div>
                    Select
                  </div>
                }
                defaultActiveFirstOption={true}
                suffixIcon={
                  <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                }
              >
                <Option key="1">
                  <div className="select-inner">
                    <div className="svg-icon">
                      <div className="svg-icon-inner">
                        <SvgIcon name="cmst-icon" />
                      </div>
                    </div>
                    <div className="name">CMST</div>
                  </div>
                </Option>
                <Option key="2">
                  <div className="select-inner">
                    <div className="svg-icon">
                      <div className="svg-icon-inner">
                        <SvgIcon name="cmdx-icon" />
                      </div>
                    </div>
                    <div className="name">CMXD</div>
                  </div>
                </Option>
                <Option key="3">
                  <div className="select-inner">
                    <div className="svg-icon">
                      <div className="svg-icon-inner">
                        <SvgIcon name="atom-icon" />
                      </div>
                    </div>
                    <div className="name">Atom</div>
                  </div>
                </Option>
                <Option key="4">
                  <div className="select-inner">
                    <div className="svg-icon">
                      <div className="svg-icon-inner">
                        <SvgIcon name="osmosis-icon" />
                      </div>
                    </div>
                    <div className="name">OSMO</div>
                  </div>
                </Option>
              </Select>
            </div>
          </div>
          <div className="assets-right">
            <div className="label-right">
              Available
              <span className="ml-1">142 CMST</span>
              <div className="max-half">
                <Button className="active">Max</Button>
              </div>
            </div>
            <div>
              <div className="input-select">
                <Input placeholder="" value="23.00" />
              </div>
              <small>$120.00</small>
            </div>
          </div>
        </div>
        <Row>
          <Col sm="12" className="mt-2 mx-auto card-bottom-details">
            <Row>
              <Col>
                <label>Remaining to Repay</label>
                <p className="remaining-infotext mt-1">
                  You don’t have enough funds to repay the full amount
                </p>
              </Col>
              <Col className="text-right">
                <div>123.45 CMST</div>
                <small className="font-weight-light">$420.00</small>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Current Health Factor</label>
              </Col>
              <Col className="text-right">90%</Col>
            </Row>
            <Row className="pb-2">
              <Col>
                <Progress className="commodo-progress" percent={30} />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Liquidation Threshold</label>
              </Col>
              <Col className="text-right">80%</Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Liquidation Penalty</label>
              </Col>
              <Col className="text-right">5%</Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn">
          <Button type="primary" className="btn-filled">
            Close
          </Button>
        </div>
      </div>
      <div className="details-right">
        
      </div>
    </div>
  );
};

CloseTab.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(CloseTab);
