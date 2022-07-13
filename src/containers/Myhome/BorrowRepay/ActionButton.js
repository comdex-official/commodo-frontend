import { Button, message } from "antd";
import { signAndBroadcastTransaction } from "../../../services/helper";
import { getAmount } from "../../../utils/coin";
import { defaultFee } from "../../../services/transaction";
import Snack from "../../../components/common/Snack";
import variables from "../../../utils/variables";
import { useState } from "react";
import { useNavigate } from "react-router";

export const ActionButton = ({
  lang,
  disabled,
  name,
  address,
  borrowId,
  amount,
  denom,
  refreshData,
}) => {
  const [inProgress, setInProgress] = useState(false);
  const navigate = useNavigate();

  const messageMap = {
    Borrow: "/comdex.lend.v1beta1.MsgDraw",
    Repay: "/comdex.lend.v1beta1.MsgRepay",
    Close: "/comdex.lend.v1beta1.MsgCloseBorrow",
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
              amount: getAmount(amount),
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
          message.error(error);
          return;
        }

        if (result?.code) {
          message.info(result?.rawLog);
          return;
        }

        message.success(
          <Snack
            message={variables[lang].tx_success}
            hash={result?.transactionHash}
          />
        );
        if (name !== "Close") {
          refreshData();
        } else {
          navigate("/myhome");
        }
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
      {name}
    </Button>
  );
};

export default ActionButton;
