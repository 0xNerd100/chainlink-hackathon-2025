// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Sepolia testnet
  11155111: {
    USDC: "0xfB42019AA3231Db94881529CDe0D500f2D3d1272", 
    USDL: "0x8Fad99ADF150373D94e0e19FE0c13FA1aBc3942D",
    RWAL: "0x75C15055f01FB5e845326960daCCAA86e8B13Fa1",
    BOOTSTRAP: "0x4D613Ce41083E00FB0928D13155f01987191416A", 
  },
  // Base Sepolia
  84532: {
    USDC: "0x...", // Add Base Sepolia USDC address
    USDL: "0x5087d7819270DF42c46BE3D8ddc1d1B67E7399B2",
    RWAL: "0xd3811A60Abe06060C817Db0D82d7330255Af52D7",
    BOOTSTRAP: "0x...", // Add bootstrap contract address
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
  // bsc mainnet
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
