import MyHome from "./containers/Myhome";
import Dashboard from "./containers/Dashboard";
import Market from "./containers/Market";
import Liquidation from "./containers/Liquidation";
import Airdrop from "./containers/Airdrop";
import Govern from "./containers/Govern"; 
import GovernDetails from "./containers/Govern/Details"; 
import DetailsView from "./containers/Market/Details";

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
    path: "/market",
    element: <Market />,
  },
  {
    path: "/details",
    element: <DetailsView />,
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
  }
];

export default routes;
