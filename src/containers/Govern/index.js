import * as PropTypes from "prop-types";
import { Col, Row, SvgIcon } from "../../components/common";
import { connect } from "react-redux";
import { Button, List, Select, Progress, message, Spin } from "antd";
import "./index.less";
import { useNavigate } from "react-router";
import { fetchRestProposals } from "../../services/govern/query";
import { useEffect, useState } from "react";
import NoData from "../../components/NoData";
import {formatTime, getDuration} from "../../utils/date";

const { Option } = Select;

const Govern = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [allProposals, setAllProposals] = useState();

  const data = [
    {
      title: "Total Staked",
      counts: "312.45",
    },
    {
      title: "Total Proposals",
      counts: allProposals?.length || 0,
    },
    {
      title: "Average Participation",
      counts: "50.12%",
    },
  ];
  
  useEffect(() => {
    fetchAllProposals();
  }, []);

  const fetchAllProposals = () => {
    setInProgress(true);
    fetchRestProposals((error, result) => {
      setInProgress(false);
      if (error) {
        message.error(error);
        return;
      }

      setProposals(result?.proposals?.reverse());
      setAllProposals(result?.proposals);
    });
  };

  const filterAllProposal = (value) => {
    let allFilteredProposal =
      allProposals &&
      allProposals?.filter((item) => {
        if (value === "all") {
          return allProposals;
        }
        return item.status === value;
      });
    setProposals(allFilteredProposal);
  };

  return (
    <div className="app-content-wrapper">
      {inProgress ? (
        <div className="loader">
          <Spin />
        </div>
      ) : (
        <>
          <Row>
            <Col>
              <div className="commodo-card myhome-upper d-block">
                <div className="myhome-upper-left w-100">
                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 2,
                      md: 3,
                      lg: 3,
                      xl: 3,
                      xxl: 3,
                    }}
                    dataSource={data}
                    renderItem={(item) => (
                      <List.Item>
                        <div>
                          <p>{item.title}</p>
                          <h3>{item.counts}</h3>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <div className="commodo-card govern-card">
                <div className="governcard-head">
                  <a
                    aria-label="Twitter"
                    target="_blank"
                    rel="noreferrer"
                    href="https://forum.comdex.one"
                  >
                    <Button type="primary" className="btn-filled">
                      Forum
                    </Button>
                  </a>
                  <Select
                    defaultValue="Filter"
                    className="select-primary ml-2"
                    onChange={(e) => filterAllProposal(e)}
                    suffixIcon={
                      <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                    }
                    style={{ width: 120 }}
                  >
                    <Option value="all" className="govern-select-option">
                      All
                    </Option>
                    <Option value="PROPOSAL_STATUS_VOTING_PERIOD">Open</Option>
                    <Option value="PROPOSAL_STATUS_DEPOSIT_PERIOD">
                      Pending
                    </Option>
                    <Option value="PROPOSAL_STATUS_PASSED">Passed</Option>
                    <Option value="PROPOSAL_STATUS_FAILED">Failed</Option>
                    <Option value="PROPOSAL_STATUS_REJECTED">Rejected</Option>
                  </Select>
                </div>
                <div className="govern-card-content">
                  {proposals?.length > 0 ? (
                    proposals?.map((item) => {
                      return (
                        <div
                          className="governlist-row"
                          onClick={() =>
                            navigate(`/govern-details/${item?.proposal_id}`)
                          }
                        >
                          <div className="left-section">
                            <h3>#{item?.proposal_id}</h3>
                            <h3>{item?.content?.title}</h3>
                            <p>{item?.content?.description} </p>
                          </div>
                          <div className="right-section">
                            <Row>
                              <Col sm="6">
                                <label>Vote Starts :</label>
                                <p>
                                  {formatTime(item?.voting_start_time) ||
                                    "--/--/--"}
                                </p>
                              </Col>
                              <Col sm="6">
                                <label>Voting Ends :</label>
                                <p>
                                  {formatTime(item?.voting_end_time) ||
                                    "--/--/--"}
                                </p>
                              </Col>
                              <Col sm="6">
                                <label>Duration : </label>
                                <p>
                                  {getDuration(
                                    item?.voting_end_time,
                                    item?.voting_start_time
                                  ) || 0}{" "}
                                  Days
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

Govern.propTypes = {
  lang: PropTypes.string.isRequired,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
  };
};

const actionsToProps = {};

export default connect(stateToProps, actionsToProps)(Govern);
