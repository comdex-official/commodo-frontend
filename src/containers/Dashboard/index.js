import { Button, Skeleton } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import ComdexAtomIcon from "../../assets/images/cmdx_atom.png";
import LaunchImage from "../../assets/images/launch-bg.jpg";
import "../../assets/less/plugins/slick-slider/slick.less";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import {
  ATOM_CMDX_POOL_ID,
  DOLLAR_DECIMALS,
  NUMBER_OF_TOP_ASSETS
} from "../../constants/common";
import { CSWAP_URL, REWARDS_URL } from "../../constants/url";
import {
  queryBorrowDepositHistory,
  queryTopAssets,
  queryTotalBorrowAndDeposit,
  queryTotalValueLocked
} from "../../services/lend/query";
import { denomConversion } from "../../utils/coin";
import { commaSeparator } from "../../utils/number";
import { iconNameFromDenom } from "../../utils/string";
import "./index.less";

const Dashboard = ({ isDarkMode, assetMap }) => {
  const [topAssetsInProgress, setTopAssetsInProgress] = useState(false);
  const [topDeposits, setTopDeposits] = useState();
  const [topBorrows, setTopBorrows] = useState();
  const [totalValue, setTotalValue] = useState(0);
  const [totalValueLockedInProgress, setTotalValueLockedInProgress] =
    useState(false);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [totalDepositBorrowInProgress, setTotalDepositBorrowInProgress] =
    useState(false);
  const [graphDataInProgress, setgraphDataInProgress] = useState(false);
  const [graphData, setgraphData] = useState([]);

  useEffect(() => {
    setTopAssetsInProgress(true);
    setTotalValueLockedInProgress(true);
    setTotalDepositBorrowInProgress(true);
    setgraphDataInProgress(true);

    queryTopAssets((error, result) => {
      setTopAssetsInProgress(false);
      if (error) {
        return;
      }

      setTopDeposits(result?.data?.deposit);
      setTopBorrows(result?.data?.borrow);
    });

    queryTotalValueLocked((error, result) => {
      setTotalValueLockedInProgress(false);
      if (error) {
        return;
      }

      setTotalValue(result?.data?.total_value);
    });

    queryTotalBorrowAndDeposit((error, result) => {
      setTotalDepositBorrowInProgress(false);
      if (error) {
        return;
      }

      setTotalDeposited(result?.data?.total_deposit);
      setTotalBorrowed(result?.data?.total_borrowed);
    });

    //24hr: 86400
    queryBorrowDepositHistory(86400, (error, result) => {
      if (error) {
        return;
      }

      if (result?.data?.length) {
        setgraphData(result?.data);
      }
    });
  }, []);

  const totalValueLocked = Number(totalDeposited);
  const available = totalValueLocked - Number(totalBorrowed);

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
        className: "totalvalue-chart",
        dataLabels: {
          enabled: false,
          distance: -14,
          style: {
            fontsize: 50,
          },
        },
      },
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        return (
          '<div class="chart-value-tooltip">' +
          "$" +
          Number(this.y)?.toFixed(DOLLAR_DECIMALS) +
          "<br />" +
          '<small style="font-size: 10px;">' +
          this.key +
          "</small>" +
          "</div>"
        );
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
            y: Number(available || 0),
            color: "#52B788",
          },
          {
            name: "Total Borrowed",
            y: Number(totalBorrowed || 0),
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
      height: 200,
      marginBottom: 60,
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
      categories:
        graphData && graphData.length > 0
          ? graphData.map((item) =>
              moment(item?.timestamp).format("MMM DD, HH:mm")
            )
          : [],
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        return (
          '<div class="chart-value-tooltip">' +
          "$" +
          Number(this.y)?.toFixed(DOLLAR_DECIMALS) +
          "<br />" +
          '<small style="font-size: 10px;">' +
          moment(this.x).format("MMM DD, HH:mm") +
          "</small>" +
          "</div>"
        );
      },
    },

    series: [
      {
        name: "Deposited",
        data:
          graphData && graphData.length > 0
            ? graphData.map((item) => item?.total_deposit)
            : [],
        lineWidth: 2,
        lineColor: "#52B788",
        marker: false,
        showInLegend: false,
      },
      {
        name: "Borrowed",
        data:
          graphData && graphData.length > 0
            ? graphData.map((item) => item?.total_borrow)
            : [],
        lineWidth: 2,
        lineColor: "#D8F3DC",
        marker: false,
        showInLegend: false,
      },
    ],
  };

  const showSkeletonLoader = () => {
    return [...Array(NUMBER_OF_TOP_ASSETS)].map((item, index) => (
      <Skeleton.Input key={index} active size="small" className="mb-1" />
    ));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2800,
  };

  const showTopAssets = (assets) => {
    let reversedArray = assets?.slice("")?.reverse();
    let uniqueValues = [
      ...new Map(
        reversedArray?.map((item) => [item["asset_id"], item])
      ).values(),
    ]; // this will pick the last duplicated item in the list i.e highest value here.

    let finalTopValues = uniqueValues.sort((a, b) => {
      return b.total - a.total; // sort descending.
    });

    return finalTopValues?.slice(0, NUMBER_OF_TOP_ASSETS)?.map((item) => {
      return (
        <li key={item?.asset_id}>
          <div className="assets-col">
            <div className="assets-icon">
              <SvgIcon
                name={iconNameFromDenom(assetMap[item?.asset_id]?.denom)}
              />
            </div>
            {denomConversion(assetMap[item?.asset_id]?.denom)}
          </div>
          <b>{((Number(item?.apr) || 0) * 100).toFixed(DOLLAR_DECIMALS)}%</b>
        </li>
      );
    });
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
                {totalValueLockedInProgress ? (
                  <Skeleton.Input
                    key={"totalValue"}
                    active
                    size="small"
                    className="mt-1"
                  />
                ) : (
                  <h3>
                    $
                    {commaSeparator(
                      Number(totalValueLocked || 0).toFixed(DOLLAR_DECIMALS)
                    )}
                  </h3>
                )}
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
                    {totalDepositBorrowInProgress ? (
                      <Skeleton.Input
                        key={"available"}
                        active
                        size="small"
                        className="mt-1"
                      />
                    ) : (
                      <h3>
                        $
                        {commaSeparator(
                          Number(available || 0).toFixed(DOLLAR_DECIMALS)
                        )}
                      </h3>
                    )}
                  </div>
                  <div
                    className="dashboard-statics mb-0"
                    style={{ borderColor: "#E2F7E5" }}
                  >
                    <p>
                      Total Borrow{" "}
                      <TooltipIcon text="Value of Assets Borrowed" />
                    </p>
                    {totalDepositBorrowInProgress ? (
                      <Skeleton.Input
                        key={"borrow"}
                        active
                        size="small"
                        className="mt-1"
                      />
                    ) : (
                      <h3>
                        $
                        {commaSeparator(
                          Number(totalBorrowed || 0).toFixed(DOLLAR_DECIMALS)
                        )}
                      </h3>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-upper-right">
            <div className="commodo-card commodo-launch-card">
              <Slider {...settings}>
                <div>
                  <div className="commodo-launch-card-inner">
                    <img
                      className="launch-bg"
                      alt="CMDX Token Launch"
                      src={LaunchImage}
                    />
                    <div className="assets-section">
                      <div className="assets-section-inner">
                        <div className="assets-left">
                          <p>
                            Provide liquidity on ATOM-CMDX pool on CSWAP to earn
                            external incentives on COMMODO
                          </p>
                          <div className="mt-auto">
                            <div className="small-icons mb-2">
                              <div className="icon-col mr-2">
                                <SvgIcon name="cmdx-icon" /> CMDX
                              </div>{" "}
                              -
                              <div className="icon-col ml-2">
                                <SvgIcon name="atom-icon" /> ATOM
                              </div>
                            </div>
                            <h3 className="h3-botttom">
                              <Button
                                type="primary"
                                onClick={() => window.open(REWARDS_URL)}
                              >
                                Learn more
                              </Button>
                            </h3>
                          </div>
                        </div>
                        <div className="assets-right">
                          <img
                            alt={"atom"}
                            src={ComdexAtomIcon}
                            className="overlap-icon-1"
                          />
                          <Button
                            type="primary"
                            className="btn-filled"
                            onClick={() =>
                              window.open(
                                `${CSWAP_URL}/farm/${ATOM_CMDX_POOL_ID}`
                              )
                            }
                          >
                            Take me there!
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
            <div className="commodo-card top-three-assets">
              <div className="card-head">Top {NUMBER_OF_TOP_ASSETS} Assets</div>
              <div className="card-content">
                <div className="deposited-list">
                  <div className="d-flex justify-content-between">
                    <div>Deposited</div>
                    <div>Lend APY</div>
                  </div>
                  <ul>
                    {topDeposits && topDeposits?.length > 0
                      ? showTopAssets(topDeposits)
                      : topAssetsInProgress
                      ? showSkeletonLoader()
                      : "No data"}
                  </ul>
                </div>
                <div className="deposited-list">
                  <div className="d-flex justify-content-between">
                    <div>Borrowed</div>
                    <div>Borrow APY</div>
                  </div>
                  <ul>
                    {topBorrows && topBorrows?.length > 0
                      ? showTopAssets(topBorrows)
                      : topAssetsInProgress
                      ? showSkeletonLoader()
                      : ""}
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
                    {commaSeparator(
                      Number(totalDeposited || 0).toFixed(DOLLAR_DECIMALS)
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
                    {commaSeparator(
                      Number(totalBorrowed || 0).toFixed(DOLLAR_DECIMALS)
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
  lang: PropTypes.string.isRequired,
  assetMap: PropTypes.object,
  isDarkMode: PropTypes.bool,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    assetMap: state.asset._.map,
  };
};

export default connect(stateToProps)(Dashboard);
