import * as PropTypes from "prop-types";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Col, Row, SvgIcon } from "../../../components/common";
import { connect } from "react-redux";
import { Button, List } from "antd";
import "./index.less";
import VoteNowModal from "../VoteNowModal";
import { Link } from "react-router-dom";

const data = [
  {
    title: "Voting Starts",
    counts: "2022-04-08 15:54:23",
  },
  {
    title: "Voting Ends",
    counts: "2022-04-10 15:54:23",
  },
  {
    title: "Duration",
    counts: "3 Days",
  },
  {
    title: "Proposer",
    counts: "comdex@123t7...123",
  },
];

const dataVote = [
  {
    title: "Total Value",
    counts: "24,901.25 CMST",
  },
];

const GovernDetails = () => {
  const Options = {
    chart: {
      type: "pie",
      backgroundColor: null,
      height: 180,
      margin: 5,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: null,
    },
    subtitle: {
      floating: true,
      style: {
        fontSize: "25px",
        fontWeight: "500",
        fontFamily: "Lexend Deca",
        color: "#fff",
      },
      y: 70,
    },
    plotOptions: {
      pie: {
        showInLegend: false,
        size: "120%",
        innerSize: "75%",
        borderWidth: 0,
        dataLabels: {
          enabled: false,
          distance: -14,
          style: {
            fontsize: 50,
          },
        },
      },
    },
    series: [
      {
        states: {
          hover: {
            enabled: false,
          },
        },
        name: "",
        data: [
          {
            name: "Yes",
            y: 30,
            color: "#52B788",
          },
          {
            name: "No",
            y: 30,
            color: "#F76872",
          },
          {
            name: "noWithVeto",
            y: 20,
            color: "#AACBB9",
          },
          {
            name: "Abstain",
            y: 20,
            color: "#6A7B6C",
          },
        ],
      },
    ],
  };
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col className="text-right mb-3">
          <Link to="/govern">
            <Button className="back-btn" type="primary">
              Back
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="commodo-card myhome-upper d-block">
            <div className="card-header">PROPOSAL DETAILS</div>
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
                renderItem={(item) => (
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
      <Row>
        <Col md="6">
          <div className="commodo-card govern-card2 h-100">
            <Row>
              <Col>
                <h3>#2</h3>
              </Col>
              <Col className="text-right">
                <Button type="primary" className="btn-filled">
                  Passed
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>Increasing MaxValidator to 100</h2>
                <p>
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam,{" "}
                </p>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md="6">
          <div className="commodo-card govern-card2">
            <Row>
              <Col className="text-right">
                <VoteNowModal />
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="govern-dlt-card">
                  <div className="govern-dlt-chart">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={Options}
                    />
                  </div>
                  <div className="govern-dlt-right">
                    <List
                      grid={{
                        gutter: 16,
                        xs: 1,
                      }}
                      dataSource={dataVote}
                      renderItem={(item) => (
                        <List.Item>
                          <div>
                            <p>{item.title}</p>
                            <h3>{item.counts}</h3>
                          </div>
                        </List.Item>
                      )}
                    />
                    <ul className="vote-lists">
                      <li>
                        <SvgIcon name="rectangle" viewbox="0 0 34 34" />
                        <div>
                          <label>Yes</label>
                          <p>51.42%</p>
                        </div>
                      </li>
                      <li>
                        <SvgIcon name="rectangle" viewbox="0 0 34 34" />
                        <div>
                          <label>No</label>
                          <p>21.42%</p>
                        </div>
                      </li>
                      <li>
                        <SvgIcon name="rectangle" viewbox="0 0 34 34" />
                        <div>
                          <label>noWithVeto </label>
                          <p>0.00%</p>
                        </div>
                      </li>
                      <li>
                        <SvgIcon name="rectangle" viewbox="0 0 34 34" />
                        <div>
                          <label>Abstain</label>
                          <p>17.70%</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
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

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(GovernDetails);
