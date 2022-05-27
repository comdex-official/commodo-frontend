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
                <Option value="f1">Passed</Option>
                <Option value="f2">Rejected</Option>
                <Option value="f3">Pending</Option>
                <Option value="f4">Voting</Option>
              </Select>
            </div>
            <div className="govern-card-content">
              <div className="governlist-row" onClick={() => navigate("/govern-details")}>
                <div className="left-section">
                  <h3>Increasing MaxValidator to 100</h3>
                  <p>Increasing MaxValidator from 75 to 100. This will allow for new validators to enter the set and further decentralise the network. With the current number of validators the barrier to becoming active is too high (40000 CMDX) so an increase to 100 validators would be optimal.</p>
                </div>
                <div className="right-section">
                  <Row>
                    <Col sm="6">
                      <label>Vote Starts :</label>
                      <p>2022-04-08 15:54:23</p>
                    </Col>
                    <Col sm="6">
                      <label>Voting Ends :</label>
                      <p>2022-04-10 15:54:23</p>
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
                  <p>Proposal 5 suggested to increase the validator seats to 100 and received more than half votes of Yes. Unfortunately the proposal did not reach quorum and is thus invalid.

                    We believe with the gradual maturity of Comdex, it does make sense to increase the validator seats. The failure of proposal 5 is possibly due to 1. increase too many seats in one time; 2. lack of time to vote, some validators might not have aware of it.
                    </p>
                </div>
                <div className="right-section">
                  <Row>
                    <Col sm="6">
                      <label>Vote Starts :</label>
                      <p>2022-05-17 12:10:35</p>
                    </Col>
                    <Col sm="6">
                      <label>Voting Ends :</label>
                      <p>2022-05-19 12:10:35</p>
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
