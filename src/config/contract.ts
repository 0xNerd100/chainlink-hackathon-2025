// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Sepolia testnet
  11155111: {
    USDC: "0xfB42019AA3231Db94881529CDe0D500f2D3d1272", 
    USDL: "0xB7217747Ab3592Dd5Ec3C82640b3ec6dF5D93b9D",
    RWAL: "0x495763E3D020Fb6C2E4c29C12a7d3C5045d99dD5",
    BOOTSTRAP:"0xC78c66D81b885c900A77A97F257B050389Fb1F33", 
  },
  // Base Sepolia
  84532: {
    USDC: "0xEc80135186C9c7E095F09b76F3b526E0e2B32f52", 
    USDL: "0x5087d7819270DF42c46BE3D8ddc1d1B67E7399B2",
    RWAL: "0xd3811A60Abe06060C817Db0D82d7330255Af52D7",
    BOOTSTRAP:"0x20bB8271780547152ABa7ca9DB9fE99360725e9D", 
  },
  // Avalanche Fuji
  43113: {
    USDC: "0x...", // Add Avalanche Fuji USDC address
    USDL: "0x5087d7819270DF42c46BE3D8ddc1d1B67E7399B2",
    RAWL: "0x607ef39311FBe999ae61DfC2656742b5e2FB77dF",
    BOOTSTRAP:"0x...", // Add bootstrap contract address
  },
  // BSC Testnet
  97: {
    USDC: "0x...", // Add BSC Testnet USDC address
    USDL: "0xB7217747Ab3592Dd5Ec3C82640b3ec6dF5D93b9D",
    RAWL: "0x4DF8f1dc4aD0DeECaA0A6CeaC04B26E577D93996",
    BOOTSTRAP: "0x...", // Add bootstrap contract address
  }
  ,
  // bsc mainnetCONTRACT_ADDRESSES
  56: {
    USDC: "0x...", // Add BSC Mainnet USDC address
    USDL: "0x...", // Add BSC Mainnet USDL address
    RWAL: "0x...", // Add BSC Mainnet RWAL address
    BOOTSTRAP: "0x...", // Add bootstrap contract address
  }

};

// Helper function to get contract address for current network
export const getContractAddress = (
  chainId: number,
  contract: 'USDC' | 'USDL' |  'RAWL' | 'BOOTSTRAP'
) => {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.[
    contract as keyof (typeof CONTRACT_ADDRESSES)[keyof typeof CONTRACT_ADDRESSES]
  ];
};
