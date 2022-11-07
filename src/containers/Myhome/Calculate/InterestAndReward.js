import { Button, message } from "antd";
import * as PropTypes from "prop-types";
import { useState } from "react";
import Snack from "../../../components/common/Snack";
import { signAndBroadcastTransaction } from "../../../services/helper";
import { defaultFee } from "../../../services/transaction";
import variables from "../../../utils/variables";

const InterestAndReward = ({ parent, lang, address }) => {
  const [inProgress, setInProgress] = useState(false);

  const handleClick = () => {
    setInProgress(true);

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.lend.v1beta1.MsgCalculateInterestAndRewards",
          value: {
            borrower: address,
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

        updateDetails();
        message.success(
          <Snack
            message={variables[lang].tx_success}
            hash={result?.transactionHash}
          />
        );
      }
    );
  };

  const updateDetails = () => {
    // TODO: based on parent call the borrow or lend list of user and update redux.
  }
  
  return (
    <Button
      onClick={() => handleClick(borrowPosition)}
      type="primary"
      loading={inProgress}
      disabled={inProgress}
      className="btn-filled table-btn ml-1"
      size="small"
    >
      Calculate
    </Button>
  );
};

InterestAndReward.propTypes = {
  address: PropTypes.string,
  lang: PropTypes.string,
  parent: PropTypes.string,
};

export default InterestAndReward;
