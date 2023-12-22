import { message, Spin, Tabs } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useParams } from "react-router";
import { setPool, setUserBorrows } from "../../../actions/lend";
import { BackButton, Col, Row } from "../../../components/common";
import {
  queryLendPool,
  queryLendPosition,
  queryUserBorrows,
} from "../../../services/lend/query";
import { decode } from "../../../utils/string";
import CloseTab from "./Close";
import DepositTab from "./Deposit";
import "./index.scss";
import WithdrawTab from "./Withdraw";

const PageBackButton = {
  right: <BackButton />,
};

const Deposit = ({ setPool, address, setUserBorrows }) => {
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
    if (address) {
      fetchUserBorrows();
    }
  }, [address]);

  const fetchUserBorrows = () => {
    queryUserBorrows(address, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setUserBorrows(result?.borrows || []);
    });
  };

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
            tabBarExtraContent={PageBackButton}
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
  setUserBorrows: PropTypes.func.isRequired,
  address: PropTypes.string,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    address: state.account.address,
  };
};

const actionsToProps = {
  setPool,
  setUserBorrows,
};

export default connect(stateToProps, actionsToProps)(Deposit);
