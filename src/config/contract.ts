// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Sepolia testnet
  11155111: {
    USDC: "0xfB42019AA3231Db94881529CDe0D500f2D3d1272", // Update with actual USDC address
    USDL: "0xB7217747Ab3592Dd5Ec3C82640b3ec6dF5D93b9D",
    RWAL: "0x495763E3D020Fb6C2E4c29C12a7d3C5045d99dD5",
    BOOTSTRAP: "0x4D613Ce41083E00FB0928D13155f01987191416A", // Add bootstrap contract address
  },
  // Base Sepolia
  84532: {
    USDC: "0x...", // Add Base Sepolia USDC address
    USDL: "0x5087d7819270DF42c46BE3D8ddc1d1B67E7399B2",
    RWAL: "0xd3811A60Abe06060C817Db0D82d7330255Af52D7",
    BOOTSTRAP: "0x...", // Add bootstrap contract address
  },
  // Add other networks as needed
};

// Helper function to get contract address for current network
export const getContractAddress = (
  chainId: number,
  contract: keyof (typeof CONTRACT_ADDRESSES)[11155111]
) => {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.[
    contract
  ];
};
