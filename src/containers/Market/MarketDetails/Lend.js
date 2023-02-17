import { Button, Select, Slider, List } from "antd";
import { SvgIcon, NoDataIcon, Row, Col, TooltipIcon } from "../../../components/common";
import DistributionAPY from "../../../components/common/DistributionAPY";
import CustomInput from "../../../components/CustomInput";

const marks = {
    0: "0%",
    50: '50%',
    100: "100%",
};

let data = [
    {
        title: "Lent",
        counts: `$00`,
        tooltipText: "Total funds Lent",
    },
    {
        title: "Available",
        counts: `$100`,
        tooltipText: "Total funds Available",
    },
    {
        title: "Utilization",
        counts: "20%",
        tooltipText: "Asset Utilization",
    },
    {
        title: "Lend APY",
        counts: (
            <>
                10%
            </>
        ),
        tooltipText: "Lend APY of Asset",
    },
];

const Lend = () => {
    return (
        <>
            <div className="details-wrapper market-details-wrapper">
                <div className="details-left commodo-card commodo-borrow-page">
                    <div className="deposit-head">
                        <div className="deposit-head-left">
                            <div className="assets-col mr-3">
                                <div className="assets-icon">
                                    <SvgIcon name='cmdx-icon' />
                                </div>
                                CMDX
                            </div>
                            <div className="assets-col mr-3">
                                <div className="assets-icon">
                                    <SvgIcon name='cmst-icon' />
                                </div>
                                CMST
                            </div>
                            <div className="assets-col mr-3">
                                <div className="assets-icon">
                                    <SvgIcon name='atom-icon' />
                                </div>
                                ATOM
                            </div>
                        </div>
                        <div className="deposit-poolId">#20</div>
                    </div>
                    <div className="assets-select-card mb-3">
                        <div className="assets-left">
                            <label className="left-label">Lend <TooltipIcon /></label>
                            <div className="assets-select-wrapper">
                                <Select
                                    className="assets-select"
                                    popupClassName="asset-select-dropdown"
                                    placeholder={
                                        <div className="select-placeholder">
                                            <div className="circle-icon">
                                                <div className="circle-icon-inner" />
                                            </div>
                                            Select
                                        </div>
                                    }
                                    defaultActiveFirstOption={true}
                                    suffixIcon={
                                        <SvgIcon name="arrow-down" viewbox="0 0 19.244 10.483" />
                                    }
                                    notFoundContent={<NoDataIcon />}
                                >
                                    <Option
                                        key='1'
                                        value='1'
                                    >
                                        <div className="select-inner">
                                            <div className="svg-icon">
                                                <div className="svg-icon-inner">
                                                    <SvgIcon name='cmdx-icon' />
                                                </div>
                                            </div>
                                            <div className="name">
                                                CMDX
                                                <label>(cPool-CMDX)</label>
                                            </div>
                                        </div>
                                    </Option>
                                </Select>
                            </div>
                        </div>
                        <div className="assets-right">
                            <div className="label-right">
                                Available
                                <span className="ml-1">
                                    5222
                                </span>
                                <div className="max-half">
                                    <Button className="active">
                                        Max
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <div className="input-select">
                                    <CustomInput
                                        value="1011"
                                    />
                                </div>
                                <small>
                                    $500
                                </small>
                            </div>
                        </div>
                    </div>
                    <Row>
                        <Col sm="12" className="mx-auto card-bottom-details">
                            <Row className="mt-2">
                                <Col>
                                    <label>
                                        Max LTV
                                        <TooltipIcon text="The maximum borrowing power of the collateral" />
                                    </label>
                                </Col>
                                <Col className="text-right">
                                    10%
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col sm="12">
                                    <Slider
                                        marks={marks}
                                        defaultValue={37}
                                        tooltip={{ open: false }}
                                        className="commodo-slider market-slider-1"
                                    />
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>
                                    <label>Current LTV</label>
                                </Col>
                                <Col className="text-right">
                                    20%
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className="assets-form-btn">
                        <Button type="primary" className="btn-filled details-btn">
                            Lend
                        </Button>
                    </div>
                </div>
                <div className="details-right">
                    <div className="commodo-card">
                        <div className="card-head">
                            <div className="head-left">
                                <div className="assets-col">
                                    <div className="assets-icon">
                                        <SvgIcon name="cmdx-icon" />
                                    </div>
                                    CMDX
                                </div>
                            </div>
                            <div className="head-right">
                                <span>Oracle Price</span> : $200
                            </div>
                        </div>
                        <List
                            grid={{
                                gutter: 16,
                            }}
                            dataSource={data}
                            renderItem={(item) => (
                                <List.Item>
                                    <div>
                                        <p>
                                            {item.title} <TooltipIcon text={item.tooltipText} />
                                        </p>
                                        <h3>{item.counts}</h3>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                    <div className="commodo-card">
                        <div className="card-head">
                            <div className="head-left">
                                <div className="assets-col">
                                    <div className="assets-icon">
                                        <SvgIcon name="cmst-icon" />
                                    </div>
                                    CMST
                                </div>
                            </div>
                            <div className="head-right">
                                <span>Oracle Price</span> : $200
                            </div>
                        </div>
                        <List
                            grid={{
                                gutter: 16,
                            }}
                            dataSource={data}
                            renderItem={(item) => (
                                <List.Item>
                                    <div>
                                        <p>
                                            {item.title} <TooltipIcon text={item.tooltipText} />
                                        </p>
                                        <h3>{item.counts}</h3>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                    <div className="commodo-card">
                        <div className="card-head">
                            <div className="head-left">
                                <div className="assets-col">
                                    <div className="assets-icon">
                                        <SvgIcon name="atom-icon" />
                                    </div>
                                    ATOM
                                </div>
                            </div>
                            <div className="head-right">
                                <span>Oracle Price</span> : $200
                            </div>
                        </div>
                        <List
                            grid={{
                                gutter: 16,
                            }}
                            dataSource={data}
                            renderItem={(item) => (
                                <List.Item>
                                    <div>
                                        <p>
                                            {item.title} <TooltipIcon text={item.tooltipText} />
                                        </p>
                                        <h3>{item.counts}</h3>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};


export default Lend;