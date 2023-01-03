import { amountConversion } from "../utils/coin";

export const ValidateInputNumber = (value, max, key, dollarValue) => {
  if (value < 0) {
    return new Error("Input must be positive number");
  }

  if (max === 0) {
    return new Error("No available balance");
  }

  if (max && Number(max) < value) {
    return new Error("Insufficient funds");
  }

  if (key === "macro" && value !== 0 && amountConversion(value) <= 0.0001) {
    return new Error("Input amount should be over 100 micro");
  }
  if (key === "whole" && !Number.isInteger(Number(value))) {
    return new Error("Input must be a whole number");
  }

  if (key === "dollar" && Number(dollarValue) < 1) {
    return new Error("Min. borrowable amount is 1$");
  }

  if (key === "repay" && Number(dollarValue) < value) {
    return new Error("Input is greater than max repayable");
  }

  return new Error("");
};
