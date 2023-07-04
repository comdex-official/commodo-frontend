import "./index.less";
import ConnectButton from "./ConnectButton";
import React, { useState, useEffect } from "react";
import ThemeToggle from "../../components/Theme/themeToggle";
import { Button, Dropdown } from "antd";
import { SvgIcon } from "../../components/common";
import Cswap from "../../assets/images/c-swap.svg";
import Bridge from "../../assets/images/bridgeDark.svg";
import Bridge2 from "../../assets/images/bridge.svg";
import Harbor from "../../assets/images/harbur.svg";

const NavigationBar = () => {
  const [isSetOnScroll, setOnScroll] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setOnScroll(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = [
    {
      key: "item-2",
      label: (
        <div className="drp-down">
          <button
            onClick={() =>
              window.open("https://app.harborprotocol.one/", "_blank")
            }
          >
            <img src={Harbor} alt="sla" />
          </button>
          <button
            onClick={() => window.open("https://app.cswap.one/", "_blank")}
          >
            <img src={Cswap} alt="sla" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <nav className={isSetOnScroll ? "top_bar fixedHeaderOnScroll" : "top_bar"}>
      <ThemeToggle />
      <div className="connect-button" id="topRightToogle2">
        <Button
          type="primary"
          className="btn-filled circle-btn"
          onClick={() => window.open("https://transit.comdex.one/", "_blank")}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hover ? (
            <img src={Bridge2} alt="sla" />
          ) : (
            <img src={Bridge} alt="sla" />
          )}
        </Button>
        <Dropdown
          menu={{ items }}
          placement="bottomLeft"
          trigger={["click"]}
          overlayClassName="dropconnect-overlay"
          getPopupContainer={() => document.getElementById("topRightToogle2")}
          autoAdjustOverflow={false}
        >
          <Button type="primary" className="btn-filled circle-btn">
            <SvgIcon name="squares" viewbox="0 0 15.48 15.48" />
          </Button>
        </Dropdown>
        <Button
          type="primary"
          className="btn-filled circle-btn"
          onClick={() => window.open("https://faucet.comdex.one/", "_blank")}
        >
          <SvgIcon name="faucet-icon" viewbox="0 0 14.495 18.92" />
        </Button>

        <ConnectButton />
      </div>
    </nav>
  );
};

export default NavigationBar;
