import * as PropTypes from "prop-types";
import { Col, Row } from "../../../../components/common";
import { connect } from "react-redux";
import { Button, message } from "antd";
import Deposit from "./Deposit";
import "./index.less";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { queryLendPool } from "../../../../services/lend/query";
import { useParams } from "react-router";
import { setPool } from "../../../../actions/lend";

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
      <Row>
        <Col className="text-right mb-3">
          <Link to="/market">
            <Button className="back-btn" type="primary">
              Back
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Deposit dataInProgress={inProgress} />
      </Row>
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
