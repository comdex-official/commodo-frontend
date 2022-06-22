import { Col, Row } from "../../components/common";
import Supply from "./Supply";
import Borrow from "./Borrow";
import "./index.less";

const Market = () => {
  return (
    <div className="app-content-wrapper">
      <Row>
        <Col>
          <Supply />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Borrow />
        </Col>
      </Row>
    </div>
  );
};

export default Market;
