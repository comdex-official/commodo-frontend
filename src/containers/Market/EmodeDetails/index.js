import { message, Tabs, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useParams } from "react-router";
import { setPool, setPoolLends, setUserBorrows } from "../../../actions/lend";
import { BackButton } from "../../../components/common";
import {
  queryAllBorrowByOwnerAndPool,
  queryLendPool,
  queryUserBorrows,
  queryUserLends,
} from "../../../services/lend/query";
import { decode } from "../../../utils/string";
import BorrowTab from "./Borrow";
import RepayTab from "./Repay";
import Withdraw from "./Withdraw";
import "./index.less";

const PageBackButton = {
  right: <BackButton />,
};

const EmodeDetails = ({
  address,
  setPool,
  setPoolLends,
  setUserBorrows,
  poolLendPositions,
}) => {
  const [activeKey, setActiveKey] = useState("1");

  const [inProgress, setInProgress] = useState(false);
  const [userBorrowPositions, setUserBorrowPositions] = useState([]);

  let { id } = useParams();

  const location = useLocation();
  const type = decode(location.hash);

  useEffect(() => {
    if (type && type === "withdraw") {
      setActiveKey("3");
    }
    if (type && type === "repay") {
      setActiveKey("4");
    }
  }, []);

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

  useEffect(() => {
    if (address) {
      queryUserLends(address, (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }

        setPoolLends(result?.lends);
      });

      queryUserBorrows(address, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        setUserBorrows(result?.borrows || []);
      });
    }
  }, [address]);

  useEffect(() => {
    if (address && id) {
      fetchAllBorrowByOwnerAndPool(address, id);
    }
  }, [address, id]);

  const fetchAllBorrowByOwnerAndPool = (address, poolId) => {
    queryAllBorrowByOwnerAndPool(address, poolId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setUserBorrowPositions(result?.borrows);
    });
  };

  const tabItems = [
    {
      label: (
        <>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title="Lend assets to open borrow position"
          >
            Borrow
          </Tooltip>
        </>
      ),
      key: "1",
      children: <BorrowTab />,
    },
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
      key: "2",
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
      key: "3",
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

EmodeDetails.propTypes = {
  setPool: PropTypes.func.isRequired,
  setPoolLends: PropTypes.func.isRequired,
  setUserBorrows: PropTypes.func.isRequired,
  address: PropTypes.string,
  poolLendPositions: PropTypes.arrayOf(
    PropTypes.shape({
      assetId: PropTypes.shape({
        low: PropTypes.number,
      }),
      lendingId: PropTypes.shape({
        low: PropTypes.number,
      }),
      amountIn: PropTypes.shape({
        denom: PropTypes.string,
        amount: PropTypes.string,
      }),
    })
  ),
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
    poolLendPositions: state.lend.poolLends,
  };
};

const actionsToProps = {
  setPool,
  setPoolLends,
  setUserBorrows,
};

export default connect(stateToProps, actionsToProps)(EmodeDetails);
