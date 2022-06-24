import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { connect } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./index.less";
import LaunchImage from "../../assets/images/launch-bg.jpg";
import AssetsIcon from "../../assets/images/assets-icon.png";
import { Button } from "antd";

const Dashboard = ({ isDarkMode }) => {
  const Options = {
    chart: {
      type: "pie",
      backgroundColor: null,
      height: 210,
      margin: 5,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: null,
    },
    plotOptions: {
      pie: {
        showInLegend: false,
        size: "110%",
        innerSize: "82%",
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
            name: "Total Deposited",
            y: 70,
            color: "#52B788",
          },
          {
            name: "Total Collateral",
            y: 30,
            color: "#E2F7E5",
          },
        ],
      },
    ],
  };

  const DepositBorrowChart = {
    chart: {
      type: "spline",
      backgroundColor: null,
      height: 150,
      marginBottom: 30,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    yAxis: {
      gridLineWidth: 0,
      title: {
        enabled: false,
      },
      labels: {
        enabled: true,
        style: {
          color: isDarkMode ? "#E2F7E5" : "#999",
        },
      },
    },
    xAxis: {
      lineColor: false,
      labels: {
        style: {
          fontSize: 10,
          color: isDarkMode ? "#E2F7E5" : "#999",
          fontWeight: 300,
        },
      },
      gridLineWidth: 1,
      gridLineColor: isDarkMode ? "#E2F7E5" : "#999",
      categories: [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ],
    },
    series: [
      {
        name: "Deposited",
        data: [
          9800000, 456000, 9080000, 2000000, 6235000, 1250000, 6600000, 6452033, 3205850, 450000, 2801000, 9958900,
        ],
        lineWidth: 2,
        lineColor: "#52B788",
        marker: false,
        showInLegend: false,
      },
      {
        name: "Borrowed",
        data: [950000, 6000500, 6470000, 850650, 7850009, 32087950, 8956433, 6540030, 4506980, 5506063, 6930300, 9850650],
        lineWidth: 2,
        lineColor: "#D8F3DC",
        marker: false,
        showInLegend: false,
      },
    ],
  };
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col className="dashboard-upper">
          <div className="dashboard-upper-left">
            <div className="commodo-card h-100">
              <div className="dashboard-statics ml-4">
                <p>
                  Total Value Locked{" "}
                  <TooltipIcon text="Value of Assets Locked" />
                </p>
                <h2>$57,156,855</h2>
              </div>
              <div className="total-values">
                <div className="total-values-chart">
                  <HighchartsReact highcharts={Highcharts} options={Options} />
                </div>
                <div className="total-values-right">
                  <div
                    className="dashboard-statics mb-5"
                    style={{ borderColor: "#52B788" }}
                  >
                    <p>
                      Total Deposited{" "}
                      <TooltipIcon text="Value of Assets Depositedon platfrom" />
                    </p>
                    <h3>$30,283,670</h3>
                  </div>
                  <div
                    className="dashboard-statics mb-0"
                    style={{ borderColor: "#E2F7E5" }}
                  >
                    <p>
                      Total Collateral{" "}
                      <TooltipIcon text="Value of Assets Deposited" />
                    </p>
                    <h3>$26,873,185</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-upper-right">
            <div className="commodo-card commodo-launch-card">
              <div className="commodo-launch-card-inner">
                <img
                  className="launch-bg"
                  alt="CMDO Token Launch"
                  src={LaunchImage}
                />
                <div className="assets-section">
                  <div className="assets-left">
                    <p>
                      Provide liquidity on CMDX-CMST pool on CSWAP to earn
                      external incentives on COMMODO
                    </p>
                    <div className="mt-3">
                      <div className="small-icons mb-2">
                        <div className="icon-col mr-2">
                          <SvgIcon name="cmst-icon" />
                          CMST
                        </div>{" "}
                        -
                        <div className="icon-col ml-2">
                          <SvgIcon name="cmdx-icon" /> CMDX
                        </div>
                      </div>
                      <h3 className="h3-botttom">
                        300% <small>APR</small>
                      </h3>
                    </div>
                  </div>
                  <div className="assets-right">
                    <img alt={AssetsIcon} src={AssetsIcon} />
                    <Button type="primary" className="btn-filled">
                      Take me there!
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="commodo-card top-three-assets">
              <div className="card-head">Top 3 Assets</div>
              <div className="card-content">
                <div className="deposited-list">
                  <p>Deposited</p>
                  <ul>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="cmst-icon" />
                        </div>
                        CMST
                      </div>
                      <b>8.92%</b>
                    </li>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="cmdx-icon" />
                        </div>
                        CMDX
                      </div>
                      <b>7.88%</b>
                    </li>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="atom-icon" />
                        </div>
                        ATOM
                      </div>
                      <b>7.24%</b>
                    </li>
                  </ul>
                </div>
                <div className="deposited-list">
                  <p>Borrowed</p>
                  <ul>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="cmst-icon" />
                        </div>
                        CMST
                      </div>
                      <b>12.33%</b>
                    </li>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="cmdx-icon" />
                        </div>
                        CMDX
                      </div>
                      <b>14.76%</b>
                    </li>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="atom-icon" />
                        </div>
                        ATOM
                      </div>
                      <b>13.33%</b>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="dashboard-bottom">
          <div className="commodo-card">
            <div className="bottom-chart">
              <div className="bottom-chart-left">
                <div className="legend-custom">
                  <div className="legend-deposit">
                    <SvgIcon name="rectangle" /> Deposited
                  </div>
                  <div className="legend-borrow">
                    <SvgIcon name="rectangle" /> Borrowed
                  </div>
                </div>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={DepositBorrowChart}
                />
              </div>
              <div className="bottom-chart-right">
                <div
                  className="dashboard-statics"
                  style={{ borderColor: "#52B788" }}
                >
                  <p>Total Deposited</p>
                  <h2>$30,283,670</h2>
                </div>
                <div
                  className="dashboard-statics"
                  style={{ borderColor: "#E2F7E5" }}
                >
                  <p>Total Borrowed</p>
                  <h2>$14,323,970</h2>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Dashboard.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(Dashboard);
