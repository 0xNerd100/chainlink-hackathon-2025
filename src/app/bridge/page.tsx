"use client";
import React, { useState, useEffect } from "react";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useBridgeHelper, FeeType, BridgeParams } from "./bridgeHelper";
import { toast } from "react-toastify";

// Updated network configurations to match bridgeHelper
const NETWORKS = {
  sepolia: {
    id: 11155111,
    name: "Sepolia",
    chainId: 11155111,
    key: "sepolia" as const,
  },
  baseSepolia: {
    id: 84532,
    name: "Base Sepolia",
    chainId: 84532,
    key: "baseSepolia" as const,
  }
} as const;

// Define the network type
type NetworkType = (typeof NETWORKS)[keyof typeof NETWORKS];

const Bridge = () => {
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const {
    bridgeTokens,
    estimateFee,
    bridgeStatus,
    resetStatus,
    getAvailableTokens,
    getDestinationToken,
    canBridgeToken,
    TOKEN_METADATA,
    TOKEN_ADDRESSES,
    NETWORK_CONFIG,
  } = useBridgeHelper();

  // State management
  const [fromNetwork, setFromNetwork] = useState<NetworkType>(NETWORKS.sepolia);
  const [toNetwork, setToNetwork] = useState<NetworkType>(NETWORKS.baseSepolia);
  const [availableTokens, setAvailableTokens] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [destinationToken, setDestinationToken] = useState<any>(null);
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [estimatedFee, setEstimatedFee] = useState("");
  const [feeType, setFeeType] = useState<FeeType>(FeeType.NATIVE);
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [isFeeEstimating, setIsFeeEstimating] = useState(false);

  // Get source token balance
  const {
    data: sourceTokenBalance,
    isLoading: sourceBalanceLoading,
    error: sourceBalanceError,
    refetch: refetchSourceBalance,
  } = useBalance({
    address: address,
    token: selectedToken?.address as `0x${string}`,
    chainId: fromNetwork.chainId,
    query: {
      enabled: !!address && !!selectedToken?.address,
      refetchInterval: 10000,
    },
  });

  // Get destination token balance
  const {
    data: destinationTokenBalance,
    isLoading: destinationBalanceLoading,
    error: destinationBalanceError,
    refetch: refetchDestinationBalance,
  } = useBalance({
    address: address,
    token: destinationToken?.address as `0x${string}`,
    chainId: toNetwork.chainId,
    query: {
      enabled: !!address && !!destinationToken?.address,
      refetchInterval: 10000,
    },
  });

  // Load available tokens when network changes
  useEffect(() => {
    console.log("🔄 Loading tokens for network:", fromNetwork.key);

    try {
      const tokens = getAvailableTokens(fromNetwork.key);
      console.log("📋 Available tokens:", tokens);
      setAvailableTokens(tokens);

      // Set first token as default if no token selected or current token not available
      if (
        !selectedToken ||
        !tokens.find((t) => t.symbol === selectedToken.symbol)
      ) {
        console.log("🎯 Setting default token:", tokens[0]);
        setSelectedToken(tokens[0] || null);
      }
    } catch (error) {
      console.error("❌ Error loading tokens:", error);
      setAvailableTokens([]);
    }
  }, [fromNetwork, getAvailableTokens, selectedToken]);

  // Update destination token when source token or networks change
  useEffect(() => {
    if (selectedToken) {
      console.log("🔄 Updating destination token for:", selectedToken.symbol);
      try {
        const destToken = getDestinationToken(
          selectedToken.symbol,
          fromNetwork.key,
          toNetwork.key
        );
        console.log("🎯 Destination token:", destToken);
        setDestinationToken(destToken);

        // Clear amounts if token can't be bridged
        if (!destToken) {
          setSendAmount("");
          setReceiveAmount("");
          setEstimatedFee("");
        }
      } catch (error) {
        console.error("❌ Error getting destination token:", error);
        setDestinationToken(null);
      }
    }
  }, [selectedToken, fromNetwork, toNetwork, getDestinationToken]);

  // Debug logging
  useEffect(() => {
    console.log("=== BRIDGE DEBUG INFO ===");
    console.log("From Network:", fromNetwork);
    console.log("To Network:", toNetwork);
    console.log("Selected Token:", selectedToken);
    console.log("Destination Token:", destinationToken);
    console.log("Available Tokens:", availableTokens);
    console.log("Source Balance:", sourceTokenBalance);
    console.log("Destination Balance:", destinationTokenBalance);
    console.log(
      "Can Bridge:",
      selectedToken
        ? canBridgeToken(selectedToken.symbol, fromNetwork.key, toNetwork.key)
        : false
    );
  }, [
    fromNetwork,
    toNetwork,
    selectedToken,
    destinationToken,
    availableTokens,
    sourceTokenBalance,
    destinationTokenBalance,
    canBridgeToken,
  ]);

  // Refetch balances when networks or tokens change
  useEffect(() => {
    if (address) {
      refetchSourceBalance();
      refetchDestinationBalance();
    }
  }, [
    fromNetwork,
    toNetwork,
    selectedToken,
    destinationToken,
    address,
    refetchSourceBalance,
    refetchDestinationBalance,
  ]);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown")) {
        setIsFromDropdownOpen(false);
        setIsToDropdownOpen(false);
        setIsTokenDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Show toast warning when network doesn't match
  useEffect(() => {
    if (address && chain?.id && chain.id !== fromNetwork.chainId) {
      toast.warning(
        `Please switch to ${fromNetwork.name} network to proceed with the bridge`
      );
    }
  }, [address, chain?.id, fromNetwork.chainId, fromNetwork.name]);

  // Handle network swap
  const handleNetworkSwap = () => {
    console.log("🔄 Swapping networks");
    const tempNetwork = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(tempNetwork);
    setSendAmount("");
    setReceiveAmount("");
    setEstimatedFee("");
    resetStatus();
  };

  // Handle token selection
  const handleTokenSelect = (token: any) => {
    console.log("🎯 Token selected:", token);
    setSelectedToken(token);
    setSendAmount("");
    setReceiveAmount("");
    setEstimatedFee("");
    setIsTokenDropdownOpen(false);
    resetStatus();
  };

  // Handle network selection
  const handleFromNetworkSelect = (network: NetworkType) => {
    console.log("🔄 From network selected:", network);
    setFromNetwork(network);
    setSendAmount("");
    setReceiveAmount("");
    setEstimatedFee("");
    setIsFromDropdownOpen(false);
    resetStatus();
  };

  const handleToNetworkSelect = (network: NetworkType) => {
    console.log("🔄 To network selected:", network);
    setToNetwork(network);
    setSendAmount("");
    setReceiveAmount("");
    setEstimatedFee("");
    setIsToDropdownOpen(false);
    resetStatus();
  };

  // Handle amount change (1:1 ratio for same token bridging)
  const handleSendAmountChange = (value: string) => {
    setSendAmount(value);
    setReceiveAmount(value); // 1:1 ratio for same token bridging
    setEstimatedFee("");
  };

  // Estimate fee when amount changes
  useEffect(() => {
    const estimateBridgeFee = async () => {
      if (
        !sendAmount ||
        !address ||
        !selectedToken ||
        !destinationToken ||
        parseFloat(sendAmount) <= 0 ||
        chain?.id !== fromNetwork.chainId
      ) {
        setEstimatedFee("");
        return;
      }

      setIsFeeEstimating(true);
      try {
        const bridgeParams: BridgeParams = {
          sourceTokenAddress: selectedToken.address,
          sourceTokenSymbol: selectedToken.symbol,
          destinationTokenAddress: destinationToken.address,
          destinationTokenSymbol: destinationToken.symbol,
          amount: sendAmount,
          sourceChain: fromNetwork.key,
          destinationChain: toNetwork.key,
          receiverAddress: address,
          feeType: feeType,
        };

        const fee = await estimateFee(bridgeParams);
        setEstimatedFee(formatEther(fee));
      } catch (error) {
        console.error("Error estimating fee:", error);
        setEstimatedFee("Error");
      } finally {
        setIsFeeEstimating(false);
      }
    };

    const debounceTimer = setTimeout(estimateBridgeFee, 500);
    return () => clearTimeout(debounceTimer);
  }, [
    sendAmount,
    address,
    selectedToken,
    destinationToken,
    fromNetwork,
    toNetwork,
    feeType,
    estimateFee,
    chain?.id,
  ]);

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

    if (!selectedToken || !destinationToken) {
      toast.warning("Please select a valid token");
      return;
    }

    if (!canBridgeToken(selectedToken.symbol, fromNetwork.key, toNetwork.key)) {
      toast.warning(
        `${selectedToken.symbol} cannot be bridged to ${toNetwork.name}`
      );
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
        sourceTokenAddress: selectedToken.address,
        sourceTokenSymbol: selectedToken.symbol,
        destinationTokenAddress: destinationToken.address,
        destinationTokenSymbol: destinationToken.symbol,
        amount: sendAmount,
        sourceChain: fromNetwork.key,
        destinationChain: toNetwork.key,
        receiverAddress: address,
        feeType: feeType,
      };

      const result = await bridgeTokens(bridgeParams);

      if (result.messageId) {
        toast.success(`Bridge successful! Message ID: ${result.messageId}`);
      } else {
        toast.success(`Bridge transaction sent! Hash: ${result.hash}`);
      }
    } catch (error) {
      console.error("Bridge failed:", error);
      toast.error(
        `Bridge failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Helper function to format balance
  const formatBalance = (balance: any) => {
    if (!balance) return "0.0000";
    try {
      return (Number(balance.value) / Math.pow(10, balance.decimals)).toFixed(
        4
      );
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
    excludeNetwork,
  }: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedNetwork: NetworkType;
    onSelect: (network: NetworkType) => void;
    excludeNetwork?: NetworkType;
  }) => (
    <div className="dropdown relative">
      <button
        type="button"
        className="h-[38px] min-w-[115px] inline-flex justify-center items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2 cursor-pointer hover:bg-[#e8eaed] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Network dropdown clicked, current state:", isOpen);
          setIsOpen(!isOpen);
        }}
      >
        {selectedNetwork.name} {downIcn}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 min-w-[200px]">
          <div className="py-1">
            {Object.values(NETWORKS)
              .filter((network) => network.id !== excludeNetwork?.id)
              .map((network) => (
                <div key={network.id}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Network option clicked:", network.name);
                      onSelect(network);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer focus:outline-none focus:bg-gray-100"
                  >
                    {network.name}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  const TokenDropdown = ({
    isOpen,
    setIsOpen,
    selectedToken,
    onSelect,
  }: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedToken: any;
    onSelect: (token: any) => void;
  }) => (
    <div className="dropdown relative">
      <button
        type="button"
        className="h-[38px] min-w-[115px] justify-center flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2 cursor-pointer hover:bg-[#e8eaed] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("🖱️ Token dropdown clicked, current state:", isOpen);
          console.log("📋 Available tokens:", availableTokens);
          setIsOpen(!isOpen);
        }}
      >
        {selectedToken ? (
          <>
            <span>{selectedToken.icon}</span>
            <span>{selectedToken.symbol}</span>
          </>
        ) : (
          <span>Select Token</span>
        )}
        {downIcn}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 min-w-[200px]">
          <div className="py-1">
            {availableTokens.length > 0 ? (
              availableTokens.map((token) => {
                const canBridge = canBridgeToken(
                  token.symbol,
                  fromNetwork.key,
                  toNetwork.key
                );
                return (
                  <div key={token.symbol}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("🎯 Token clicked:", token);
                        onSelect(token);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer focus:outline-none focus:bg-gray-100 ${
                        !canBridge ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{token.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {token.symbol}
                          </div>
                          <div className="text-xs text-gray-500">
                            {token.name}
                          </div>
                          {!canBridge && (
                            <div className="text-xs text-red-500">
                              Not bridgeable
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No tokens available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const FeeTypeSelector = () => (
    <div className="flex gap-2 mb-4">
      <span className="text-sm text-gray-400">Fee Payment:</span>
      <button
        type="button"
        onClick={() => setFeeType(FeeType.NATIVE)}
        className={`px-3 py-1 rounded text-xs ${
          feeType === FeeType.NATIVE
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Native ETH
      </button>
      <button
        type="button"
        onClick={() => setFeeType(FeeType.LINK)}
        className={`px-3 py-1 rounded text-xs ${
          feeType === FeeType.LINK
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        LINK
      </button>
    </div>
  );

  // Check if bridging is possible
  const isBridgingPossible =
    selectedToken &&
    destinationToken &&
    canBridgeToken(selectedToken.symbol, fromNetwork.key, toNetwork.key);

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
                            <p className="m-0 text-sm">
                              Processing bridge transaction...
                            </p>
                          </div>
                        )}

                        {bridgeStatus.success && (
                          <div className="p-3 bg-green-100 rounded-lg text-green-800">
                            <p className="m-0 text-sm">Bridge successful!</p>
                            {bridgeStatus.messageId && (
                              <p className="m-0 text-xs mt-1">
                                Message ID: {bridgeStatus.messageId}
                              </p>
                            )}
                            {bridgeStatus.txHash && (
                              <p className="m-0 text-xs mt-1">
                                Transaction: {bridgeStatus.txHash}
                              </p>
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
                              onSelect={handleFromNetworkSelect}
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
                                onChange={(e) =>
                                  handleSendAmountChange(e.target.value)
                                }
                                className="border-0 p-0 max-w-[200px] text-2xl bg-transparent p-0 outline-0 text-white placeholder:text-white"
                              />
                              {sourceTokenBalance && (
                                <p className="m-0 text-xs text-gray-400 mt-1">
                                  Balance: {formatBalance(sourceTokenBalance)}{" "}
                                  {selectedToken?.symbol}
                                </p>
                              )}
                            </div>
                            <div className="right">
                              <TokenDropdown
                                isOpen={isTokenDropdownOpen}
                                setIsOpen={setIsTokenDropdownOpen}
                                selectedToken={selectedToken}
                                onSelect={handleTokenSelect}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Swap Button */}
                        <div className="">
                          <div className="text-right">
                            <button
                              type="button"
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
                              onSelect={handleToNetworkSelect}
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
                                  Balance:{" "}
                                  {formatBalance(destinationTokenBalance)}{" "}
                                  {destinationToken?.symbol}
                                </p>
                              )}
                            </div>
                            <div className="right">
                              <div className="h-[38px] min-w-[115px] justify-center flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2">
                                {destinationToken ? (
                                  <>
                                    <span>{destinationToken.icon}</span>
                                    <span>{destinationToken.symbol}</span>
                                  </>
                                ) : (
                                  <span>-</span>
                                )}
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
                              Bridge Fee <span className="icn">{infoIcn}</span>
                            </p>
                            <p className="m-0 flex items-center gap-2 text-xs">
                              {chain?.id !== fromNetwork.chainId ? (
                                <span>Switch network to estimate</span>
                              ) : isFeeEstimating ? (
                                <span>Estimating...</span>
                              ) : estimatedFee ? (
                                <span>
                                  {Number(estimatedFee).toFixed(6)}{" "}
                                  {feeType === FeeType.NATIVE ? "ETH" : "LINK"}
                                </span>
                              ) : (
                                <span>-</span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="m-0 flex items-center gap-2 text-xs">
                              Estimated Time{" "}
                              <span className="icn">{infoIcn}</span>
                            </p>
                            <p className="m-0 flex items-center gap-2 text-xs">
                              ~5-10 minutes
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
                          type="button"
                          className="flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] bg-white text-[#000] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-white hover:bg-transparent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleBridge}
                          disabled={
                            !address ||
                            !sendAmount ||
                            parseFloat(sendAmount) <= 0 ||
                            !isBridgingPossible ||
                            bridgeStatus.isLoading ||
                            chain?.id !== fromNetwork.chainId
                          }
                        >
                          {!address
                            ? "Connect Wallet"
                            : chain?.id !== fromNetwork.chainId
                            ? `Switch to ${fromNetwork.name}`
                            : !isBridgingPossible
                            ? "Token Not Bridgeable"
                            : bridgeStatus.isLoading
                            ? "Processing..."
                            : "Bridge Tokens"}
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
