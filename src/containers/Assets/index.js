import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon, TooltipIcon } from "../../components/common";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { List, Table } from "antd";
import "./index.less";
import DepostiModal from "./DepostiModal";
import WithdrawModal from "./WithdrawModal";

const Assets = (lang) => {
  const data = [
    {
      title: <>Total Asset Balance <TooltipIcon text="Value of total Asset Deposited by User" /></>,
      counts: '$1,234.55'
    }
  ];
  const columns = [
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: 180,
    },
    {
      title: "No. of Tokens",
      dataIndex: "no_of_tokens",
      key: "no_of_tokens",
      width: 150,
    },
    {
      title: "Oracle Price",
      dataIndex: "oracle_price",
      key: "oracle_price",
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (amount) => (
        <>${amount}</>
      ),
    },
    {
      title: "IBC Deposit",
      dataIndex: "ibc_deposit",
      key: "ibc_deposit",
      width: 150,
      align: "center"
    },
    {
      title: "IBC Withdraw",
      dataIndex: "ibc_withdraw",
      key: "ibc_withdraw",
      width: 150,
      align: "center"
    }
  ];

  const tableData = [
    {
      key: 1,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="cmst-icon"
              />
            </div>
            CMST
          </div>
        </>
      ),
      no_of_tokens: "310",
      oracle_price: "1",
      amount: "200.18",
    },
    {
      key: 2,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="cmdx-icon"
              />
            </div>
            CMDX
          </div>
        </>
      ),
      no_of_tokens: "120",
      oracle_price: "1",
      amount: "40.67",
    },
    {
      key: 2,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="harbor-icon"
              />
            </div>
            HARBOR
          </div>
        </>
      ),
      no_of_tokens: "400",
      oracle_price: "1",
      amount: "1025.67",
    },
    {
      key: 3,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="atom-icon"
              />
            </div>
            ATOM
          </div>
        </>
      ),
      no_of_tokens: "280",
      oracle_price: "1",
      amount: "452.67",
      ibc_deposit: <DepostiModal />,
      ibc_withdraw: <WithdrawModal />
    },
    {
      key: 4,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="osmosis-icon"
              />
            </div>
            OSMO
          </div>
        </>
      ),
      no_of_tokens: "130",
      oracle_price: "1",
      amount: "201.67",
      ibc_deposit: <DepostiModal />,
      ibc_withdraw: <WithdrawModal />
    },
    {
      key: 6,
      asset: (
        <>
          <div className="assets-withicon">
            <div className="assets-icon">
              <SvgIcon
                name="xprt-icon"
              />
            </div>
            XPRT
          </div>
        </>
      ),
      no_of_tokens: "260",
      oracle_price: "1",
      amount: "302.10",
      ibc_deposit: <DepostiModal />,
      ibc_withdraw: <WithdrawModal />
    }
  ]
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="asset-wrapper">
            <div className="commodo-card myhome-upper d-block">
              <div className="myhome-upper-left w-100">
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 1,
                    lg: 1,
                    xl: 1,
                    xxl: 1,
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
            <div className="commodo-card py-3 bg-none">
              <div className="card-content">
                <Table
                  className="custom-table liquidation-table"
                  dataSource={tableData}
                  columns={columns}
                  pagination={false}
                  scroll={{ x: "100%", y: "calc(100vh - 280px)" }}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Assets.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(Assets);
