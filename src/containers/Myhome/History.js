import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import Copy from "../../components/Copy";
import { connect } from "react-redux";
import variables from "../../utils/variables";
import { Button, Table, Progress } from "antd";
import "./index.less";

const History = (lang) => {
  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 180
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 150,
      render: (date) => (
        <div className="dates-col"><div className="dates">{date}</div>  <small>11:23 EST</small></div>
      ),
    },
    {
      title: "Block Height",
      dataIndex: "block_height",
      key: "block_height",
      width: 150,
    },
    {
      title: "Tx Hash",
      dataIndex: "tx_hash",
      key: "tx_hash",
      width: 300,
      render: (tx_hash) => (
        <div className="txhash-col">{tx_hash} <Copy /></div>
      ),
    }
  ];

  const tableData = [
    {
      key: 1,
      type: "Deposit",
      date: "30 Jul 2022",
      block_height: "1234",
      tx_hash: "0x6696672B38cF38e5521c8C6e3A902EF4e2F78736",
    },
    {
      key: 2,
      type: "Repay",
      date: "30 Jul 2022",
      block_height: "1234",
      tx_hash: "0x6696672B38cF38e5521c8C6e3A902EF4e2F78736",
    },
  ]

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <div className="commodo-card bg-none">
            <div className="card-header">
              TRANSACTION HISTORY
            </div>
            <div className="card-content">
              <Table
                className="custom-table"
                dataSource={tableData}
                columns={columns}
                pagination={false}
                scroll={{ x: "100%" }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

History.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
};

export default connect(stateToProps, actionsToProps)(History);