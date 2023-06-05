import { Tabs, Tooltip } from "antd";
import { useState } from "react";
import { BackButton } from "../../../components/common";
import BorrowTab from "./Borrow";
import RepayTab from "./Repay";
import Withdraw from "./Withdraw";
import "./index.less";

const PageBackButton = {
  right: <BackButton />,
};

const DeprecatedcPool = () => {

  const [activeKey, setActiveKey] = useState("1");

  const tabItems = [
    {
      label: (
        <>
          <Tooltip
            overlayClassName="commodo-tooltip"
            title="No assets lent in this market to withdraw">
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
            title="No debt to repay in this market">
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

export default DeprecatedcPool;