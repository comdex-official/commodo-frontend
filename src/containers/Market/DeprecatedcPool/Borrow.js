import { Button, Select, Slider, List } from "antd";
import { Col, Row, SvgIcon, TooltipIcon } from "../../../components/common";
import CustomInput from "../../../components/CustomInput";
import HealthFactor from "../../../components/HealthFactor";
import ActionButton from "../../Myhome/BorrowRepay/ActionButton";
import DistributionAPY from "../../../components/common/DistributionAPY";
import "./index.scss";

const BorrowTab = () => {
  const marks = {
    0: "",
    80: "Safe",
    100: "Riskier",
  };

  const borrowData = [
    {
      key: "1",
      title: "Borrowed",
      counts: "$1.2 M",
      tooltipText: "test",
    },
    {
      key: "2",
      title: "Available",
      counts: "$3.2 M",
      tooltipText: "test",
    },
    {
      key: "3",
      title: "Utilization",
      counts: "6%",
      tooltipText: "test",
    },
    {
      key: "4",
      title: "Borrow APY",
      counts: "0.25%",
      tooltipText: "test",
      apy: true,
    },
  ];

  const collateralData = [
    {
      key: "1",
      title: "Borrowed",
      counts: "$1.2 M",
      tooltipText: "test",
    },
    {
      key: "2",
      title: "Available",
      counts: "$3.2 M",
      tooltipText: "test",
    },
    {
      key: "3",
      title: "Utilization",
      counts: "6%",
      tooltipText: "test",
    },
    {
      key: "4",
      title: "Borrow APY",
      counts: "0.25%",
      tooltipText: "test",
    },
  ];

  const borrowData2 = [
    {
      key: "1",
      title: "Current Borrow Balance",
      counts: "0.0000",
      tooltipText: "test",
    },
    {
      key: "1",
      title: "New Borrow Balance",
      counts: "0.0000",
      tooltipText: "test",
    },
  ];

  return (
    <div className="details-wrapper emode-details-wrapper">
      <div className="details-left commodo-card mh-100">
        <div className="deposit-head">
          <div className="deposit-head-left">
            <div className="assets-col mr-3">
              <div className="assets-icon">
                <SvgIcon name="atom-icon" />
              </div>
              ATOM
            </div>
            <div className="assets-col mr-3">
              <div className="assets-icon">
                <SvgIcon name="statom-icon" />
              </div>
              stATOM
            </div>
          </div>
          <div className="deposit-poolId">#10</div>
        </div>
        <div className="assets-select-card mb-3">
          <div className="assets-left">
            <label className="left-label">Collateral Asset</label>
            <div className="assets-select-wrapper">
              <div className="assets-select-wrapper">
                <Select
                  className="assets-select"
                  popupClassName="asset-select-dropdown"
                  placeholder={
                    <div className="select-placeholder">
                      <div className="circle-icon no-border">
                        <div className="circle-icon-inner">
                          <SvgIcon name="atom-icon" />
                        </div>
                      </div>
                      ATOM
                    </div>
                  }
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  suffixIcon={false}
                  options={false}
                  disabled
                ></Select>
              </div>
            </div>
          </div>
          <div className="assets-right">
            <div className="label-right">
              <div className="available-balance">
                Available
                <span className="ml-1">10 ATM</span>
                <span className="assets-max-half">
                  <Button className=" active">Max</Button>
                </span>
              </div>
            </div>
            <div>
              <div className="input-select">
                <CustomInput />
              </div>
              <small>$100</small>
            </div>
          </div>
        </div>

        <div className="assets-select-card mb-0">
          <div className="assets-left">
            <label className="left-label">Borrow Asset</label>
            <div className="assets-select-wrapper">
              <div className="assets-select-wrapper">
                <Select
                  className="assets-select"
                  popupClassName="asset-select-dropdown"
                  placeholder={
                    <div className="select-placeholder">
                      <div className="circle-icon no-border">
                        <div className="circle-icon-inner">
                          <SvgIcon name="statom-icon" />
                        </div>
                      </div>
                      ATOM
                    </div>
                  }
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  suffixIcon={false}
                  options={false}
                  disabled
                ></Select>
              </div>
            </div>
          </div>
          <div className="assets-right">
            <div className="label-right">
              <div className="available-balance">
                Available
                <span className="ml-1">10 ATM</span>
                <span className="assets-max-half">
                  <Button className=" active">Max</Button>
                </span>
              </div>
            </div>
            <div>
              <div className="input-select">
                <CustomInput />
              </div>
              <small>$100</small>
            </div>
          </div>
        </div>
        <Row>
          <Col sm="12" className="mx-auto card-bottom-details">
            <Row className="mt-4">
              <Col sm="12">
                <Slider
                  marks={marks}
                  tooltip={{ open: false }}
                  className="commodo-slider market-slider-1 borrow-slider"
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <label>Health Factor</label>
                <TooltipIcon text="Numeric representation of your position's safety" />
              </Col>
              <Col className="text-right health-right-repay">
                <HealthFactor />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <label>Borrow APY</label>
              </Col>
              <Col className="text-right">
                0.25% <DistributionAPY />
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn mt-4">
          <ActionButton name="Borrow" />
        </div>
      </div>
      <div className="details-right">
        <div className="commodo-card">
          <div className="card-head">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name="atom-icon" />
                </div>
                Borrow Details
              </div>
            </div>
            <div className="head-right">
              <span>Oracle Price</span> : $123.45
            </div>
          </div>
          <List
            className="pb-0"
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={borrowData}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <p>
                    {item.title} <TooltipIcon text={item.tooltipText} />
                  </p>
                  <h3>{item.counts}</h3>
                  {item.apy && (
                    <div className="pt-1">
                      <DistributionAPY />
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
          <List
            className="pt-0"
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 2,
              xxl: 2,
            }}
            dataSource={borrowData2}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <p>
                    {item.title} <TooltipIcon text={item.tooltipText} />
                  </p>
                  <h3>{item.counts}</h3>
                  {item.apy && (
                    <div className="pt-1">
                      <DistributionAPY />
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
        <div className="commodo-card borrow-card">
          <div className="card-head">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name="atom-icon" />
                </div>
                Collateral Details
              </div>
            </div>
          </div>
          <List
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 2,
              xxl: 2,
            }}
            dataSource={collateralData}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <p>
                    {item.title} <TooltipIcon text={item.tooltipText} />
                  </p>
                  <h3>{item.counts}</h3>
                  {item.apy && (
                    <div className="pt-1">
                      <DistributionAPY />
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default BorrowTab;
