import * as PropTypes from "prop-types";
import { Col, Row } from "../../../../components/common";
import { connect } from "react-redux";
import { Button, message } from "antd";
import Borrow from "./Borrow";
import "./index.less";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { queryUserPoolLends } from "../../../../services/lend/query";
import { setPoolLends } from "../../../../actions/lend";

const BorrowDetails = ({ address, setPoolLends }) => {
  const [inProgress, setInProgress] = useState(false);

  let { id } = useParams();

  useEffect(() => {
    if (address && id) {
      setInProgress(true);

      queryUserPoolLends(address, id, (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }
        setPoolLends(result?.lends);
      });
    }
  }, [address, id]);

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
  setPoolLends: PropTypes.func.isRequired,
  address: PropTypes.string,
};

const stateToProps = (state) => {
  return {
    address: state.account.address,
  };
};

const actionsToProps = {
  setPoolLends,
};

export default connect(stateToProps, actionsToProps)(BorrowDetails);
