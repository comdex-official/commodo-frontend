import React from "react";
import { Carousel } from "antd";
import CMDX_ATOM from "../../../assets/images/CMDX-ATOM.svg";
import EMOD from "../../../assets/images/EMOD.svg";
import Back from "../../../assets/images/back-img.svg";

const DashboardNavBar = () => {
  return (
    <div className="dashboard-banner">
      <Carousel autoplay autoplaySpeed={4000} className="banner-carousel">
        <div className="carousel-item">
          <img src={Back} alt="Back-Logo" className="back-img" />
          <div className="carousel-element">
            <div className="coming-soon">
              <div className="coming-soon-title">Coming Soon!</div>
            </div>
            <div className="reward-section">
              <div className="title">E-mode or Efficiency mode</div>
              <div className="description">
                Discover more about increasing capital efficiency and maximizing
                LTVs for co-related assets.
              </div>
              <div className="learn-more">
                <a href="https://docs.commodo.one/e-mode" target="_blank">
                  Learn More!
                </a>
              </div>
            </div>
            <div className="logo-section">
              <img alt={"atom"} src={EMOD} className="overlap-icon-1" />
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <img src={Back} alt="Back-Logo" className="back-img" />
          <div className="carousel-element">
            <div className="coming-soon">
              <div className="coming-soon-title">Coming Soon!</div>
            </div>
            <div className="reward-section">
              <div className="title">Earn Boosted rewards on COMMODO</div>
              <div className="description">
                Provide liquidity on stCMDX-stATOM Master pool on cSwap.
              </div>
              <div className="learn-more">
                {" "}
                <a href="https://docs.commodo.one/rewards" target="_blank">
                  Learn More!
                </a>
              </div>
            </div>
            <div className="logo-section">
              <img alt={"atom"} src={CMDX_ATOM} className="overlap-icon-1" />
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default DashboardNavBar;
