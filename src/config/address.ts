export const TOKEN_ADDRESSES = {
  // Ethereum Mainnet (1)
  1: {
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
    USDC: '0xA0b86a33E6441b8C4505B6B8C0C4C2c7C4C4C4C4' as `0x${string}`,
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`,
  },
  // BSC Mainnet (56)
  56: {
    USDT: '0x55d398326f99059fF775485246999027B3197955' as `0x${string}`,
    USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d' as `0x${string}`,
    BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' as `0x${string}`,
  },
  // Ethereum Sepolia Testnet (11155111)
  11155111: {
    // Example testnet USDT (you'll need to replace with actual testnet addresses)
    USDT: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06' as `0x${string}`,
    // Add your USDN token address here
    USDL : "0xB7217747Ab3592Dd5Ec3C82640b3ec6dF5D93b9D" as `0x${string}`,
  },
  // BSC Testnet (97)
  97: {
    USDT: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684' as `0x${string}`,
    USDC: '0x64544969ed7EBf5f083679233325356EbE738930' as `0x${string}`,
  },
} as const;
