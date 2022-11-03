import { Button, message } from "antd";
import * as PropTypes from "prop-types";
import { useState } from "react";
import Snack from "../../../components/common/Snack";
import { signAndBroadcastTransaction } from "../../../services/helper";
import { queryBorrowPosition } from "../../../services/lend/query";
import { defaultFee } from "../../../services/transaction";
import { amountConversion, denomConversion } from "../../../utils/coin";
import { decimalConversion } from "../../../utils/number";
import variables from "../../../utils/variables";

const BorrowInterest = ({ borrowPosition, lang, address }) => {
  const [inProgress, setInProgress] = useState(false);
  const [latestPosition, setLatestPosition] = useState();

  const handleClick = (item) => {
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
    if (borrowPosition?.borrowingId) {
      queryBorrowPosition(borrowPosition?.borrowingId, (error, result) => {
        if (error) {
          message.error(error);
          return;
        }

        if (result?.borrow?.pairId) {
          setLatestPosition(result?.borrow);
        }
      });
    }
  };

  console.log("iti", borrowPosition);
  return (
    <>
      <>
        {amountConversion(
          decimalConversion(
            latestPosition?.interestAccumulated ||
              borrowPosition?.interestAccumulated
          )
        )}{" "}
        {denomConversion(borrowPosition?.amountOut?.denom)}
      </>

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
    </>
  );
};

BorrowInterest.propTypes = {
  address: PropTypes.string,
  lang: PropTypes.string,
  borrowPosition: PropTypes.shape({
    lendingId: PropTypes.shape({
      low: PropTypes.number,
    }),
    borrowingId: PropTypes.shape({
      low: PropTypes.number,
    }),
    owner: PropTypes.string,
  }),
};

export default BorrowInterest;
