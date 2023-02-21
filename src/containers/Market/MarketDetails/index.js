import { Tabs } from "antd";
import { BackButton } from "../../../components/common";
import Lend from "./Lend";
import './index.less';
import Borrow from "./Borrow";
import Withdraw from "./Withdraw";
import Repay from "./Repay";
import SupplyDetails from '../Supply/Details'
import BorrowDetails from "../../Market/Borrow/Details";
import DepositWithdraw from "../../Myhome/DepositWithdraw";
import BorrowRepay from "../../Myhome/BorrowRepay";
import Withdraw_2 from "./Withdraw_2";
import Repay_2 from "./Repay_2";
// import BorrowDetails from "./containers/Market/Borrow/Details";

const PageBackButton = {
    right: <BackButton />,
};

const MarketDetails = () => {
    const tabItems = [
        {
            label: "Lend",
            key: "1",
            // children: <Lend />
            children: <SupplyDetails />
        },
        {
            label: "Borrow",
            key: "2",
            // children: <Borrow />
            children: <BorrowDetails />
        },
        {
            label: "Withdraw",
            key: "3",
            // children: <Withdraw />
            // children: <DepositWithdraw />
            children: <Withdraw_2 />
        },
        {
            label: "Repay",
            key: "4",
            // children: <Repay />
            // children: <BorrowRepay />
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