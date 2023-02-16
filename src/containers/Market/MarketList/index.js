import { Button, message, Table, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { SvgIcon } from "../../../components/common";
import { useNavigate } from "react-router";
import "./index.less";

const MarketList = () => {
  const navigate = useNavigate();
  return (
    <div className="commodo-card bg-none">
      <div className="card-header d-flex align-items-center justify-content-between mb-3 ">
        <div>Markets</div>
        <div>
          <Link to="/borrow/direct">
            <Tooltip
              overlayClassName="commodo-tooltip"
              title="Lend and Borrow in one click"
            >
              <Button
                className="back-btn ml-auto"
                icon={
                  <SvgIcon name="direct-borrow" viewbox="0 0 57.25 54.685" />
                }
                type="primary"
              >
                <span className="pl-1">Direct Borrow</span>
              </Button>
            </Tooltip>
          </Link>
        </div>
      </div>
      <div className="card-content">
        <div className="market-list">
          <div className="market-list-item" onClick={() => navigate({ pathname: "/market-details", })}>
            <div className="commodo-card">
              <div className="header1">
                <div className="assets-col mr-3">
                  <div className="assets-icon">
                    <SvgIcon name='cmdx-icon' />
                  </div>
                  CMDX
                </div>
                <div className="right-col">
                  #3
                </div>
              </div>
              <div className="header2">
                <div className="upper-label">Available to borrow</div>
                <div className="header2-inner">
                  <div className="assets-col mr-3">
                    <div className="assets-icon">
                      <SvgIcon name='cmdx-icon' />
                    </div>
                    2.7M
                  </div>
                  <div className="assets-col mr-3">
                    <div className="assets-icon">
                      <SvgIcon name='cmst-icon' />
                    </div>
                    654K
                  </div>
                  <div className="assets-col mr-3">
                    <div className="assets-icon">
                      <SvgIcon name='atom-icon' />
                    </div>
                    1.8M
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
                      <th>CMDX</th>
                      <td>1.25 %</td>
                      <td>2.20 %</td>
                    </tr>
                    <tr>
                      <th>CMST</th>
                      <td>1.25 %</td>
                      <td>2.20 %</td>
                    </tr>
                    <tr>
                      <th>ATOM</th>
                      <td>1.25 %</td>
                      <td>2.20 %</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="market-list-item" onClick={() => navigate({ pathname: "/market-details", })}>
            <div className="commodo-card">
              <div className="header1">
                <div className="assets-col mr-3">
                  <div className="assets-icon">
                    <SvgIcon name='cmdx-icon' />
                  </div>
                  CMDX
                </div>
                <div className="right-col">
                  #3
                </div>
              </div>
              <div className="header2">
                <div className="upper-label">Available to borrow</div>
                <div className="header2-inner">
                  <div className="assets-col mr-3">
                    <div className="assets-icon">
                      <SvgIcon name='cmdx-icon' />
                    </div>
                    2.7M
                  </div>
                  <div className="assets-col mr-3">
                    <div className="assets-icon">
                      <SvgIcon name='cmst-icon' />
                    </div>
                    654K
                  </div>
                  <div className="assets-col mr-3">
                    <div className="assets-icon">
                      <SvgIcon name='atom-icon' />
                    </div>
                    1.8M
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
                      <th>CMDX</th>
                      <td>1.25 %</td>
                      <td>2.20 %</td>
                    </tr>
                    <tr>
                      <th>CMST</th>
                      <td>1.25 %</td>
                      <td>2.20 %</td>
                    </tr>
                    <tr>
                      <th>ATOM</th>
                      <td>1.25 %</td>
                      <td>2.20 %</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="market-list-item" onClick={() => navigate({ pathname: "/market-details", })}>
            <div className="commodo-card">
              <div className="header1">
                <div className="assets-col mr-3">
                  <div className="assets-icon">
                    <SvgIcon name='cmdx-icon' />
                  </div>
                  CMDX
                </div>
                <div className="right-col">
                  #3
                </div>
              </div>
              <div className="header2">
                <div className="upper-label">Available to borrow</div>
                <div className="header2-inner">
                  <div className="assets-col mr-3">
                    <div className="assets-icon">
                      <SvgIcon name='cmdx-icon' />
                    </div>
                    2.7M
                  </div>
                  <div className="assets-col mr-3">
                    <div className="assets-icon">
                      <SvgIcon name='cmst-icon' />
                    </div>
                    654K
                  </div>
                  <div className="assets-col mr-3">
                    <div className="assets-icon">
                      <SvgIcon name='atom-icon' />
                    </div>
                    1.8M
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
                      <th>CMDX</th>
                      <td>1.25 %</td>
                      <td>2.20 %</td>
                    </tr>
                    <tr>
                      <th>CMST</th>
                      <td>1.25 %</td>
                      <td>2.20 %</td>
                    </tr>
                    <tr>
                      <th>ATOM</th>
                      <td>1.25 %</td>
                      <td>2.20 %</td>
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

export default MarketList;
