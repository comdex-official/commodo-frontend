import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  let navigate = useNavigate();

  return (
    <Button className="back-btn" type="primary" onClick={() => navigate(-1)}>
      Back
    </Button>
  );
};

export default BackButton;
