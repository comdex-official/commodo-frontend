import { Button, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import Snack from "../../../components/common/Snack";
import { signAndBroadcastTransaction } from "../../../services/helper";
import { defaultFee } from "../../../services/transaction";
import { getAmount } from "../../../utils/coin";
import variables from "../../../utils/variables";
import { errorMessageMappingParser } from "../../../utils/string";

export const ActionButton = ({
  lang,
  disabled,
  name,
  address,
  borrowId,
  amount,
  denom,
  refreshData,
  assetDenomMap,
}) => {
  const [inProgress, setInProgress] = useState(false);
  const navigate = useNavigate();

  const messageMap = {
    Deposit: "/comdex.lend.v1beta1.MsgDepositBorrow",
    Borrow: "/comdex.lend.v1beta1.MsgDraw",
    Repay: "/comdex.lend.v1beta1.MsgRepay",
    Close: "/comdex.lend.v1beta1.MsgCloseBorrow",
    RepayWithDraw: "/comdex.lend.v1beta1.MsgRepayWithdraw",
  };

  const handleClick = () => {
    setInProgress(true);

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: messageMap[name],
          value: {
            borrower: address,
            borrowId: borrowId,
            amount: {
              amount: getAmount(amount, assetDenomMap[denom]?.dcimals),
              denom: denom,
            },
          },
        },
        fee: defaultFee(),
        memo: "",
      },
      address,
      (error, result) => {
        setInProgress(false);

        if (error) {
          console.log(error);
          message.error(error);
          return;
        }

        if (result?.code) {
          message.info(errorMessageMappingParser(result?.rawLog));
          return;
        }

        message.success(
          <Snack
            message={variables[lang].tx_success}
            hash={result?.transactionHash}
          />
        );

        navigate("/myhome#borrow");
      }
    );
  };

  return (
    <Button
      type="primary"
      className="btn-filled"
      loading={inProgress}
      disabled={disabled}
      onClick={handleClick}
    >
      {name === "RepayWithDraw" ? "Repay" : name}
    </Button>
  );
};

export default ActionButton;
