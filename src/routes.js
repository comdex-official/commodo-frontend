import Airdrop from "./containers/Airdrop";
import Assets from "./containers/Assets";
import Dashboard from "./containers/Dashboard";
import Extra from "./containers/Extra";
import Govern from "./containers/Govern";
import GovernDetails from "./containers/Govern/Details";
import Liquidation from "./containers/Liquidation";
import Market from "./containers/Market";
import BorrowDetails from "./containers/Market/Borrow/Details";
import SupplyDetails from "./containers/Market/Supply/Details";
import MyHome from "./containers/Myhome";
import BorrowRepay from "./containers/Myhome/BorrowRepay";
import Deposit from "./containers/Myhome/DepositWithdraw";

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
    path: "/borrow/:id",
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
    path: "/auction",
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
    path: "/govern-details/:id",
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
