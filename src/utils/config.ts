export const imageURl = "https://greencoin-media.suffescom.dev/";

export type Config = {
  usdt: string;
  btc: string;
  ico: string;
  greenCoin: string;
  staking: string;
  rpc?: string;
  explorer: string;
  USDTDecimal: number;
  btcDecimal: number;
  ethDecimal: number;
  greenDecimal: number;
};

type Configs = Record<number, Config>;

export const config: Configs = {
  1: {
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    btc: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    ico: "0x380264D6404069c14b879D63b2034e4bF86f2d63",
    greenCoin: "0x70bfbBc660E73551FAb37587Dc4db223d50DB0b0",
    staking: "0x",
    rpc: process.env.NEXT_PUBLIC_RPC_URL,
    explorer: "https://etherscan.io",
    USDTDecimal: 6,
    btcDecimal: 8,
    ethDecimal: 18,
    greenDecimal: 18,
  },
  11155111: {
    usdt: "0xe9aC2bc7E649060b97e31f77C1148fB070732Eb7",
    btc: "0xdC3456506A37e17741F3096F74B57A44Fca766eB",
    ico: "0xdda27a14D63d4aDA02287BC556D34D4A1291Ee4E",
    greenCoin: "0x9Ff6eA2eF27488590A77a9661d84d81DD576b3F7",
    staking: "0xdB75347eE8C5fE869c2FDEd87c5ce1be4e5D7F1F",
    rpc: "https://1rpc.io/sepolia",
    explorer: "https://sepolia.etherscan.io",
    USDTDecimal: 6,
    btcDecimal: 8,
    ethDecimal: 18,
    greenDecimal: 18,
  },
};

export const supportedChains = [
  1, //ethereum mainnet
  56, // bsc
  97, //bsc testnet
  11155111, // ethereum sepolia testnet
];

export const chainSwap: Record<number, number> = {
  1: 56,
  56: 1,
  11155111: 97, // sepolia to bsc testnet
  97: 11155111, // bsc testnet to sepolia
};

export const defaultChain = 11155111; // sepolia testnet

export const pepeToken = "0x2F938Da4C59Ec4B5289CB93Dea634247AaCcBa20";
export const pepeTokenDecimal = 18;

export const referals = {
  xyz: "0x55Fa55139FA17a04e632F85BFb38568f4193axxp",
  yzd: "0x55Fa55139FA17a04e632F85BFb38568f4193axyz",
};
