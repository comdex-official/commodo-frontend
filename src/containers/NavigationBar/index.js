import "./index.less";
import ConnectButton from "./ConnectButton";
import React, { useState, useEffect } from "react";
import ThemeToggle from "../../components/Theme/themeToggle";
import { Button } from "antd";
import { SvgIcon } from "../../components/common";

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
      <div className="connect-button">
        <Button type="primary" className="btn-filled circle-btn"><SvgIcon name='squares' viewbox='0 0 15.48 15.48' /></Button>
        <Button type="primary" className="btn-filled circle-btn"><SvgIcon name='faucet-icon' viewbox='0 0 14.495 18.92' /></Button>
        <ConnectButton />
      </div>
    </nav>
  );
};

export default NavigationBar;
