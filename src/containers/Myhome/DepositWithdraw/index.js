import { Button, message, Spin, Tabs } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import { setPool } from "../../../actions/lend";
import { Col, Row } from "../../../components/common";
import { queryLendPool, queryLendPosition } from "../../../services/lend/query";
import { decode } from "../../../utils/string";
import CloseTab from "./Close";
import DepositTab from "./Deposit";
import "./index.less";
import WithdrawTab from "./Withdraw";

const BackButton = {
  right: (
    <Link to="/myhome">
      <Button className="back-btn" type="primary">
        Back
      </Button>
    </Link>
  ),
};

const Deposit = ({ setPool }) => {
  const [inProgress, setInProgress] = useState(false);
  const [lendPosition, setLendPosition] = useState();
  const [activeKey, setActiveKey] = useState("1");

  let { id } = useParams();

  const location = useLocation();
  const type = decode(location.hash);

  useEffect(() => {
    if (type && type === "withdraw") {
      setActiveKey("2");
    }
  }, []);

  useEffect(() => {
    if (id) {
      setInProgress(true);

      queryLendPosition(id, (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }
        if (result?.lend?.poolId) {
          setLendPosition(result?.lend);

          queryLendPool(result?.lend?.poolId, (error, result) => {
            setInProgress(false);
            if (error) {
              message.error(error);
              return;
            }
            setPool(result?.pool);
          });
        }
      });
    }
  }, [id]);

  const refreshLendPosition = () => {
    if (id) {
      queryLendPosition(id, (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }
        if (result?.lend?.poolId) {
          setLendPosition(result?.lend);
        }
      });
    }
  };

  const tabItems = [
    {
      label: "Deposit",
      key: "1",
      children: inProgress ? (
        <div className="loader">
          <Spin />
        </div>
      ) : (
        <DepositTab lendPosition={lendPosition} dataInProgress={inProgress} />
      ),
    },
    {
      label: "Withdraw",
      key: "2",
      children: inProgress ? (
        <div className="loader">
          <Spin />
        </div>
      ) : (
        <WithdrawTab
          lendPosition={lendPosition}
          dataInProgress={inProgress}
          refreshLendPosition={refreshLendPosition}
        />
      ),
    },
    {
      label: "Close",
      key: "3",
      children: inProgress ? (
        <div className="loader">
          <Spin />
        </div>
      ) : (
        <CloseTab lendPosition={lendPosition} dataInProgress={inProgress} />
      ),
    },
  ];

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <Tabs
            className="commodo-tabs"
            defaultActiveKey="1"
            onChange={setActiveKey}
            activeKey={activeKey}
            tabBarExtraContent={BackButton}
            items={tabItems}
          />
        </Col>
      </Row>
    </div>
  );
};

Deposit.propTypes = {
  lang: PropTypes.string.isRequired,
  setPool: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
  setPool,
};

export default connect(stateToProps, actionsToProps)(Deposit);
