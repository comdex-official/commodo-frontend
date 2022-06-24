import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../../components/common";
import { connect } from "react-redux";
import { Button, List, Select, Input, Tooltip } from "antd";
import "./index.less";

const { Option } = Select;

const TooltipContent = <div className="token-details">
  <div className="tokencard-col">
    <div className="tokencard">
      <div className="tokencard-icon">
        <SvgIcon name="cmdx-icon" />
      </div>
      <p>Deposit CMDX</p>
    </div>
    <div className="tokencard with-shadow">
      <div className="tokencard-icon">
        <SvgIcon name="cmst-icon" />
      </div>
      <p>Deposit CMST</p>
    </div>
    <label>Token A</label>
  </div>
  <div className="middle-arrow">
    <SvgIcon name="token-arrow" viewbox="0 0 159 80.387" />
  </div>
  <div className="tokencard-col">
    <div className="tokencard with-shadow">
      <div className="tokencard-icon">
        <SvgIcon name="cmst-icon" />
      </div>
      <p>Borrow CMST</p>
    </div>
    <div className="tokencard">
      <div className="tokencard-icon">
        <SvgIcon name="osmosis-icon" />
      </div>
      <p>Borrow Osmo</p>
    </div>
    <label>Token B</label>
  </div>
</div>;

const BorrowTab = () => {
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
        <div className="assets-select-card mb-3">
          <div className="assets-left">
            <label className="left-label">
              Collateral Asset <TooltipIcon text="" />
            </label>
            <div className="assets-select-wrapper">
              <Select
                className="assets-select"
                dropdownClassName="asset-select-dropdown"
                defaultValue="2"
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
                    <div className="name">CMDX</div>
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
        <div className="assets-select-card mb-2">
          <div className="assets-left">
            <label className="left-label">
              Borrow Asset <TooltipIcon text="" />
            </label>
            <div className="assets-select-wrapper">
              <Select
                className="assets-select"
                dropdownClassName="asset-select-dropdown"
                defaultValue="4"
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
                    <div className="name">CMDX</div>
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
            <div>
              <div className="input-select">
                <Input placeholder="" value="23.00" />
              </div>
              <small>$120.00</small>
            </div>
          </div>
        </div>
        <Row>
          <Col>
            <Tooltip placement="right" color="#173629" title={TooltipContent} overlayClassName="token-overlay">
              <div className="borrowbottom-cards">
                <div className="cards">
                  <div className="cards-inner">
                    <div className="cards-colum">
                      <div className="inner-icon"><SvgIcon name="osmosis-icon" /></div>
                      <p>CMDX</p>
                    </div>
                    <SvgIcon className="longarrow-icon" name="long-arrow" viewbox="0 0 64 5.774" />
                    <div className="cards-colum">
                      <div className="inner-icon"><SvgIcon name="cmst-icon" /></div>
                      <p>CMST</p>
                    </div>
                  </div>
                </div>
                <SvgIcon className="longarrow-icon-middle" name="long-arrow" viewbox="0 0 64 5.774" />
                <div className="cards">
                  <div className="cards-inner">
                    <div className="cards-colum">
                      <div className="inner-icon"><SvgIcon name="cmst-icon" /></div>
                      <p>CMST</p>
                    </div>
                    <SvgIcon className="longarrow-icon" name="long-arrow"  viewbox="0 0 64 5.774" />
                    <div className="cards-colum">
                      <div className="inner-icon"><SvgIcon name="osmosis-icon" /></div>
                      <p>OSMO</p>
                    </div>
                  </div>
                </div>
              </div>
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col sm="12" className="mt-3 mx-auto card-bottom-details">
            <Row className="mt-2">
              <Col>
                <label>Current LTV</label>
              </Col>
              <Col className="text-right">35%</Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>MAx LTV</label>
              </Col>
              <Col className="text-right">40%</Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Borrow </label>
              </Col>
              <Col className="text-right">3.80%</Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <label>Liquidation Threshold</label>
              </Col>
              <Col className="text-right">10%</Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn">
          <Button type="primary" className="btn-filled">
            Borrow
          </Button>
        </div>
      </div>
      <div className="details-right">
        <div className="commodo-card">
          <div className="card-head">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name="cmst-icon" />
                </div>
                CMST
              </div>
              {/* <span className="percent-badge">
                +6.18 <SvgIcon name="commodo-icon" />
              </span> */}
            </div>
            <div className="head-right">
              <span>Oracle Price</span> : $123.45
            </div>
          </div>
          <List
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 2,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <p>
                    {item.title} <TooltipIcon />
                  </p>
                  <h3>{item.counts}</h3>
                </div>
              </List.Item>
            )}
          />
          <div className="card-head mt-5">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name="atom-icon" />
                </div>
                ATOM
              </div>
              {/* <span className="percent-badge">
                +6.18 <SvgIcon name="commodo-icon" />
              </span> */}
            </div>
            <div className="head-right">
              <span>Oracle Price</span> : $123.45
            </div>
          </div>
          <List
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 2,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={data2}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <p>
                    {item.title} <TooltipIcon />
                  </p>
                  <h3>{item.counts}</h3>
                </div>
              </List.Item>
            )}
          />
        </div>
        <div className="commodo-card">
          <div className="card-head">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name="cmdx-icon" />
                </div>
                CMDX
              </div>
              {/* <span className="percent-badge">
                +6.18 <SvgIcon name="commodo-icon" />
              </span> */}
            </div>
            <div className="head-right">
              <span>Oracle Price</span> : $123.45
            </div>
          </div>
          <List
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 2,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={data3}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <p>
                    {item.title} <TooltipIcon />{" "}
                  </p>
                  <h3>{item.counts}</h3>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

BorrowTab.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(BorrowTab);
