import {Link} from "react-router-dom";
import {Button} from "antd";

export const columns = [
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
