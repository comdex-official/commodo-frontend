import { combineReducers } from "redux";
import account from "./account";
import asset from "./asset";
import auction from "./auction";
import govern from "./govern";
import language from "./language";
import ledger from "./ledger";
import lend from "./lend";
import oracle from "./oracle";
import theme from "./theme";

const app = combineReducers({
  language,
  account,
  asset,
  lend,
  auction,
  theme,
  oracle,
  ledger,
  govern,
});

const root = (state, action) => {
  if (action.type === "ACCOUNT_ADDRESS_SET" && action.value === "") {
    state.account = undefined; //explicitly clearing account data
  }

  return app(state, action);
};

export default root;
