import DistributionAPY from "../../../components/common/DistributionAPY";
import { ActionButton } from "../ActionButton";
import AssetApy from "../AssetApy";
import AvailableToBorrow from "./AvailableToBorrow";

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
    width: 100,
  },
  {
    title: <>CMST</>,
    dataIndex: "bridge_asset",
    key: "bridge_asset",
    width: 100,
  },
  {
    title: <>ATOM</>,
    dataIndex: "bridge_asset2",
    key: "bridge_asset2",
    width: 100,
  },
  {
    title: (
      <>
        Available to Borrow
      </>
    ),
    dataIndex: "available_to_borrow",
    key: "available_to_borrow",
    width: 130,
    render: (lendPool) => <AvailableToBorrow lendPool={lendPool} />,
  },
  {
    title: <>cPool Asset APY</>,
    dataIndex: "asset_apy",
    key: "asset_apy",
    width: 140,
    render: (lendPool) => (
      <AssetApy
        poolId={lendPool?.poolId}
        assetId={lendPool?.transitAssetIds?.main}
        parent="borrow"
      />
    ),
  },
  {
    title: <>CMST APY</>,
    dataIndex: "bridge_apy",
    key: "bridge_apy",
    width: 120,
    render: (lendPool) => (
      <>
        <AssetApy
          poolId={lendPool?.poolId}
          assetId={lendPool?.transitAssetIds?.first}
          parent="borrow"
        />
        <DistributionAPY value={0} />
      </>
    ),
  },
  {
    title: <>ATOM APY</>,
    dataIndex: "bridge_apy2",
    key: "bridge_apy2",
    width: 120,
    render: (lendPool) => (
      <>
        <AssetApy
          poolId={lendPool?.poolId}
          assetId={lendPool?.transitAssetIds?.second}
          parent="borrow"
        />
        <DistributionAPY value={0} />
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
        name="Borrow"
        path={`/borrow/${item?.poolId?.toNumber()}`}
      />
    ),
  },
];
