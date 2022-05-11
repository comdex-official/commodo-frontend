import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import variables from "../../utils/variables";
import { Button, List, Select, Progress } from "antd";
import "./index.less";

const { Option } = Select;

const data = [
  {
    title: "Total Staked",
    counts: '312.45'
  },
  {
    title: "Total Proposals",
    counts: "7"
  },
  {
    title: "Average Participation",
    counts: "50.12%"
  }
];

const Govern = (lang) => {
  const navigate = useNavigate();
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card myhome-upper d-block">
            <div className="myhome-upper-left w-100">
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 3,
                  xxl: 3,
                }}
                dataSource={data}
                renderItem={item => (
                  <List.Item>
                    <div>
                      <p>{item.title}</p>
                      <h3>{item.counts}</h3>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <div className="commodo-card govern-card">
            <div className="governcard-head">
              <Button type="primary" className="btn-filled">New Proposal</Button>
              <Button type="primary" className="btn-filled">Forum</Button>
              <Select defaultValue="lucy" className="select-primary ml-2" suffixIcon={<SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />} style={{ width: 120 }}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </div>
            <div className="govern-card-content">
              <div className="governlist-row" onClick={() => navigate("/govern-details")}>
                <div className="left-section">
                  <h3>Increasing MaxValidator to 100</h3>
                  <p>adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, </p>
                </div>
                <div className="right-section">
                  <Row>
                    <Col sm="6">
                      <label>Vote Starts :</label>
                      <p>24th April, 2022</p>
                    </Col>
                    <Col sm="6">
                      <label>Voting Ends :</label>
                      <p>26th April, 2022</p>
                    </Col>
                    <Col sm="6">
                      <label>Duration : </label>
                      <p>3 days</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Progress percent={30} size="small" />
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="governlist-row" onClick={() => navigate("/govern-details")}>
                <div className="left-section">
                  <h3>Increasing MaxValidator to 100</h3>
                  <p>adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, </p>
                </div>
                <div className="right-section">
                  <Row>
                    <Col sm="6">
                      <label>Vote Starts :</label>
                      <p>24th April, 2022</p>
                    </Col>
                    <Col sm="6">
                      <label>Voting Ends :</label>
                      <p>26th April, 2022</p>
                    </Col>
                    <Col sm="6">
                      <label>Duration : </label>
                      <p>3 days</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Progress percent={30} size="small" />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Govern.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Govern);
