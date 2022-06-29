import MyHome from "./containers/Myhome";
import Dashboard from "./containers/Dashboard";
import Market from "./containers/Market";
import Liquidation from "./containers/Liquidation";
import Airdrop from "./containers/Airdrop";
import Govern from "./containers/Govern";
import GovernDetails from "./containers/Govern/Details";
import BorrowRepay from "./containers/Myhome/BorrowRepay";
import Deposit from "./containers/Myhome/DepositWithdraw";
import Assets from "./containers/Assets";
import Extra from "./containers/Extra";
import SupplyDetails from "./containers/Market/Supply/Details";
import BorrowDetails from "./containers/Market/Borrow/Details";

const routes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/myhome",
    element: <MyHome />,
  },
  {
    path: "/borrow",
    element: <BorrowRepay />,
  },
  {
    path: "/deposit/:id",
    element: <Deposit />,
  },
  {
    path: "/market",
    element: <Market />,
  },
  {
    path: "/supply-details/:id",
    element: <SupplyDetails />,
  },
  {
    path: "/borrow-details/:id",
    element: <BorrowDetails />,
  },
  {
    path: "/liquidation",
    element: <Liquidation />,
  },
  {
    path: "/airdrop",
    element: <Airdrop />,
  },
  {
    path: "/govern",
    element: <Govern />,
  },
  {
    path: "/govern-details",
    element: <GovernDetails />,
  },
  {
    path: "/asset",
    element: <Assets />,
  },
  {
    path: "/extra",
    element: <Extra />,
  },
];

export default routes;
