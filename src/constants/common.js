import { envConfig } from "../config/envConfig";
export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_BIDDING_PAGE_SIZE = 5;
export const DEFAULT_FEE = 100000;
export const DOLLAR_DECIMALS = 2;
export const ZERO_DOLLAR_DECIMALS = 0;
export const UC_DENOM = "uc";

let app = process.env.REACT_APP_APP;

export const NUMBER_OF_TOP_ASSETS = Number(envConfig?.[app]?.numberOfTopAssets);
export const APP_ID = Number(envConfig?.[app]?.appId);
export const CSWAP_APP_ID = envConfig?.[app]?.cswapAppId;
export const ATOM_CMDX_POOL_ID = envConfig?.[app]?.atomCmdxPoolId;
export const MAX_LTV_DEDUCTION = 0.005; // 0.5%
