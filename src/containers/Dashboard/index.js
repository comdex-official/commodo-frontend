import { Button, message } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import AssetsIcon from "../../assets/images/assets-icon.png";
import LaunchImage from "../../assets/images/launch-bg.jpg";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { DOLLAR_DECIMALS, NUMBER_OF_TOP_ASSETS } from "../../constants/common";
import {
  queryBorrowStats,
  queryDepositStats,
  queryUserDepositStats
} from "../../services/lend/query";
import {
  amountConversion,
  amountConversionWithComma,
  denomConversion
} from "../../utils/coin";
import { marketPrice } from "../../utils/number";
import { iconNameFromDenom } from "../../utils/string";
import AverageAssetApy from "./AverageAssetApy";
import "./index.less";

const Dashboard = ({ isDarkMode, markets, assetMap }) => {
  const [depositStats, setDepositStats] = useState();
  const [borrowStats, setBorrowStats] = useState();
  const [userDepositStats, setUserDepositStats] = useState();

  useEffect(() => {
    queryDepositStats((error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setDepositStats(result?.DepositStats?.balanceStats);
    });

    queryUserDepositStats((error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setUserDepositStats(result?.UserDepositStats?.balanceStats);
    });
    queryBorrowStats((error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setBorrowStats(result?.BorrowStats?.balanceStats);
    });
  }, []);

  const calculateTotalValue = (list) => {
    const values =
      list?.length > 0
        ? list.map((item) => {
            return (
              marketPrice(markets, assetMap[item?.assetId?.toNumber()]?.denom) *
              item?.amount
            );
          })
        : [];

    const sum = values.reduce((a, b) => a + b, 0);

    return Number(sum || 0);
  };

  const getTopAssets = (list) => {
    let assets =
      list?.length > 0
        ? list.map((item) => {
            let value =
              marketPrice(markets, assetMap[item?.assetId?.toNumber()]?.denom) *
              item?.amount;
            return {
              assetId: item?.assetId,
              value,
            };
          })
        : [];

    let sortedAssets = assets.sort((a, b) => b.value - a.value);

    return sortedAssets.slice(0, NUMBER_OF_TOP_ASSETS);
  };

  const totalDepositStats = calculateTotalValue(depositStats);
  const totalBorrowStats = calculateTotalValue(borrowStats);
  const totalUserDepositStats = calculateTotalValue(userDepositStats);
  const topDepositAssets = getTopAssets(depositStats);
  const topBorrowAssets = getTopAssets(borrowStats);

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
            name: "Total Available",
            y: Number(amountConversion(totalDepositStats || 0)),
            color: "#52B788",
          },
          {
            name: "Total Borrowed",
            y: Number(amountConversion(totalBorrowStats || 0)),

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
          9800000, 456000, 9080000, 2000000, 6235000, 1250000, 6600000, 6452033,
          3205850, 450000, 2801000, 9958900,
        ],
        lineWidth: 2,
        lineColor: "#52B788",
        marker: false,
        showInLegend: false,
      },
      {
        name: "Borrowed",
        data: [
          950000, 6000500, 6470000, 850650, 7850009, 32087950, 8956433, 6540030,
          4506980, 5506063, 6930300, 9850650,
        ],
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
                <h3>
                  $
                  {amountConversionWithComma(
                    totalDepositStats + totalBorrowStats || 0,
                    DOLLAR_DECIMALS
                  )}
                </h3>{" "}
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
                      Total Available{" "}
                      <TooltipIcon text="Value of Assets available on platfrom" />
                    </p>
                    <h3>
                      $
                      {amountConversionWithComma(
                        totalDepositStats || 0,
                        DOLLAR_DECIMALS
                      )}
                    </h3>
                  </div>
                  <div
                    className="dashboard-statics mb-0"
                    style={{ borderColor: "#E2F7E5" }}
                  >
                    <p>
                      Total Borrow{" "}
                      <TooltipIcon text="Value of Assets Borrowed" />
                    </p>
                    <h3>
                      $
                      {amountConversionWithComma(
                        totalBorrowStats || 0,
                        DOLLAR_DECIMALS
                      )}
                    </h3>{" "}
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
                      <a
                        aria-label="cswap"
                        target="_blank"
                        rel="noreferrer"
                        href="https://staging.cswap.one/"
                      >
                        Take me there!
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="commodo-card top-three-assets">
              <div className="card-head">Top {NUMBER_OF_TOP_ASSETS} Assets</div>
              <div className="card-content">
                <div className="deposited-list">
                  <p>Deposited</p>
                  <ul>
                    {topDepositAssets?.length > 0
                      ? topDepositAssets?.map((item) => {
                          return (
                            <li>
                              <div className="assets-col">
                                <div className="assets-icon">
                                  <SvgIcon
                                    name={iconNameFromDenom(
                                      assetMap[item?.assetId]?.denom
                                    )}
                                  />
                                </div>
                                {denomConversion(
                                  assetMap[item?.assetId]?.denom
                                )}
                              </div>
                              <b>
                                <AverageAssetApy
                                  assetId={item?.assetId}
                                  parent="lend"
                                />
                              </b>
                            </li>
                          );
                        })
                      : null}
                  </ul>
                </div>
                <div className="deposited-list">
                  <p>Borrowed</p>
                  <ul>
                    {topBorrowAssets?.length > 0
                      ? topBorrowAssets?.map((item) => {
                          return (
                            <li>
                              <div className="assets-col">
                                <div className="assets-icon">
                                  <SvgIcon
                                    name={iconNameFromDenom(
                                      assetMap[item?.assetId]?.denom
                                    )}
                                  />
                                </div>
                                {denomConversion(
                                  assetMap[item?.assetId]?.denom
                                )}
                              </div>
                              <AverageAssetApy assetId={item?.assetId} />
                            </li>
                          );
                        })
                      : null}
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
                  <h3>
                    $
                    {amountConversionWithComma(
                      totalUserDepositStats || 0,
                      DOLLAR_DECIMALS
                    )}
                  </h3>{" "}
                </div>
                <div
                  className="dashboard-statics"
                  style={{ borderColor: "#E2F7E5" }}
                >
                  <p>Total Borrowed</p>
                  <h3>
                    $
                    {amountConversionWithComma(
                      totalBorrowStats || 0,
                      DOLLAR_DECIMALS
                    )}
                  </h3>{" "}
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
  assetMap: PropTypes.object,
  markets: PropTypes.arrayOf(
    PropTypes.shape({
      rates: PropTypes.shape({
        low: PropTypes.number,
      }),
    })
  ),
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    markets: state.oracle.market.list,
    assetMap: state.asset._.map,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(Dashboard);
