import { Button, Col, Input, Row, Select, Tabs, Pagination } from "antd";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setAllProposals, setProposals } from "../../actions/govern";
import GovernOpenProposal from "./openProposal/index";
import GovernPastProposal from "./pastProposal/index";
import { comdex } from "../../config/network";
import { NoDataIcon, SvgIcon } from "../../components/common";
import "./index.less";
import Range from "../../assets/images/range.svg";

const { Option } = Select;

const Govern = ({
  setAllProposals,
  allProposals,
  setProposals,
  proposals,
  getTab,
}) => {
  const [inProgress, setInProgress] = useState(false);
  const [activeKey, setActiveKey] = useState(getTab ? getTab : "1");
  const [pastProposals, setPastProposals] = useState();
  const [activeProposals, setActiveProposals] = useState();
  const [filteredProposal, setFilteredProposal] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const filterAllProposal = (value) => {
    setInProgress(true);
    let oldProposals = proposals?.filter(
      (item) => item?.status !== "PROPOSAL_STATUS_VOTING_PERIOD"
    );
    let allFilteredProposal =
      pastProposals &&
      pastProposals?.filter((item) => {
        if (value === "all") {
          return oldProposals;
        } else {
          return item?.status === value;
        }
      });

    setFilteredProposal(allFilteredProposal);
    setCurrentPage(1);
    setInProgress(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      let nextPage = "";
      let allProposals = [];

      do {
        const url = `${comdex?.rest}/cosmos/gov/v1beta1/proposals${nextPage}`;
        const response = await fetch(url);
        const data = await response.json();

        allProposals = [...allProposals, ...data.proposals];
        nextPage = data.pagination.next_key
          ? `?pagination.key=${data.pagination.next_key}`
          : null;
      } while (nextPage !== null);

      setProposals(allProposals?.reverse());
      setFilteredProposal(allProposals);
      setAllProposals(allProposals?.proposals);
    };

    fetchData();
  }, []);

  // const getCurrentData = () => {
  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //   return filteredProposal?.slice(indexOfFirstItem, indexOfLastItem);
  // };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const onSearchChange = (searchKey) => {
    if (activeKey === "2") {
      let oldProposals = proposals?.filter(
        (item) => item?.status !== "PROPOSAL_STATUS_VOTING_PERIOD"
      );
      oldProposals = oldProposals?.filter(
        (item) =>
          item?.content?.title?.toLowerCase().includes(searchKey) ||
          (item?.proposal_id).includes(searchKey)
      );
      setFilteredProposal(oldProposals);
      setCurrentPage(1);
    } else {
      let ActiveProposals = proposals?.filter(
        (item) => item?.status === "PROPOSAL_STATUS_VOTING_PERIOD"
      );
      ActiveProposals = ActiveProposals?.filter(
        (item) =>
          item?.content?.title?.toLowerCase().includes(searchKey) ||
          (item?.proposal_id).includes(searchKey)
      );

      setFilteredProposal(ActiveProposals);
      setCurrentPage(1);
    }
  };

  const handleTabChange = (key) => {
    let openProposal = proposals?.filter(
      (item) => item?.status === "PROPOSAL_STATUS_VOTING_PERIOD"
    );
    let pastProposal = proposals?.filter(
      (item) => item?.status !== "PROPOSAL_STATUS_VOTING_PERIOD"
    );
    if (key === "1") {
      setCurrentPage(1);
      setFilteredProposal(openProposal);
      setActiveProposals(openProposal);
    } else {
      setCurrentPage(1);
      setFilteredProposal(pastProposal);
      setPastProposals(pastProposal);
    }
    setActiveKey(key);
  };

  const tabItems = [
    {
      key: "1",
      label: "Active Proposals",
    },
    {
      key: "2",
      label: "Past Proposals",
    },
  ];

  useEffect(() => {
    if (proposals) {
      let openProposal = proposals?.filter(
        (item) => item?.status === "PROPOSAL_STATUS_VOTING_PERIOD"
      );
      let pastProposal = proposals?.filter(
        (item) => item?.status !== "PROPOSAL_STATUS_VOTING_PERIOD"
      );

      if (activeKey === "1") {
        setFilteredProposal(openProposal);
        setActiveProposals(openProposal);
      } else {
        setFilteredProposal(pastProposal);
        setPastProposals(pastProposal);
      }
    }
  }, [proposals, activeKey]);

  if (inProgress) {
    return (
      <div className="no_data">
        <Spin />
      </div>
    );
  }

  const handleClick = () => {
    handleTabChange("2");
  };

  return (
    <>
      <div className={`govern_max_width`}>
        <div className="govern_main_container">
          <div className="govern_container">
            <div className="govern_tab_main_container">
              <div className="govern_tab">
                <Row>
                  <Col>
                    <div className="portifolio-tabs">
                      <Tabs
                        className="comdex-tabs"
                        onChange={handleTabChange}
                        activeKey={activeKey}
                        type="card"
                        items={tabItems}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="govern_search ">
                {activeKey === "2" && (
                  <Select
                    defaultValue="Filter"
                    className="select-primary filter-select govern-filter-search"
                    onChange={(e) => filterAllProposal(e)}
                    suffixIcon={<img src={Range} alt="Range" />}
                    notFoundContent={<NoDataIcon />}
                  >
                    <Option value="all" className="govern-select-option">
                      All
                    </Option>
                    <Option value="PROPOSAL_STATUS_DEPOSIT_PERIOD">
                      Pending
                    </Option>
                    <Option value="PROPOSAL_STATUS_PASSED">Passed</Option>
                    <Option value="PROPOSAL_STATUS_FAILED">Failed</Option>
                    <Option value="PROPOSAL_STATUS_REJECTED">Rejected</Option>
                  </Select>
                )}
                <div className="assets-search-section2">
                  <Input
                    placeholder="Search..."
                    onChange={(event) => onSearchChange(event.target.value)}
                    className="asset_search_input"
                    suffix={<SvgIcon name="search" viewbox="0 0 18 18" />}
                  />
                </div>
              </div>
            </div>

            <div className="proposal_box_parent_container">
              {activeKey === "1" ? (
                inProgress ? (
                  <div className="no_data">
                    <Spin />
                  </div>
                ) : filteredProposal?.length > 0 ? (
                  <GovernOpenProposal proposals={filteredProposal} />
                ) : (
                  <div className={"table__empty__data__wrap"}>
                    <div className={"table__empty__data"}>
                      <NoDataIcon />
                    </div>
                  </div>
                )
              ) : inProgress ? (
                <div className="no_data">
                  <Spin />
                </div>
              ) : filteredProposal?.length > 0 ? (
                <GovernPastProposal proposals={filteredProposal} />
              ) : (
                <div className={"table__empty__data__wrap"}>
                  <div className={"table__empty__data"}>
                    <NoDataIcon />
                  </div>
                </div>
              )}

              {/* <div className="pagination">
                <Pagination
                  current={currentPage}
                  total={filteredProposal?.length}
                  pageSize={itemsPerPage}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
Govern.propTypes = {
  lang: PropTypes.string.isRequired,
  setAllProposals: PropTypes.func.isRequired,
  setProposals: PropTypes.func.isRequired,
  allProposals: PropTypes.array,
};

const stateToProps = (state) => {
  return {
    lang: state.language,
    allProposals: state.govern.allProposals,
    getTab: state.govern.getTab,
    proposals: state.govern.proposals,
  };
};

const actionsToProps = {
  setAllProposals,
  setProposals,
};

export default connect(stateToProps, actionsToProps)(Govern);
