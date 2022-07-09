import * as PropTypes from "prop-types";
import { Col, Row } from "../../../../components/common";
import { connect } from "react-redux";
import { Button, message } from "antd";
import Borrow from "./Borrow";
import "./index.less";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { queryLendPool } from "../../../../services/lend/query";
import { setPool } from "../../../../actions/lend";

const BorrowDetails = ({ setPool }) => {
  const [inProgress, setInProgress] = useState(false);

  const { id } = useParams();

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
      <Borrow dataInProgress={inProgress} />
    </div>
  );
};

BorrowDetails.propTypes = {
  setPool: PropTypes.func.isRequired,
};

const actionsToProps = {
  setPool,
};

export default connect(null, actionsToProps)(BorrowDetails);
