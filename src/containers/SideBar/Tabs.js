import * as PropTypes from "prop-types";
import { SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import { tabsList } from "./TabsList";
import React from "react";
import variables from "../../utils/variables";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { initializeChain } from "../../services/keplr";
import { message } from "antd";
import { encode } from "js-base64";
import { fetchKeplrAccountName } from "../../services/keplr";

const NavTabs = ({ setAccountAddress, lang, setAccountName, onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const route = location.pathname && location.pathname.split("/")[1];

  window.addEventListener("keplr_keystorechange", () => {
    handleConnectToKeplr();
  });

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
    };
  };

  return (
    <div className="vertical_tabs">
      <ul className="tabs_content">
        {tabsList.map((item) => {
          return (
            <li
              key={item.index}
              className={
                "tab " +
                (item.value === "dashboard" && !route
                  ? "active_tab"
                  : item.value === route
                  ? "active_tab"
                  : "")
              }
              value={item.value}
              onClick={
                () => {
                  navigate("/" + item.value);
                  onClick();
                }
              }
              {...a11yProps(0)}
            >
              <div className="tab-inner">
                <SvgIcon name={item.value} />
                {variables[lang][item.langKey]}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

NavTabs.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

export default connect(stateToProps)(NavTabs);
