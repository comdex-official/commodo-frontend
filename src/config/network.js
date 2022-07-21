export const comdex = {
  chainId: process.env.REACT_APP_CHAIN_ID,
  chainName: process.env.REACT_APP_CHAIN_NAME,
  rpc: process.env.REACT_APP_RPC,
  rest: process.env.REACT_APP_REST,
  explorerUrlToTx: process.env.REACT_APP_EXPLORER_URL_TO_TX,
  coinDenom: "CMDX",
  coinMinimalDenom: "ucmdx",
  coinDecimals: 6,
  prefix: "comdex",
  coinType: 118,
};

export const ibcDenoms = {
  uatom: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
  uxprt: "ibc/F9DEC4F5FFE69B7B9A881D394A30D11DDE2C1FD1FF3941D7F9EBD7CF208BD61A",
  uosmo: "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B",
};

export const cmst = {
  coinDenom: "CMST",
  coinMinimalDenom: "ucmst",
  coinDecimals: 6,
};

export const harbor = {
  coinDenom: "HARBOR",
  coinMinimalDenom: "uharbor",
  coinDecimals: 6,
};
