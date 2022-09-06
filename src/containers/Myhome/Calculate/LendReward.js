import { Button, message } from "antd";
import * as PropTypes from "prop-types";
import { useState } from "react";
import Snack from "../../../components/common/Snack";
import { signAndBroadcastTransaction } from "../../../services/helper";
import { queryLendPosition } from "../../../services/lend/query";
import { defaultFee } from "../../../services/transaction";
import {
  amountConversionWithComma,
  denomConversion
} from "../../../utils/coin";
import variables from "../../../utils/variables";

const LendReward = ({ lendPosition, lang }) => {
  const [inProgress, setInProgress] = useState(false);
  const [latestPosition, setLatestPosition] = useState();

  const handleClick = (item) => {
    setInProgress(true);

    signAndBroadcastTransaction(
      {
        message: {
          typeUrl: "/comdex.lend.v1beta1.MsgCalculateLendRewards",
          value: {
            lender: item?.owner,
            lendId: item?.lendingId,
          },
        },
        fee: defaultFee(),
        memo: "",
      },
      item?.owner,
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
    if (lendPosition?.lendingId) {
      queryLendPosition(lendPosition?.lendingId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }
        if (result?.lend?.poolId) {
          setLatestPosition(result?.lend);
        }
      });
    }
  };

  return (
    <>
      <>
        {amountConversionWithComma(
          latestPosition?.rewardAccumulated || lendPosition?.rewardAccumulated
        )}{" "}
        {denomConversion(lendPosition?.amountIn?.denom)}
      </>

      <Button
        onClick={() => handleClick(lendPosition)}
        type="primary"
        loading={inProgress}
        disabled={inProgress}
        className="btn-filled table-btn ml-1"
        size="small"
      >
        Calculate
      </Button>
    </>
  );
};

LendReward.propTypes = {
  lang: PropTypes.string,
  lendPosition: PropTypes.shape({
    lendingId: PropTypes.shape({
      low: PropTypes.number,
    }),
    owner: PropTypes.string,
  }),
};

export default LendReward;
