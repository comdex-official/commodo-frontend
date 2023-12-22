import { Tabs, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { BackButton } from "../../../components/common";
import BorrowTab from "./Borrow";
import RepayTab from "./Repay";
import Withdraw from "./Withdraw";
import "./index.scss";
import { queryLendPool } from "../../../services/lend/query";
import { setPool } from "../../../actions/lend";
import { useLocation, useParams } from "react-router";
import { decode } from "../../../utils/string";

const PageBackButton = {
  right: <BackButton />,
};

const DeprecatedcPool = ({ address, setPool }) => {
  let { id } = useParams();

  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    if (address && id) {
      setInProgress(true);

      queryLendPool(id, (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }
        setPool(result?.pool);
      });
    }
  }, [address, id]);

  const [activeKey, setActiveKey] = useState("1");
  const location = useLocation();
  const type = decode(location.hash);

  useEffect(() => {
    if (type && type === "withdraw") {
      setActiveKey("1");
    }
    if (type && type === "repay") {
      setActiveKey("2");
    }
  }, []);

  const tabItems = [
    {
      label: (
        <>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title="No assets lent in this market to withdraw"
          >
            Withdraw
          </Tooltip>
        </>
      ),
      key: "1",
      children: <Withdraw />,
    },
    {
      label: (
        <>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title="No debt to repay in this market"
          >
            Repay
          </Tooltip>
        </>
      ),
      key: "2",
      children: <RepayTab />,
    },
  ];
  return (
    <>
      <Tabs
        className="commodo-tabs"
        defaultActiveKey="1"
        onChange={setActiveKey}
        activeKey={activeKey}
        tabBarExtraContent={PageBackButton}
        items={tabItems}
      />
    </>
  );
};

DeprecatedcPool.propTypes = {
  setPool: PropTypes.func.isRequired,

  address: PropTypes.string,
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
  };
};

const actionsToProps = {
  setPool,
};

export default connect(stateToProps, actionsToProps)(DeprecatedcPool);
