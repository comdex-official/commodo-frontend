import { SvgIcon } from "../index";
import { iconNameFromDenom } from "../../../utils/string";
import { denomConversion } from "../../../utils/coin";
import * as PropTypes from "prop-types";

const CustomRow = ({ assetList }) => {
  return (
    <div className="deposit-head">
      <div className="deposit-head-left">
        {assetList?.length > 0 &&
          assetList?.map((item) => (
            <div className="assets-col mr-3" key={item?.denom}>
              <div className="assets-icon">
                <SvgIcon name={iconNameFromDenom(item?.denom)} />
              </div>
              {denomConversion(item?.denom)}
            </div>
          ))}
      </div>
    </div>
  );
};

CustomRow.propTypes = {
  assetList: PropTypes.arrayOf(
    PropTypes.shape({
      denom: PropTypes.string.isRequired,
    })
  ),
};

export default CustomRow;
