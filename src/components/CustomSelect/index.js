import { Select } from "antd";
import * as PropTypes from "prop-types";
import React from "react";
import { denomConversion } from "../../utils/coin";
import { iconNameFromDenom } from "../../utils/string";
import { NoDataIcon, SvgIcon } from "../common";

const Option = Select.Option;

const CustomSelect = ({ value, onChange, list }) => {
  return (
    <Select
      className="assets-select"
      popupClassName="asset-select-dropdown"
      value={value}
      placeholder={
        <div className="select-placeholder">
          <div className="circle-icon">
            <div className="circle-icon-inner" />
          </div>
          Select
        </div>
      }
      onChange={onChange}
      defaultActiveFirstOption={true}
      suffixIcon={<SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />}
      notFoundContent={<NoDataIcon />}
    >
      {list &&
        list.map((record) => {
          const item = record.denom ? record.denom : record;

          return (
            <Option key={item} value={item}>
              <div className="select-inner">
                <div className="svg-icon">
                  <div className="svg-icon-inner">
                    <SvgIcon name={iconNameFromDenom(item)} />
                  </div>
                </div>
                <div className="name">{denomConversion(item)}</div>
              </div>
            </Option>
          );
        })}
    </Select>
  );
};

CustomSelect.propTypes = {
  className: PropTypes.string,
  list: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.any,
};

export default CustomSelect;
