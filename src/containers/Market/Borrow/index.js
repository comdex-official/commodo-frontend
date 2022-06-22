import {Button, Table} from "antd";
import {SvgIcon} from "../../../components/common";
import {Link} from "react-router-dom";

const Borrow = () => {
    const columns = [
        {
            title: "Asset",
            dataIndex: "asset",
            key: "asset",
            width: 120,
        },
        {
            title: (
                <>
                    Bridge <br /> Asset 1
                </>
            ),
            dataIndex: "bridge_asset",
            key: "bridge_asset",
            width: 120,
        },
        {
            title: (
                <>
                    Bridge <br /> Asset 2
                </>
            ),
            dataIndex: "bridge_asset2",
            key: "bridge_asset2",
            width: 120,
        },
        {
            title: (
                <>
                    Available to <br /> Borrow
                </>
            ),
            dataIndex: "total_deposited",
            key: "total_deposited",
            width: 130,
            render: (total_deposited) => <>$ {total_deposited}</>,
        },
        {
            title: (
                <>
                    Asset <br /> APY
                </>
            ),
            dataIndex: "asset_apy",
            key: "asset_apy",
            width: 100,
            render: (asset_apy) => (
                <>
                    <div>{asset_apy}% </div>
                </>
            ),
        },
        {
            title: (
                <>
                    Bridge Asset 1 <br /> APY
                </>
            ),
            dataIndex: "bridge_apy",
            key: "bridge_apy",
            width: 140,
        },
        {
            title: (
                <>
                    Bridge Asset 2 <br /> APY
                </>
            ),
            dataIndex: "bridge_apy2",
            key: "bridge_apy2",
            width: 110,
        },
        {
            title: "",
            dataIndex: "action",
            key: "action",
            align: "right",
            width: 120,
            render: () => (
                <>
                    <Link to="/borrow-details">
                        <Button type="primary" size="small">
                            Details
                        </Button>
                    </Link>
                </>
            ),
        },
    ];

    const tableData = [
        {
            key: 1,
            asset: (
                <>
                    <div className="assets-with-icon">
                        <div className="assets-icon">
                            <SvgIcon name="cmdx-icon" />
                        </div>
                        CDMX
                    </div>
                </>
            ),
            bridge_asset: (
                <>
                    <div className="assets-with-icon">
                        <div className="assets-icon">
                            <SvgIcon name="cmst-icon" />
                        </div>
                        CMST
                    </div>
                </>
            ),
            bridge_asset2: (
                <>
                    <div className="assets-with-icon">
                        <div className="assets-icon">
                            <SvgIcon name="atom-icon" />
                        </div>
                        Atom
                    </div>
                </>
            ),
            total_deposited: "8,256,335",
            asset_apy: "12.76",
            bridge_apy: (
                <div className="d-flex align-items-center">
                    12.33%{" "}
                    <div className="apy-percents">
                        +6.18% <SvgIcon name="cmdx-icon" />
                    </div>
                </div>
            ),
            bridge_apy2: "13.33%",
        },
        {
            key: 2,
            asset: (
                <>
                    <div className="assets-with-icon">
                        <div className="assets-icon">
                            <SvgIcon name="osmosis-icon" />
                        </div>
                        OSMO
                    </div>
                </>
            ),
            bridge_asset: (
                <>
                    <div className="assets-with-icon">
                        <div className="assets-icon">
                            <SvgIcon name="cmst-icon" />
                        </div>
                        CMST
                    </div>
                </>
            ),
            bridge_asset2: (
                <>
                    <div className="assets-with-icon">
                        <div className="assets-icon">
                            <SvgIcon name="atom-icon" />
                        </div>
                        Atom
                    </div>
                </>
            ),
            total_deposited: "4,358,675",
            asset_apy: "11.56",
            bridge_apy: "12.33%",
            bridge_apy2: (
                <div className="d-flex align-items-center">
                    13.33%{" "}
                    <div className="apy-percents">
                        +6.18% <SvgIcon name="cmdx-icon" />
                    </div>
                </div>
            ),
        },
    ];

    return(
        <div className="commodo-card bg-none">
            <div className="card-header">Assets to BORROW</div>
            <div className="card-content">
                <Table
                    className="custom-table market-table2"
                    dataSource={tableData}
                    columns={columns}
                    pagination={false}
                    scroll={{ x: "100%", y: "30vh" }}
                />
            </div>
        </div>
    )
}

export default Borrow;