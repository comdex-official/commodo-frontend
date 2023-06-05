import { Button, message, Spin, Tooltip } from "antd";
import * as PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { setPools } from "../../../actions/lend";
import { SvgIcon } from "../../../components/common";
import DistributionAPY from "../../../components/common/DistributionAPY";
import AssetApy from "../AssetApy";
import "./index.less";

const EmodeList = () => {
  const navigate = useNavigate();
  return (
    <div className="commodo-card bg-none">
      <div className="card-header d-flex align-items-center justify-content-between mb-3 ">
        <div>E-MODE markets</div>
        <div className="market-header-right">
          <Button onClick={() => navigate({pathname: `/market`})}>Market</Button>
          <Tooltip
              overlayClassName="commodo-tooltip"
              title="Lend and Borrow in one click"
            >
            <Button onClick={() => navigate({pathname: `/borrow/direct`})}>Direct Borrow</Button>
          </Tooltip>
          <Button onClick={() => navigate({pathname: `/deprecated-cpool`})}>Deprecated cPool</Button>
        </div>
      </div>
      <div className="card-content">
        <div className="market-list">

          <div className="market-list-item"
            onClick={() =>
              navigate({
                pathname: `/e-mode-details`,
              })
            }>
            <div className="commodo-card">
              <div className="header1 emode-header">
                <div className="assets-col mr-3">
                  <div className="assets-icon">
                    <SvgIcon
                      name='atom-icon'
                    />
                  </div>
                  <div className="assets-icon">
                    <SvgIcon
                      name='statom-icon'
                    />
                  </div>
                  ATOM - stATOM
                </div>
              </div>
              <div className="header2 d-flex">
                <div>
                  <div className="upper-label">Available to borrow</div>
                  <div className="header2-inner">
                    <div className="assets-col mr-3">
                      <div className="assets-icon">
                        <SvgIcon name='atom-icon' />
                      </div>
                      2.7M
                    </div>
                    <div className="assets-col mr-3">
                      <div className="assets-icon">
                        <SvgIcon name='atom-icon' />
                      </div>
                      1.8M
                    </div>
                  </div>
                </div>
                <div className="pl-3">
                  <div className="upper-label">TVL</div>
                  <div className="tvl-col mt-2">
                    22.34%
                  </div>
                </div>
              </div>
              <div className="details">
                <table cellSpacing={0}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Lend APY</th>
                      <th>Borrow APY</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>
                        ATOM
                      </th>
                      <td>
                        <AssetApy />
                      </td>
                      <td>
                        <div className="d-flex">
                          <AssetApy />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        stATOM
                      </th>
                      <td>
                        <AssetApy />
                      </td>
                      <td>
                        <div className="d-flex">
                          <AssetApy />
                          <Tooltip
                            placement="topLeft"
                            className="distribution-apy-button"
                            title={"Boosted rewards for Borrowing"}
                          >
                            <DistributionAPY />
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="market-list-item"
            onClick={() =>
              navigate({
                pathname: `/e-mode-details`,
              })
            }>
            <div className="commodo-card">
              <div className="header1 emode-header">
                <div className="assets-col mr-3">
                  <div className="assets-icon">
                    <SvgIcon
                      name='atom-icon'
                    />
                  </div>
                  <div className="assets-icon">
                    <SvgIcon
                      name='statom-icon'
                    />
                  </div>
                  ATOM - stATOM
                </div>
              </div>
              <div className="header2 d-flex">
                <div>
                  <div className="upper-label">Available to borrow</div>
                  <div className="header2-inner">
                    <div className="assets-col mr-3">
                      <div className="assets-icon">
                        <SvgIcon name='atom-icon' />
                      </div>
                      2.7M
                    </div>
                    <div className="assets-col mr-3">
                      <div className="assets-icon">
                        <SvgIcon name='atom-icon' />
                      </div>
                      1.8M
                    </div>
                  </div>
                </div>
                <div className="pl-3">
                  <div className="upper-label">TVL</div>
                  <div className="tvl-col mt-2">
                    22.34%
                  </div>
                </div>
              </div>
              <div className="details">
                <table cellSpacing={0}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Lend APY</th>
                      <th>Borrow APY</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>
                        ATOM
                      </th>
                      <td>
                        <AssetApy />
                      </td>
                      <td>
                        <div className="d-flex">
                          <AssetApy />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        stATOM
                      </th>
                      <td>
                        <AssetApy />
                      </td>
                      <td>
                        <div className="d-flex">
                          <AssetApy />
                          <Tooltip
                            placement="topLeft"
                            className="distribution-apy-button"
                            title={"Boosted rewards for Borrowing"}
                          >
                            <DistributionAPY />
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="market-list-item"
            onClick={() =>
              navigate({
                pathname: `/e-mode-details`,
              })
            }>
            <div className="commodo-card">
              <div className="header1 emode-header">
                <div className="assets-col mr-3">
                  <div className="assets-icon">
                    <SvgIcon
                      name='atom-icon'
                    />
                  </div>
                  <div className="assets-icon">
                    <SvgIcon
                      name='statom-icon'
                    />
                  </div>
                  ATOM - stATOM
                </div>
              </div>
              <div className="header2 d-flex">
                <div>
                  <div className="upper-label">Available to borrow</div>
                  <div className="header2-inner">
                    <div className="assets-col mr-3">
                      <div className="assets-icon">
                        <SvgIcon name='atom-icon' />
                      </div>
                      2.7M
                    </div>
                    <div className="assets-col mr-3">
                      <div className="assets-icon">
                        <SvgIcon name='atom-icon' />
                      </div>
                      1.8M
                    </div>
                  </div>
                </div>
                <div className="pl-3">
                  <div className="upper-label">TVL</div>
                  <div className="tvl-col mt-2">
                    22.34%
                  </div>
                </div>
              </div>
              <div className="details">
                <table cellSpacing={0}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Lend APY</th>
                      <th>Borrow APY</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>
                        ATOM
                      </th>
                      <td>
                        <AssetApy />
                      </td>
                      <td>
                        <div className="d-flex">
                          <AssetApy />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        stATOM
                      </th>
                      <td>
                        <AssetApy />
                      </td>
                      <td>
                        <div className="d-flex">
                          <AssetApy />
                          <Tooltip
                            placement="topLeft"
                            className="distribution-apy-button"
                            title={"Boosted rewards for Borrowing"}
                          >
                            <DistributionAPY />
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmodeList;