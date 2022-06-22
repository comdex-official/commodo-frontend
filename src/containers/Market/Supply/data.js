import { ActionButton } from "../ActionButton";

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
        Total <br /> Deposited
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
    width: 110,
    render: (asset_apy) => (
      <>
        <div>{asset_apy}%</div>
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
    width: 120,
    render: (bridge_apy) => (
      <>
        <div>{bridge_apy}%</div>
      </>
    ),
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
    render: (bridge_apy) => (
      <>
        <div>{bridge_apy}%</div>
      </>
    ),
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    align: "right",
    width: 120,
    render: (item) => (
      <ActionButton
        name="Details"
        path={`/supply-details/${item?.poolId?.toNumber()}`}
      />
    ),
  },
];
