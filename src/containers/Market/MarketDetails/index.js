import { Tabs } from "antd";
import { BackButton } from "../../../components/common";
import Lend from "./Lend";
import './index.less';
import Borrow from "./Borrow";
import Withdraw from "./Withdraw";
import Repay from "./Repay";

const PageBackButton = {
    right: <BackButton />,
};

const MarketDetails = () => {
    const tabItems = [
        {
            label: "Lend",
            key: "1",
            children: <Lend />
        },
        {
            label: "Borrow",
            key: "2",
            children: <Borrow />
        },
        {
            label: "Withdraw",
            key: "3",
            children: <Withdraw />
        },
        {
            label: "Repay",
            key: "4",
            children: <Repay />
        },
    ];
    return (
        <>
            <Tabs
                className="commodo-tabs"
                defaultActiveKey="1"
                tabBarExtraContent={PageBackButton}
                items={tabItems}
            />
        </>
    );
};


export default MarketDetails;