import { SvgIcon } from "../index";
import { iconNameFromDenom } from "../../../utils/string";
import { denomConversion } from "../../../utils/coin";
import * as PropTypes from "prop-types";
import TooltipIcon from "../TooltipIcon";

const CustomRow = ({ assetList, poolId }) => {
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
      {poolId && <div className="deposit-poolId">#{poolId}<TooltipIcon text="Pool Id" /></div>}
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
