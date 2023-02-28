import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { BackButton } from "../../../components/common";
import { decode } from "../../../utils/string";
import BorrowDetails from "../../Market/Borrow/Details";
import SupplyDetails from "../Supply/Details";
import "./index.less";
import Repay_2 from "./Repay_2";
import Withdraw_2 from "./Withdraw_2";

const PageBackButton = {
  right: <BackButton />,
};

const MarketDetails = () => {
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

export default MarketDetails;
