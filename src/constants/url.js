import { envConfig } from "../config/envConfig";
let app = process.env.REACT_APP_APP;
// tf = range 60- 1H, 1440 - 1D, 10080 - 1W,  43800 - 1M
export const CAMPAIGN_URL = "https://test-campaign.comdex.one";
export const API_URL = envConfig?.apiUrl;
export const CSWAP_URL = envConfig?.[app]?.cswapUrl;
export const REWARDS_URL = envConfig?.[app]?.rewardsUrl;
export const COINGECKO_API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=comdex,cosmos,osmosis,juno-network,axlusdc,axlweth,wrapped-bitcoin,stride-staked-atom&vs_currencies=usd";
