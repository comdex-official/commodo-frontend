import { Button, message } from "antd";
import * as PropTypes from "prop-types";
import { useState } from "react";
import Snack from "../../../components/common/Snack";
import { signAndBroadcastTransaction } from "../../../services/helper";
import { defaultFee } from "../../../services/transaction";
import variables from "../../../utils/variables";

const InterestAndReward = ({ lang, address, updateDetails }) => {
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

        refreshData();
        message.success(
          <Snack
            message={variables[lang].tx_success}
            hash={result?.transactionHash}
          />
        );
      }
    );
  };

  const refreshData = () => {
    updateDetails();
  };

  return (
    <Button
      onClick={() => handleClick()}
      type="primary btn-filled"
      loading={inProgress}
      disabled={inProgress}
      className="btn-outline caclulate-btn"
      size="small"
    >
      Fetch Interest
    </Button>
  );
};

InterestAndReward.propTypes = {
  updateDetails: PropTypes.func.isRequired,
  address: PropTypes.string,
  lang: PropTypes.string,
  parent: PropTypes.string,
};

export default InterestAndReward;
