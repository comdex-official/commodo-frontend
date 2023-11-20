import { message, Tabs, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useParams } from "react-router";
import { setPool, setPoolLends, setUserBorrows } from "../../../actions/lend";
import { BackButton } from "../../../components/common";
import {
  queryBorrowByOwnerAndDebtPool,
  queryEMode,
  queryLendPool,
  queryUserBorrows,
  queryUserLends,
} from "../../../services/lend/query";
import { decode } from "../../../utils/string";
import BorrowDetails from "../../Market/Borrow/Details";
import SupplyDetails from "../Supply/Details";
import "./index.less";
import Repay_2 from "./Repay_2";
import Withdraw_2 from "./Withdraw_2";

const PageBackButton = {
  right: <BackButton />,
};

const MarketDetails = ({
  address,
  setPool,
  setPoolLends,
  setUserBorrows,
  poolLendPositions,
}) => {
  const [inProgress, setInProgress] = useState(false);
  const [userBorrowPositions, setUserBorrowPositions] = useState([]);

  let { id } = useParams();

  const [activeKey, setActiveKey] = useState("1");

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

  const [eModData, setEModData] = useState([]);

  const fetchLendPools = () => {
    queryEMode((error, result) => {
      if (error) {
        message.error(error);
        return;
      }

      setEModData(result?.data);
    });
  };

  useEffect(() => {
    fetchLendPools();
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
    if (address && eModData) {
      queryUserLends(address, (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }

        const rs =
          process.env.REACT_APP_D_POOL === "open"
            ? result?.lends.filter((item) => Number(item?.poolId) !== 1)
            : result?.lends;

        setPoolLends(rs);
      });

      queryUserBorrows(address, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        setUserBorrows(result?.borrows || []);
      });
    }
  }, [address, eModData]);

  useEffect(() => {
    if (address && id) {
      fetchAllBorrowByOwnerAndPool(address, id);
    }
  }, [address, id]);

  const fetchAllBorrowByOwnerAndPool = (address, poolId) => {
    queryBorrowByOwnerAndDebtPool(address, poolId, (error, result) => {
      if (error) {
        message.error(error);
        return;
      }
      console.log(result);
      setUserBorrowPositions(result?.borrows);
    });
  };

  const tabItems = [
    {
      label: "Lend",
      key: "1",
      children: <SupplyDetails />,
    },
    {
      label: (
        <>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title={
              !poolLendPositions?.length ? "Lend assets first to Borrow" : ""
            }
          >
            Borrow
          </Tooltip>
        </>
      ),
      key: "2",
      children: <BorrowDetails />,
      disabled: !poolLendPositions?.length,
    },
    {
      label: (
        <>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title={
              !poolLendPositions?.length ? "Lend assets first to Withdraw" : ""
            }
          >
            Withdraw
          </Tooltip>
        </>
      ),
      key: "3",
      children: <Withdraw_2 />,
      disabled: !poolLendPositions?.length,
    },
    {
      label: (
        <>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title={
              !userBorrowPositions?.length
                ? "No debt to Repay in this market"
                : ""
            }
          >
            Repay
          </Tooltip>
        </>
      ),
      key: "4",
      children: <Repay_2 />,
      disabled: !userBorrowPositions?.length,
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

MarketDetails.propTypes = {
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

export default connect(stateToProps, actionsToProps)(MarketDetails);
