import { Tabs } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useParams } from "react-router";
import { setPool, setPoolLends } from "../../../actions/lend";
import { BackButton } from "../../../components/common";
import {
  queryLendPool,
  queryUserPoolLends
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
  poolLendPositions,
}) => {
  const [inProgress, setInProgress] = useState(false);

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
      queryUserPoolLends(address, (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }
        setPoolLends(result?.lends);
      });
    }
  }, [address]);

  const tabItems = [
    {
      label: "Lend",
      key: "1",
      children: <SupplyDetails />,
    },
    {
      label: "Borrow",
      key: "2",
      children: <BorrowDetails />,
      disabled: !poolLendPositions?.length,
    },
    {
      label: "Withdraw",
      key: "3",
      children: <Withdraw_2 />,
    },
    {
      label: "Repay",
      key: "4",
      children: <Repay_2 />,
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
};

export default connect(stateToProps, actionsToProps)(MarketDetails);
