import { Button, Select, Slider, List } from "antd";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { setBalanceRefresh } from "../../../actions/account";
import { Col, Row, SvgIcon, TooltipIcon } from "../../../components/common";
import CustomInput from "../../../components/CustomInput";
import ActionButton from "../../Myhome/BorrowRepay/ActionButton";
import "./index.less";

const Withdraw = () => {

  const marks = {
    0: "0%",
    50: "50%",
    100: "100%",
  };

  const data1 = [
    {
      key: '1',
      title: 'Lent',
      counts: '$1.2 M',
      tooltipText: 'test'
    },
    {
      key: '2',
      title: 'Available',
      counts: '$3.2 M',
      tooltipText: 'test'
    },
    {
      key: '3',
      title: 'Utilization',
      counts: '6%',
      tooltipText: 'test'
    },
    {
      key: '4',
      title: 'Borrow APY',
      counts: '0.25%',
      tooltipText: 'test',
    },
  ]

  const data2 = [
    {
      key: '1',
      title: 'Liq. Threshold',
      counts: '0.0000',
      tooltipText: 'test'
    },
    {
      key: '2',
      title: 'Liq. Penalty',
      counts: '0.0000',
      tooltipText: 'test'
    },
    {
      key: '3',
      title: 'Collateral Type',
      counts: 'Normal',
      tooltipText: 'test'
    },
    {
      key: '4',
      title: 'Current Lend Balance',
      counts: '$1.2 M',
      tooltipText: 'test'
    },
    {
      key: '5',
      title: 'New Lend Balance',
      counts: '$3.2 M',
      tooltipText: 'test'
    },
  ]

  return (
    <div className="details-wrapper emode-details-wrapper">
      <div className="details-left commodo-card mh-100">
        <div className="deposit-head">
          <div className="deposit-head-left">
            <div className="assets-col mr-3">
              <div className="assets-icon">
                <SvgIcon name='atom-icon' />
              </div>
              ATOM
            </div>
            <div className="assets-col mr-3">
              <div className="assets-icon">
                <SvgIcon name='statom-icon' />
              </div>
              stATOM
            </div>
          </div>
          <div className="deposit-poolId">#10</div>
        </div>

        <div className="assets-select-card mb-0">
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
                          <SvgIcon name='atom-icon' />
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
                >
                </Select>
              </div>
            </div>
          </div>
          <div className="assets-right">
            <div className="label-right">
              <div className="available-balance">
                Available
                <span className="ml-1">
                  10 ATM
                </span>
                <span className="assets-max-half">
                  <Button className=" active">
                    Max
                  </Button>
                </span>
              </div>
            </div>
            <div>
              <div className="input-select">
                <CustomInput />
              </div>
              <small>
                $100
              </small>
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
                  className="commodo-slider market-slider-1"
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <label>Max LTV <TooltipIcon text='text' /></label>
              </Col>
              <Col className="text-right">
                50%
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <label>Lend APY <TooltipIcon text='text' /></label>
              </Col>
              <Col className="text-right">
                0.00%
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="assets-form-btn">
          <ActionButton
            name="Withdraw"
          />
        </div>
      </div>
      <div className="details-right">
        <div className="commodo-card">
          <div className="card-head">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name='atom-icon' />
                </div>
                ATOM
              </div>
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
              md: 4,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={data1}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <p>
                    {item.title} <TooltipIcon text={item.tooltipText} />
                  </p>
                  <h3>{item.counts}</h3>
                </div>
              </List.Item>
            )}
          />
        </div>
        <div className="commodo-card withdraw-card">
          <div className="card-head noborder">
            <div className="head-left">
              <div className="assets-col">
                <div className="assets-icon">
                  <SvgIcon name='atom-icon' />
                </div>
                ATOM
              </div>
            </div>
            <div className="head-right">
              <Button type="primary" className="external-btn">
                <a href={"https://app.cswap.one"} target="_blank" rel="noreferrer">
                  <span className="hyperlink-icon ml-0 mr-1">
                    {" "}
                    <SvgIcon name="hyperlink" />
                  </span>
                  Buy{" "}
                </a>
              </Button>
            </div>
          </div>
          <List
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            dataSource={data2}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <p>
                    {item.title} <TooltipIcon text={item.tooltipText} />
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

Withdraw.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
  setBalanceRefresh,
};

export default connect(stateToProps, actionsToProps)(Withdraw);