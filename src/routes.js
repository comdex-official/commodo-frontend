import Airdrop from "./containers/Airdrop";
import Assets from "./containers/Assets";
import Auction from "./containers/Auction";
import Dashboard from "./containers/Dashboard";
import Extra from "./containers/Extra";
import Govern from "./containers/Govern";
import GovernDetails from "./containers/Govern/Details";
import Borrow from "./containers/Market/Borrow";
import BorrowDetails from "./containers/Market/Borrow/Details";
import DirectBorrow from "./containers/Market/Borrow/Direct";
import MarketDetails from "./containers/Market/MarketDetails";
import MarketList from "./containers/Market/MarketList";
import Lend from "./containers/Market/Supply";
import SupplyDetails from "./containers/Market/Supply/Details";
import MyHome from "./containers/Myhome";
import BorrowRepay from "./containers/Myhome/BorrowRepay";
import Deposit from "./containers/Myhome/DepositWithdraw";
import EmodeList from "./containers/Market/Emode";
import EmodeDetails from "./containers/Market/EmodeDetails";
import DeprecatedcPool from "./containers/Market/DeprecatedcPool";

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
    path: "/myhome/borrow/:id",
    element: <BorrowRepay />,
  },
  {
    path: "/myhome/deposit/:id",
    element: <Deposit />,
  },
  {
    path: "/lend",
    element: <Lend />,
  },
  {
    path: "/borrow",
    element: <Borrow />,
  },
  {
    path: "/lend/:id",
    element: <SupplyDetails />,
  },
  {
    path: "/borrow/:id",
    element: <BorrowDetails />,
  },
  {
    path: "/borrow/direct",
    element: <DirectBorrow />,
  },
  {
    path: "/auction",
    element: <Auction />,
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
    path: "/govern/:id",
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
  {
    path: "/market-details/:id",
    element: <MarketDetails />,
  },
  {
    path: "/market",
    element: <MarketList />,
  },
  {
    path: "/e-mode",
    element: <EmodeList />,
  },
  {
    path: "/e-mode-details/:id/:id2/:id3/:id4",
    element: <EmodeDetails />,
  },
  {
    path: "/deprecated-cpool/:id",
    element: <DeprecatedcPool />,
  },
];

export default routes;
