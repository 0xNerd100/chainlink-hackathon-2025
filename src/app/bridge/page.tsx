"use client";
import React, { useState, useEffect } from "react";
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
// import { useBridgeHelper, FeeType, BridgeParams } from './useBridgeHelper'; // Import the hook
import { formatEther, parseEther } from 'viem';
import { useBridgeHelper, FeeType, BridgeParams} from "./bridgeHelper";
import { toast } from "react-toastify";

type TokenSymbol = 'USDL'; // Add more token symbols here as needed

type NetworkConfig = {
  id: number;
  name: string;
  chainId: number;
  tokens: Record<TokenSymbol, string>;
};
// Network configurations
const NETWORKS: Record<string, NetworkConfig> = {
  ethereum: {
    id: 1,
    name: "Ethereum Mainnet",
    chainId: 1,
    tokens: {
      USDL: "0xB7217747Ab3592Dd5Ec3C82640b3ec6dF5D93b9D" // Replace with actual mainnet address
    }
  },
  sepolia: {
    id: 11155111,
    name: "Sepolia",
    chainId: 11155111,
    tokens: {
      USDL: "0xB7217747Ab3592Dd5Ec3C82640b3ec6dF5D93b9D"
    }
  },
  baseSepolia: {
    id: 84532,
    name: "Base Sepolia",
    chainId: 84532,
    tokens: {
      USDL: "0x5087d7819270DF42c46BE3D8ddc1d1B67E7399B2"
    }
  }
};

const TOKENS = [
  {
    symbol: "USDL",
    name: "USD Lender",
    decimals: 18
  }
];

const Bridge = () => {
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { bridgeTokens, estimateFee, bridgeStatus, resetStatus } = useBridgeHelper();
  
  // State management
  const [fromNetwork, setFromNetwork] = useState(NETWORKS.sepolia);
  const [toNetwork, setToNetwork] = useState(NETWORKS.baseSepolia);
  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [estimatedFee, setEstimatedFee] = useState("");
  const [feeType, setFeeType] = useState<FeeType>(FeeType.NATIVE);
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [isFeeEstimating, setIsFeeEstimating] = useState(false);
// Add a helper function to safely get token address
const getTokenAddress = (network: NetworkConfig, tokenSymbol: string): `0x${string}` | undefined => {
  const address = network.tokens[tokenSymbol as TokenSymbol];
  return address as `0x${string}` | undefined;
};
// Then update the useBalance hooks:
const { 
  data: tokenBalance, 
  isLoading: balanceLoading,
  error: balanceError,
  refetch: refetchSourceBalance
} = useBalance({
  address: address,
  token: getTokenAddress(fromNetwork, selectedToken.symbol),
  chainId: fromNetwork.chainId,
  query: {
    enabled: !!address && !!getTokenAddress(fromNetwork, selectedToken.symbol),
    refetchInterval: 10000,
  },
});

const { 
  data: destinationTokenBalance,
  isLoading: destinationBalanceLoading,
  error: destinationBalanceError,
  refetch: refetchDestinationBalance
} = useBalance({
  address: address,
  token: getTokenAddress(toNetwork, selectedToken.symbol),
  chainId: toNetwork.chainId,
  query: {
    enabled: !!address && !!getTokenAddress(toNetwork, selectedToken.symbol),
    refetchInterval: 10000,
  },
});


  // Debug logging
  useEffect(() => {
    console.log("=== SOURCE BALANCE DEBUG ===");
    console.log("tokenBalance", tokenBalance);
    console.log("balanceLoading", balanceLoading);
    console.log("balanceError", balanceError);
    console.log("fromNetwork token address", getTokenAddress(fromNetwork, selectedToken.symbol));
    console.log("fromNetwork chainId", fromNetwork.chainId);
    console.log("address", address);
    
    console.log("=== DESTINATION BALANCE DEBUG ===");
    console.log("destinationTokenBalance", destinationTokenBalance);
    console.log("destinationBalanceLoading", destinationBalanceLoading);
    console.log("destinationBalanceError", destinationBalanceError);
    console.log("toNetwork token address", getTokenAddress(toNetwork, selectedToken.symbol));
    console.log("toNetwork chainId", toNetwork.chainId);
  }, [
    tokenBalance, 
    destinationTokenBalance, 
    balanceLoading, 
    destinationBalanceLoading,
    balanceError,
    destinationBalanceError,
    fromNetwork, 
    toNetwork, 
    selectedToken, 
    address
  ]);

  // Refetch balances when networks change
  useEffect(() => {
    if (address) {
      refetchSourceBalance();
      refetchDestinationBalance();
    }
  }, [fromNetwork, toNetwork, address, refetchSourceBalance, refetchDestinationBalance]);

  // Handle network swap
  const handleNetworkSwap = () => {
    const tempNetwork = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(tempNetwork);
    setSendAmount("");
    setReceiveAmount("");
    setEstimatedFee("");
    resetStatus();
  };

  // Handle amount change (1:1 ratio for now)
  const handleSendAmountChange = (value: string) => {
    setSendAmount(value);
    setReceiveAmount(value); // 1:1 ratio for same token bridging
    setEstimatedFee("");
  };

  // Estimate fee when amount changes
  useEffect(() => {
    const estimateBridgeFee = async () => {
      if (!sendAmount || !address || parseFloat(sendAmount) <= 0) {
        setEstimatedFee("");
        return;
      }

      setIsFeeEstimating(true);
      try {
       const bridgeParams: BridgeParams = {
  tokenAddress: getTokenAddress(fromNetwork, selectedToken.symbol) || '',
  amount: sendAmount,
  destinationChain: fromNetwork.chainId === 11155111 ? 'baseSepolia' : 'sepolia',
  receiverAddress: address,
  feeType: feeType
};

        const fee = await estimateFee(bridgeParams);
        setEstimatedFee(formatEther(fee));
      } catch (error) {
        console.error('Error estimating fee:', error);
        setEstimatedFee("Error");
      } finally {
        setIsFeeEstimating(false);
      }
    };

    const debounceTimer = setTimeout(estimateBridgeFee, 500);
    return () => clearTimeout(debounceTimer);
  }, [sendAmount, address, fromNetwork, selectedToken, feeType, estimateFee]);

  // Handle bridge transaction
  const handleBridge = async () => {
    if (!address) {
      toast.warning("Please connect your wallet");
      return;
    }

    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      toast.warning("Please enter a valid amount");
      return;
    }

    // Check if we need to switch networks
    if (chain?.id !== fromNetwork.chainId) {
      try {
         switchChain({ chainId: fromNetwork.chainId });
      } catch (error) {
        console.error("Failed to switch network:", error);
        toast.warning("Please switch to the correct network");
        return;
      }
    }

    // Reset previous status
    resetStatus();

    try {
    const bridgeParams: BridgeParams = {
  tokenAddress: getTokenAddress(fromNetwork, selectedToken.symbol) || '',
  amount: sendAmount,
  destinationChain: fromNetwork.chainId === 11155111 ? 'baseSepolia' : 'sepolia',
  receiverAddress: address,
  feeType: feeType
};

      const result = await bridgeTokens(bridgeParams);
      
      if (result.messageId) {
        toast.success(`Bridge successful! Message ID: ${result.messageId}`);
      } else {
        toast.success(`Bridge transaction sent! Hash: ${result.hash}`);
      }
    } catch (error) {
      console.error('Bridge failed:', error);
      toast.error(`Bridge failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Helper function to format balance
  const formatBalance = (balance: any) => {
    if (!balance) return "0.0000";
    try {
      return (Number(balance.value) / Math.pow(10, balance.decimals)).toFixed(4);
    } catch (error) {
      console.error("Error formatting balance:", error);
      return "0.0000";
    }
  };

  const NetworkDropdown = ({ 
    isOpen, 
    setIsOpen, 
    selectedNetwork, 
    onSelect, 
    excludeNetwork 
  }: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedNetwork: typeof NETWORKS.sepolia;
    onSelect: (network: typeof NETWORKS.sepolia) => void;
    excludeNetwork?: typeof NETWORKS.sepolia;
  }) => (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="h-[38px] min-w-[115px] inline-flex justify-center items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedNetwork.name} {downIcn}
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
        >
          {[NETWORKS.sepolia, NETWORKS.baseSepolia]
            .filter(network => network.id !== excludeNetwork?.id)
            .map((network) => (
            <li key={network.id}>
              <a 
                onClick={() => {
                  onSelect(network);
                  setIsOpen(false);
                }}
                className="cursor-pointer hover:bg-gray-100"
              >
                {network.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const TokenDropdown = ({ 
    isOpen, 
    setIsOpen, 
    selectedToken, 
    onSelect 
  }: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedToken: typeof TOKENS[0];
    onSelect: (token: typeof TOKENS[0]) => void;
  }) => (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="h-[38px] min-w-[115px] justify-center flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedToken.symbol} {downIcn}
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
        >
          {TOKENS.map((token) => (
            <li key={token.symbol}>
              <a 
                onClick={() => {
                  onSelect(token);
                  setIsOpen(false);
                }}
                className="cursor-pointer hover:bg-gray-100"
              >
                {token.symbol} - {token.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const FeeTypeSelector = () => (
    <div className="flex gap-2 mb-2">
      <button
        onClick={() => setFeeType(FeeType.NATIVE)}
        className={`px-3 py-1 rounded text-xs ${
          feeType === FeeType.NATIVE 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        Native ETH
      </button>
      <button
        onClick={() => setFeeType(FeeType.LINK)}
        className={`px-3 py-1 rounded text-xs ${
          feeType === FeeType.LINK 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        LINK
      </button>
    </div>
  );


  return (
    <>
      <section className="py-10 relative">
        <div className="container">
          <div className="grid gap-4 grid-cols-12">
            <div className="col-span-12">
              <div className="mx-auto max-w-[540px]">
                <div className="box h-full">
                  <div className="inner p-5 h-full">
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-8">
                        {/* Bridge Status */}
                        {bridgeStatus.isLoading && (
                          <div className="p-3 bg-blue-100 rounded-lg text-blue-800">
                            <p className="m-0 text-sm">Processing bridge transaction...</p>
                          </div>
                        )}
                        
                        {bridgeStatus.error && (
                          <div className="p-3 bg-red-100 rounded-lg text-red-800">
                            <p className="m-0 text-sm">Error: {bridgeStatus.error}</p>
                          </div>
                        )}
                        
                        {bridgeStatus.success && (
                          <div className="p-3 bg-green-100 rounded-lg text-green-800">
                            <p className="m-0 text-sm">Bridge successful!</p>
                            {bridgeStatus.messageId && (
                              <p className="m-0 text-xs mt-1">Message ID: {bridgeStatus.messageId}</p>
                            )}
                            {bridgeStatus.txHash && (
                              <p className="m-0 text-xs mt-1">Transaction: {bridgeStatus.txHash}</p>
                            )}
                          </div>
                        )}

                        {/* From Section */}
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <label
                              htmlFor=""
                              className="m-0 text-[#E2E2E2] font-medium"
                            >
                              From
                            </label>
                            <NetworkDropdown
                              isOpen={isFromDropdownOpen}
                              setIsOpen={setIsFromDropdownOpen}
                              selectedNetwork={fromNetwork}
                              onSelect={setFromNetwork}
                              excludeNetwork={toNetwork}
                            />
                          </div>
                          <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
                            <div className="left">
                              <p className="m-0 text-xs">Send</p>
                              <input
                                type="text"
                                placeholder="0.000"
                                value={sendAmount}
                                onChange={(e) => handleSendAmountChange(e.target.value)}
                                className="border-0 p-0 max-w-[200px] text-2xl bg-transparent p-0 outline-0 text-white placeholder:text-white"
                              />
                              {tokenBalance && (
                                <p className="m-0 text-xs text-gray-400 mt-1">
                                  Balance: {(Number(tokenBalance.value) / 1e18).toFixed(4)} {selectedToken.symbol}
                                </p>
                              )}
                            </div>
                            <div className="right">
                              <TokenDropdown
                                isOpen={isTokenDropdownOpen}
                                setIsOpen={setIsTokenDropdownOpen}
                                selectedToken={selectedToken}
                                onSelect={setSelectedToken}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Swap Button */}
                        <div className="">
                          <div className="text-right">
                            <button 
                              className="inline-flex items-center justify-center bg-[rgba(6,7,8,0.3)] rounded-[5px] p-2 hover:bg-[rgba(6,7,8,0.5)] transition-colors"
                              onClick={handleNetworkSwap}
                            >
                              {swapIcn}
                            </button>
                          </div>
                        </div>

                        {/* To Section */}
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <label
                              htmlFor=""
                              className="m-0 text-[#E2E2E2] font-medium"
                            >
                              To
                            </label>
                            <NetworkDropdown
                              isOpen={isToDropdownOpen}
                              setIsOpen={setIsToDropdownOpen}
                              selectedNetwork={toNetwork}
                              onSelect={setToNetwork}
                              excludeNetwork={fromNetwork}
                            />
                          </div>
                          <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
                            <div className="left">
                              <p className="m-0 text-xs">You Receive</p>
                              <input
                                type="text"
                                placeholder="0.000"
                                value={receiveAmount}
                                readOnly
                                className="border-0 p-0 max-w-[200px] text-2xl bg-transparent p-0 outline-0 text-white placeholder:text-white"
                              />
                                {destinationTokenBalance && (
                                <p className="m-0 text-xs text-gray-400 mt-1">
                                  Balance: {(Number(destinationTokenBalance.value) / 1e18).toFixed(4)} {selectedToken.symbol}
                                </p>
                              )}
                            
                            </div>
                            <div className="right">
                              <div className="h-[38px] min-w-[115px] justify-center flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2">
                                {selectedToken.symbol}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bridge Details */}
                      <div className="px-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <p className="m-0 flex items-center gap-2 text-xs">
                              Gas Fee <span className="icn">{infoIcn}</span>
                            </p>
                            <p className="m-0 flex items-center gap-2 text-xs">
                              ~$2.50
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="m-0 flex items-center gap-2 text-xs">
                              Estimated Time{" "}
                              <span className="icn">{infoIcn}</span>
                            </p>
                            <p className="m-0 flex items-center gap-2 text-xs">
                              ~5 minutes
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="m-0 flex items-center gap-2 text-xs">
                              Bridge Rate
                            </p>
                            <p className="m-0 flex items-center gap-2 text-xs">
                              1:1
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bridge Button */}
                      <div className="btnWrpper">
                        <button 
                          className="flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] bg-white text-[#000] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-white hover:bg-transparent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleBridge}
                          disabled={!address || !sendAmount || parseFloat(sendAmount) <= 0}
                        >
                          {!address ? "Connect Wallet" : "Bridge Tokens"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Bridge;

const infoIcn = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 13C10.3138 13 13 10.3138 13 7C13 3.68629 10.3138 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3138 3.68629 13 7 13Z"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.38452 5.38418C5.38452 5.06468 5.47935 4.75237 5.65701 4.48672C5.83467 4.22107 6.0872 4.01403 6.38264 3.89176C6.67808 3.7695 7.00317 3.73751 7.31681 3.79984C7.63045 3.86216 7.91854 4.01601 8.14467 4.24194C8.37079 4.46785 8.52477 4.75568 8.58716 5.06903C8.64955 5.38239 8.61753 5.70718 8.49515 6.00235C8.37278 6.29753 8.16554 6.54981 7.89965 6.72731C7.63376 6.90481 7.32116 6.99955 7.00137 6.99955V8.07647"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.00006 10.1925C6.87261 10.1925 6.76929 10.0892 6.76929 9.96173C6.76929 9.83425 6.87261 9.73096 7.00006 9.73096"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 10.1925C7.12745 10.1925 7.23077 10.0892 7.23077 9.96173C7.23077 9.83425 7.12745 9.73096 7 9.73096"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const downIcn = (
  <svg
    width="15"
    height="8"
    viewBox="0 0 15 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 1.5L7.5 5.5L13 1.56897"
      stroke="#000"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const swapIcn = (
  <svg
    width="21"
    height="18"
    viewBox="0 0 21 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.5 5.33317L5.5 1.6665M5.5 1.6665L1.5 5.33317M5.5 1.6665V16.3332"
      stroke="#F3F5F8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 12.6665L15.5 16.3332M15.5 16.3332L19.5 12.6665M15.5 16.3332V1.6665"
      stroke="#F3F5F8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
