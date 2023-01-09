import { Button, Tooltip } from "antd";
import { useNavigate } from "react-router";

export const ActionButton = ({ name, path, isDisabled, text }) => {
  const navigate = useNavigate();

  return (
    <Tooltip overlayClassName="commodo-tooltip" title={text || ""}>
      <Button
        type="primary"
        size="small"
        disabled={isDisabled}
        onClick={() =>
          navigate({
            pathname: path || "/",
          })
        }
      >
        {name || "Action"}
      </Button>
    </Tooltip>
  );
};
