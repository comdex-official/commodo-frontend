import React from "react";
import { SvgIcon } from "../../components/common";
import "./index.less";
import { Tooltip } from "antd";

const Footer = () => {
  return (
    <div className="footer">
      <div className="social-icons">
        <Tooltip overlayClassName="commodo-tooltip" title="Discord">
          <a
            aria-label="Discord"
            title="Discord"
            target="_blank"
            rel="noreferrer"
            href="https://bit.ly/ComdexOfficialDiscord"
          >
            <SvgIcon name="discord" viewbox="0 0 29.539 22.155" />
          </a>
        </Tooltip>
        <Tooltip overlayClassName="commodo-tooltip" title="Git Hub">
          <a
            aria-label="Github"
            title="Github"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/comdex-official"
          >
            <SvgIcon name="github" viewbox="0 0 22.154 21.607" />
          </a>
        </Tooltip>
        <Tooltip overlayClassName="commodo-tooltip" title="Telegram">
          <a
            aria-label="Telegram"
            title="Telegram"
            target="_blank"
            rel="noreferrer"
            href="https://t.me/commodo_finance"
          >
            <SvgIcon name="telegram" viewbox="0 0 24.635 20.66" />
          </a>
        </Tooltip>
        <Tooltip overlayClassName="commodo-tooltip" title="Twitter">
          <a
            aria-label="Twitter"
            title="Twitter"
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/Commodo_Finance"
          >
            <SvgIcon name="twitter" viewbox="0 0 25.617 20.825" />
          </a>
        </Tooltip>

        <Tooltip overlayClassName="commodo-tooltip" title="Blogs">
          <a
            aria-label="Medium"
            title="Medium"
            target="_blank"
            rel="noreferrer"
            href="https://medium.com/@Commodo_Finance"
          >
            <SvgIcon name="medium" viewbox="0 0 25.825 20.66" />
          </a>
        </Tooltip>
        <Tooltip overlayClassName="commodo-tooltip" title="Commodo Docs">
          <a
            aria-label="Docs"
            title="Docs"
            target="_blank"
            rel="noreferrer"
            href="https://docs.commodo.one/"
          >
            <SvgIcon name="docs" viewbox="0 0 22.154 21.607" />
          </a>
        </Tooltip>
      </div>
    </div>
  );
};

export default Footer;
