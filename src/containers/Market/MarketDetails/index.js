import { Tabs } from "antd";
import { BackButton } from "../../../components/common";
import BorrowDetails from "../../Market/Borrow/Details";
import SupplyDetails from '../Supply/Details';
import './index.less';
import Repay_2 from "./Repay_2";
import Withdraw_2 from "./Withdraw_2";

const PageBackButton = {
    right: <BackButton />,
};

const MarketDetails = () => {
    const tabItems = [
        {
            label: "Lend",
            key: "1",
            children: <SupplyDetails />
        },
        {
            label: "Borrow",
            key: "2",
            children: <BorrowDetails />
        },
        {
            label: "Withdraw",
            key: "3",
            children: <Withdraw_2 />
        },
        {
            label: "Repay",
            key: "4",
            children: <Repay_2 />
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