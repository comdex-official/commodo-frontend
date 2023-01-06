import { ActionButton } from "../ActionButton";
import AssetApy from "../AssetApy";
import TotalDeposit from "./TotalDeposit";

export const columns = [
  {
    title: "cPool Id",
    dataIndex: "pool_id",
    key: "pool_id",
    width: 80,
  },
  {
    title: "cPool Asset",
    dataIndex: "asset",
    key: "asset",
    width: 120,
  },
  {
    title: <>CMST</>,
    dataIndex: "bridge_asset",
    key: "bridge_asset",
    width: 120,
  },
  {
    title: <>ATOM</>,
    dataIndex: "bridge_asset2",
    key: "bridge_asset2",
    width: 120,
  },
  {
    title: (
      <>
        Total Deposited
      </>
    ),
    dataIndex: "total_deposited",
    key: "total_deposited",
    width: 130,
    render: (lendPool) => <TotalDeposit lendPool={lendPool} />,
  },
  {
    title: <>cPool Asset APY</>,
    dataIndex: "asset_apy",
    key: "asset_apy",
    width: 150,
    render: (lendPool) => (
      <AssetApy
        poolId={lendPool?.poolId}
        assetId={lendPool?.transitAssetIds?.main}
        parent="lend"
      />
    ),
  },
  {
    title: <>CMST APY</>,
    dataIndex: "bridge_apy",
    key: "bridge_apy",
    width: 140,
    render: (lendPool) => (
      <>
        <AssetApy
          poolId={lendPool?.poolId}
          assetId={lendPool?.transitAssetIds?.first}
          parent="lend"
        />
      </>
    ),
  },
  {
    title: <>ATOM APY</>,
    dataIndex: "bridge_apy2",
    key: "bridge_apy2",
    width: 140,
    render: (lendPool) => (
      <>
        <AssetApy
          poolId={lendPool?.poolId}
          assetId={lendPool?.transitAssetIds?.second}
          parent="lend"
        />
      </>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    align: "right",
    width: 120,
    render: (item) => (
      <ActionButton name="Lend" path={`/lend/${item?.poolId?.toNumber()}`} />
    ),
  },
];
