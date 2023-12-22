import { message } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import { setPool } from "../../../../actions/lend";
import { queryLendPool } from "../../../../services/lend/query";
import Deposit from "./Deposit";
import "./index.scss";

const SupplyDetails = ({ setPool }) => {
  const [inProgress, setInProgress] = useState(false);
  let { id } = useParams();

  useEffect(() => {
    if (id) {
      setInProgress(true);

      queryLendPool(id, (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }
        setPool(result?.pool);
      });
    }
  }, [id]);

  return (
    <div className="app-content-wrapper">
      <Deposit dataInProgress={inProgress} />
    </div>
  );
};

SupplyDetails.propTypes = {
  setPool: PropTypes.func.isRequired,
};

const actionsToProps = {
  setPool,
};

export default connect(null, actionsToProps)(SupplyDetails);
