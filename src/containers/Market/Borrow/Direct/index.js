import { message } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setPools } from "../../../../actions/lend";
import {
  BackButton,
  Col,
  Row,
  SvgIcon,
  TooltipIcon,
} from "../../../../components/common";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
} from "../../../../constants/common";
import { queryLendPools } from "../../../../services/lend/query";
import Borrow from "./Borrow";
import "./index.scss";

const Direct = ({ setPools }) => {
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    setInProgress(true);

    queryLendPools(
      (DEFAULT_PAGE_NUMBER - 1) * DEFAULT_PAGE_SIZE,
      DEFAULT_PAGE_SIZE,
      true,
      false,
      (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }

        const filterData =
          process.env.REACT_APP_D_POOL === "open"
            ? result?.pools.filter((item) => Number(item?.poolId) !== 1)
            : result?.pools;

        setPools(filterData);
      }
    );
  }, []);

  return (
    <div className="app-content-wrapper">
      <Row className="align-items-center">
        <Col className="dborrow-heading-left">
          <SvgIcon
            className="dborrow-iconhead"
            name="direct-borrow"
            viewbox="0 0 57.25 54.685"
          />{" "}
          Direct Borrow <TooltipIcon text="Lend and Borrow in one click" />
        </Col>
        <Col className="text-right mb-3">
          <BackButton />
        </Col>
      </Row>
      <Borrow dataInProgress={inProgress} />
    </div>
  );
};

Direct.propTypes = {
  setPools: PropTypes.func.isRequired,
};

const actionsToProps = {
  setPools,
};

export default connect(null, actionsToProps)(Direct);
