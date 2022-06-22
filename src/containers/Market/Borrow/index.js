import {Table} from "antd";
import {SvgIcon} from "../../../components/common";
import {columns} from "./data";

const Borrow = () => {
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