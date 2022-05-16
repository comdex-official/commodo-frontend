import MyHome from "./containers/Myhome";
import Dashboard from "./containers/Dashboard";
import Market from "./containers/Market";
import Liquidation from "./containers/Liquidation";
import Airdrop from "./containers/Airdrop";
import Govern from "./containers/Govern"; 
import GovernDetails from "./containers/Govern/Details"; 
import BorrowRepay from "./containers/Myhome/BorrowRepay";
import Deposit from "./containers/Myhome/Depositwithdraw";
import Assets from "./containers/Assets";

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
    path: "/deposit",
    element: <Deposit />,
  },
  {
    path: "/market",
    element: <Market />,
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
  }
];

export default routes;
