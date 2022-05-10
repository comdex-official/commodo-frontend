import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../../components/common";
import { connect } from "react-redux";
import variables from "../../../utils/variables";
import { Button, List, Select, Progress } from "antd";
import "./index.less";

const { Option } = Select;

const data = [
  {
    title: "Voting Starts",
    counts: '2022-04-08 15:54:23'
  },
  {
    title: "Voting Ends",
    counts: "2022-04-10 15:54:23"
  },
  {
    title: "Duration",
    counts: "3 Days"
  },
  {
    title: "Proposer",
    counts: "comdex@123t7...123"
  }
];

const GovernDetails = (lang) => {
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
                  md: 2,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
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
        <Col md="6">
          <div className="commodo-card govern-card2">
            <Row>
              <Col>
                <h3>#2</h3>
              </Col>
              <Col className="text-right">
                <Button type="primary" className="btn-filled">Passed</Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>Increasing MaxValidator to 100</h2>
                <p>adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, </p>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md="6">
          <div className="commodo-card govern-card2">
            <Row>
              <Col className="text-right">
                <Button type="primary" className="btn-filled">Vote Now</Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>Increasing MaxValidator to 100</h2>
                <p>adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, </p>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

GovernDetails.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(GovernDetails);
