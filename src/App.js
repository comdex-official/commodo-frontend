import React from "react";
import Router from "./Router";
import SvgSprite from "./utils/SvgSpriteLoader";

import "./app.less";

import NavigationBar from "./containers/NavigationBar";
import SideBar from "./containers/SideBar";
import svgFile from "./assets/images/svg/svg-sprite.svg";
import BodyBg from "./assets/images/body-bg.jpg";

const App = () => {
  return (
    <>
      <SvgSprite url={svgFile} />
      <div className="main_wrapper">
        <img className="body-bg" src={BodyBg} alt="background image"/>
        <SideBar />
        <div className="main-container">
          <NavigationBar />
          <Router />
        </div>
      </div>
    </>
  );
};

export default App;
