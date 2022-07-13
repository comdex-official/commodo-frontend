import * as PropTypes from "prop-types";
import { Col, Row } from "../../../components/common";
import { connect } from "react-redux";
import { Button, Spin, Tabs } from "antd";
import BorrowTab from "./Borrow";
import RepayTab from "./Repay";
import CloseTab from "./Close";
import "./index.less";
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  queryBorrowPosition,
  queryLendPool,
} from "../../../services/lend/query";
import { setPool } from "../../../actions/lend";
import { decode } from "../../../utils/string";

const { TabPane } = Tabs;

const BackButton = {
  right: (
    <Link to="/myhome#borrow">
      <Button className="back-btn" type="primary">
        Back
      </Button>
    </Link>
  ),
};

const BorrowRepay = ({ setPool }) => {
  const [inProgress, setInProgress] = useState(false);
  const [borrowPosition, setBorrowPosition] = useState();
  const [activeKey, setActiveKey] = useState("1");

  let { id } = useParams();

  const location = useLocation();
  const type = decode(location.hash);

  console.log("the type", type);
  useEffect(() => {
    if (type && type === "repay") {
      setActiveKey("2");
    }
  }, []);

  useEffect(() => {
    if (id) {
      setInProgress(true);

      queryBorrowPosition(id, (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }
        if (result?.borrow?.pairId) {
          setBorrowPosition(result?.borrow);

          queryLendPool(result?.borrow?.poolId, (error, result) => {
            setInProgress(false);
            if (error) {
              message.error(error);
              return;
            }
            setPool(result?.pool);
          });
        }
      });
    }
  }, [id]);

  const refreshBorrowPosition = () => {
    if (id) {
      queryBorrowPosition(id, (error, result) => {
        setInProgress(false);
        if (error) {
          message.error(error);
          return;
        }
        if (result?.borrow?.pairId) {
          setBorrowPosition(result?.borrow);
        }
      });
    }
  };

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <Tabs
            className="commodo-tabs"
            defaultActiveKey="1"
            onChange={setActiveKey}
            activeKey={activeKey}
            tabBarExtraContent={BackButton}
          >
            <TabPane tab="Borrow" key="1">
              {inProgress ? (
                <div className="loader">
                  <Spin />
                </div>
              ) : (
                <BorrowTab
                  borrowPosition={borrowPosition}
                  dataInProgress={inProgress}
                />
              )}
            </TabPane>
            <TabPane tab="Repay" key="2">
              <RepayTab />
            </TabPane>
            <TabPane tab="Close" key="3">
              <CloseTab />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

BorrowRepay.propTypes = {
  lang: PropTypes.string.isRequired,
  setPool: PropTypes.func.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {
  setPool,
};

export default connect(stateToProps, actionsToProps)(BorrowRepay);
