import "./index.less";
import ConnectButton from "./ConnectButton";
import React, { useState, useEffect } from "react";
import ThemeToggle from "../../components/Theme/themeToggle";
import { Button, Dropdown } from "antd";
import { SvgIcon } from "../../components/common";
import GetFaucet from "./GetFaucet";

import CommodoLogo from "../../assets/images/commodo-logo.svg";
import HarborLogo from "../../assets/images/harbor-logo.svg";
import CswapLogo from "../../assets/images/cswap-logo.svg";

const items = [
  {
    key: '1',
    icon: <img src={HarborLogo} alt='Harbor' />,
  },
  {
    key: '2',
    icon: <img src={CswapLogo} alt='Cswap' />,
  },
];

const NavigationBar = () => {
  const [isSetOnScroll, setOnScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setOnScroll(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  return (
    <nav className={isSetOnScroll ? "top_bar fixedHeaderOnScroll" : "top_bar"}>
      <ThemeToggle />
      <div className="mr-3">
        <GetFaucet />
        <Dropdown menu={{ items }} overlayClassName="commodobtn-drop" placement="bottom">
          <Button type="primary" className="commodo-btn">
            <img src={CommodoLogo} alt="Commodo" />
            <SvgIcon className='dropicon' name='drop-icon' viewbox='0 0 15.125 15' />
          </Button>
        </Dropdown>
      </div>
      <div className="connect-button">
        <ConnectButton />
      </div>
    </nav>
  );
};

export default NavigationBar;
