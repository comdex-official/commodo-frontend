import { combineReducers } from "redux";
import {
  SET_LEDGER_ACCOUNT_NUMBER,
  SIGN_IN_LEDGER_MODAL_HIDE
} from "../constants/ledger";

const ledgerModal = (state = false, { type }) => {
  switch (type) {
    case SIGN_IN_LEDGER_MODAL_HIDE:
      return false;
    default:
      return state;
  }
};

const accountIndex = (
  state = {
    value: "",
    error: {
      message: "",
    },
  },
  { type }
) => {
  switch (type) {
    default:
      return state;
  }
};

const accountNumber = (
  state = {
    value: "",
    error: {
      message: "",
    },
  },
  { type, data }
) => {
  switch (type) {
    case SET_LEDGER_ACCOUNT_NUMBER:
      return {
        ...state,
        value: data.value,
        error: {
          ...state.error,
          message: data.error.message,
        },
      };
    default:
      return state;
  }
};

const ledgerInfo = (
  state = {
    value: "",
    error: {
      message: "",
    },
  },
  { type, data }
) => {
  switch (type) {
    case SIGN_IN_LEDGER_MODAL_HIDE:
      return {
        ...state,
        value: "",
        error: {
          ...state.error,
          message: "",
        },
      };
    default:
      return state;
  }
};

export default combineReducers({
  ledgerModal,
  ledgerInfo,
  accountIndex,
  accountNumber,
});
