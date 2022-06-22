import * as PropTypes from "prop-types";
import { Col, Row } from "../../../../components/common";
import { connect } from "react-redux";
import {Button, message, Tabs} from "antd";
import WithdrawTab from "./Withdraw";
import DepositTab from "./Deposit";
import "./index.less";
import { Link } from "react-router-dom";
import {useEffect} from "react";
import {queryLendPool} from "../../../../services/lend/query";
import {useParams} from "react-router";
import {setPool} from "../../../../actions/lend";

const { TabPane } = Tabs;

const BackButton = {
  right: (
    <Link to="/market">
      <Button className="back-btn" type="primary">
        Back
      </Button>
    </Link>
  ),
};

const SupplyDetails = ({setPool}) => {
  let { id } = useParams();

  useEffect(()=>{
    if(id){
      queryLendPool(id, (error, result)=>{
        if(error){
          message.error(error);
          return;
        }
        setPool(result?.pool)
      })
    }
  },[id])

  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <Tabs
            className="commodo-tabs"
            defaultActiveKey="1"
            tabBarExtraContent={BackButton}
          >
            <TabPane tab="Deposit" key="1">
              <DepositTab />
            </TabPane>
            <TabPane tab="Withdraw" key="2">
              <WithdrawTab />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

SupplyDetails.propTypes = {
  setPool: PropTypes.func.isRequired,
};

const actionsToProps = {
  setPool
};

export default connect(null, actionsToProps)(SupplyDetails);
