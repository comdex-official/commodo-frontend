import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table } from "antd";
import TooltipIcon from "../../components/TooltipIcon";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./index.less";

const Dashboard = ({lang, isDarkMode}) => {
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
  const PriceChart = {
    chart: {
      type: "spline",
      backgroundColor: null,
      height: 130,
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
          color: "#E2F7E5",
        }
      },
    },
    xAxis: {
      lineColor: false,
      labels: {
        style: {
          fontSize: 10,
          color: "#E2F7E5",
          fontWeight: 300,
        },
      },
      gridLineWidth: 1,
      gridLineColor: isDarkMode ? "#E2F7E5" : "#E2F7E5",
      categories: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR"],
    },
    series: [
      {
        showInLegend: false,
        lineWidth: 2,
        lineColor: "#52B788",
        marker: false,
        data: [2, 2.5, 2.8, 3, 4, 4.5, 4.2, 4.0, 3.8, 3.2, 4, 2.9, 3.1, 2.8, 2.7]
      },
    ],
  };
  const DepositBorrowChart = {
    chart: {
      type: "spline",
      backgroundColor: null,
      height: 180,
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
          color: "#E2F7E5",
        }
      },
    },
    xAxis: {
      lineColor: false,
      labels: {
        style: {
          fontSize: 10,
          color: "#E2F7E5",
          fontWeight: 300,
        },
      },
      gridLineWidth: 1,
      gridLineColor: isDarkMode ? "#E2F7E5" : "#E2F7E5",
      categories: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    },
    series: [
      {
        name: "Deposited",
        data: [2, 2.5, 2.8, 3, 4, 4.5, 4.2, 4.0, 3.8, 3.2, 4, 2.9],
        lineWidth: 2,
        lineColor: "#52B788",
        marker: false,
        showInLegend: false,
      },
      {
        name: "Borrowed",
        data: [1.9, 2.2, 2.4, 2.9, 3, 4.1, 3.9, 3, 3.2, 2.2, 3, 2.1],
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
              <div className="dashboard-statics">
                <p>Total Value Locked</p>
                <h2>$15,690.00</h2>
              </div>
              <div className="totalvalues">
                <div className="totalvalues-chart">
                  <HighchartsReact highcharts={Highcharts} options={Options} />
                </div>
                <div className="totalvalues-right">
                  <div className="dashboard-statics mb-5">
                    <p>Total Deposited</p>
                    <h3>$12,345.00</h3>
                  </div>
                  <div className="dashboard-statics mb-0">
                    <p>Total Collateral</p>
                    <h3>$2,345.00</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-upper-right">
            <div className="commodo-card dashboardupper-chart">
              <div className="dashboardupperchart-head">
                <div className="col1">
                  <small>CMDO Price</small>
                  <h4>$12.20 <span>2.41%</span></h4>
                </div>
                <div className="col2">
                  <small>Circulating Supply</small>
                  <p>12,500,000 <span>CMDO</span></p>
                </div>
                <div className="col3">
                  <small>Market Cap</small>
                  <p>$72,125,000</p>
                </div>
              </div>
              <div className="right-chart">
                <HighchartsReact highcharts={Highcharts} options={PriceChart} />
              </div>
            </div>
            <div className="commodo-card topthree-assets">
              <div className="card-head">Top 3 Assets</div>
              <div className="card-content">
                <div className="deposited-list">
                  <p>Deposited</p>
                  <ul>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="atom-icon" />
                        </div>
                        USCX
                      </div>
                      <b>24.32%</b>
                    </li>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="cmdx-icon" />
                        </div>
                        USCX
                      </div>
                      <b>18.32%</b>
                    </li>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="atom-icon" />
                        </div>
                        USCX
                      </div>
                      <b>14.32%</b>
                    </li>
                  </ul>
                </div>
                <div className="deposited-list">
                  <p>Borrowed</p>
                  <ul>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="atom-icon" />
                        </div>
                        USCX
                      </div>
                      <b>24.32%</b>
                    </li>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="atom-icon" />
                        </div>
                        USCX
                      </div>
                      <b>18.32%</b>
                    </li>
                    <li>
                      <div className="assets-col">
                        <div className="assets-icon">
                          <SvgIcon name="atom-icon" />
                        </div>
                        USCX
                      </div>
                      <b>14.32%</b>
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
                <HighchartsReact highcharts={Highcharts} options={DepositBorrowChart} />
              </div>
              <div className="bottom-chart-right">
                <div className="dashboard-statics">
                  <p>Total Deposited</p>
                  <h2>$30,000,000</h2>
                </div>
                <div className="dashboard-statics">
                  <p>Total Borrowed</p>
                  <h2>$21,000,000</h2>
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

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Dashboard);
