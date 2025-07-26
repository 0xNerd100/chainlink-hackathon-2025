import { useAppKit } from "@reown/appkit/react";
import React, { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { getContractAddress } from "../../config/contract";
import { parseUnits, formatUnits } from "viem";
import { ERC20_ABI, ROUTER_ABI } from "@/abi";
import { toast } from "react-toastify";

const SwapCard = () => {
  const { open } = useAppKit();
  const { address } = useAccount();
  const chainId = useChainId();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState("USDL");
  const [toToken, setToToken] = useState("RWAL");
  const [isApproving, setIsApproving] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [transactionStep, setTransactionStep] = useState("");
  const [slippage, setSlippage] = useState(5);


  // Get contract addresses for current network
  const USDL_ADDRESS = getContractAddress(chainId, "USDL");
  const RWAL_ADDRESS = getContractAddress(chainId, "RWAL");
  const SWAP_ROUTER = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";
  const poolFee = 3000; // 0.3% 
  // Get token addresses based on selection
  const getTokenAddress = (token) => {
    return token === "USDL" ? USDL_ADDRESS : RWAL_ADDRESS;
  };

  // Contract write hooks
  const {
    writeContract: writeApprove,
    data: approveHash,
    error: approveError,
  } = useWriteContract();
  const {
    writeContract: writeSwap,
    data: swapHash,

    error: swapError,
  } = useWriteContract();

  // Transaction receipt hooks
  const {
    isLoading: isApproveLoading,
    isSuccess: isApproveSuccess,
    error: approveReceiptError,
  } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const {
    isLoading: isSwapLoading,
    isSuccess: isSwapSuccess,
    error: swapReceiptError,
    data: swapReceipt,
  } = useWaitForTransactionReceipt({
    hash: swapHash,
  });

  // Check if tokens exist and have proper decimals
  const { data: fromTokenDecimals } = useReadContract({
    address: getTokenAddress(fromToken),
    abi: ERC20_ABI,
    functionName: "decimals",
    query: { enabled: !!getTokenAddress(fromToken) },
  });

  const { data: toTokenDecimals } = useReadContract({
    address: getTokenAddress(toToken),
    abi: ERC20_ABI,
    functionName: "decimals",
    query: { enabled: !!getTokenAddress(toToken) },
  });

  // Enhanced balance fetching with forced refresh
  const {
    data: fromTokenBalance,
    isLoading: fromTokenBalanceLoading,
    error: fromTokenBalanceError,
    refetch: refetchFromTokenBalance,
  } = useBalance({
    address: address,
    token: getTokenAddress(fromToken),
    query: {
      enabled: !!address && !!getTokenAddress(fromToken),
      refetchInterval: 5000, // Reduced interval for faster updates
    },
  });

  const {
    data: toTokenBalance,
    isLoading: toTokenBalanceLoading,
    error: toTokenBalanceError,
    refetch: refetchToTokenBalance,
  } = useBalance({
    address: address,
    token: getTokenAddress(toToken),
    query: {
      enabled: !!address && !!getTokenAddress(toToken),
      refetchInterval: 5000,
    },
  });
 const connect = async () => {
    await open();
  };

  // Helper function to format balance with proper decimals
  const formatBalance = (balance) => {
    if (!balance) return "0.0000";
    try {
      return (Number(balance.value) / Math.pow(10, balance.decimals)).toFixed(
        4
      );;
    } catch (error) {
      console.error("Error formatting balance:", error);
      return "0.0000";
    }
  };

  const handleInputMaxBalance = () => {
    if (!fromTokenBalance) {
      toast.error("Unable to fetch balance");
      return;
    }

    try {
      const maxBalance = formatUnits(fromTokenBalance.value, fromTokenBalance.decimals);
      setFromAmount(parseFloat(maxBalance).toFixed(6));
      setToAmount(parseFloat(maxBalance).toFixed(6));
    } catch (error) {
      console.error("Error setting max balance:", error);
      toast.error("Error setting max balance");
    }
  };



 const handleFromAmountChange = (value) => {
  setFromAmount(value);
  // For now, keeping 1:1 ratio, but you could add price calculation logic here
  setToAmount(value);
};

const switchTokens = () => {
  // Store current values
  const tempFromToken = fromToken;
  const tempFromAmount = fromAmount;
  const tempToAmount = getAmountOutMinimum();
  
  // Switch tokens
  setFromToken(toToken);
  setToToken(tempFromToken);
  
  // Switch amounts - the current "to" amount becomes the new "from" amount
  // and the current "from" amount becomes the new "to" amount
  setFromAmount(tempToAmount);
  setToAmount(tempToAmount);
};


  const getAmountOutMinimum = () => {
    if (!toAmount || parseFloat(toAmount) <= 0) return "";
    const amountOut = parseFloat(toAmount) * (1 - slippage / 100);
    return amountOut.toFixed(6);
  };

  const validateSwapAmount = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      return "Please enter a valid amount";
    }

    if (!fromTokenBalance) {
      return "Unable to fetch balance";
    }

    const amountInWei = parseUnits(fromAmount, fromTokenBalance.decimals);
    if (amountInWei > fromTokenBalance.value) {
      return `Insufficient ${fromToken} balance`;
    }

    // Check if tokens exist
    if (!getTokenAddress(fromToken) || !getTokenAddress(toToken)) {
      return "Invalid token addresses";
    }

    return null;
  };

  const parseErrorMessage = (error) => {
    if (!error) return "Unknown error occurred";

    if (error.message) {
      if (error.message.includes("User rejected") || error.message.includes("user rejected")) {
        return "Transaction was rejected by user";
      }
      if (error.message.includes("insufficient funds")) {
        return "Insufficient funds for transaction";
      }
      if (error.message.includes("gas")) {
        return "Gas estimation failed. Please try again";
      }
      if (error.message.includes("network")) {
        return "Network error. Please check your connection";
      }
      // Add more specific error handling for Uniswap
      if (error.message.includes("STF")) {
        return "Swap failed - insufficient liquidity or invalid pool";
      }
      if (error.message.includes("Too little received")) {
        return "Swap failed - price impact too high, try increasing slippage";
      }
      return error.message;
    }

    return "Transaction failed. Please try again";
  };

  const handleSwap = async () => {
    const validationError = validateSwapAmount();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Debug logging
    console.log("Starting swap:", {
      fromToken,
      toToken,
      fromAmount,
      fromTokenAddress: getTokenAddress(fromToken),
      toTokenAddress: getTokenAddress(toToken),
      fromTokenDecimals,
      toTokenDecimals,
    });

    try {
      setTransactionStep("approving");
      setIsApproving(true);

      const amountInWei = parseUnits(fromAmount, fromTokenBalance.decimals);
      console.log("Amount in wei:", amountInWei.toString());

      writeApprove({
        address: getTokenAddress(fromToken),
        abi: ERC20_ABI,
        functionName: "approve",
        args: [SWAP_ROUTER, amountInWei],
      });
    } catch (error) {
      console.error("Approval failed:", error);
      const errorMessage = parseErrorMessage(error);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isApproveSuccess && transactionStep === "approving") {
      handleSwapExecution();
    }
  }, [isApproveSuccess, transactionStep]);

  useEffect(() => {
    if (approveError && transactionStep === "approving") {
      const errorMessage = parseErrorMessage(approveError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [approveError, transactionStep]);

  useEffect(() => {
    if (swapError && transactionStep === "swapping") {
      const errorMessage = parseErrorMessage(swapError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [swapError, transactionStep]);

  const handleSwapExecution = async () => {
    try {
      setTransactionStep("swapping");
      setIsApproving(false);
      setIsSwapping(true);

      const amountInWei = parseUnits(fromAmount, fromTokenBalance.decimals);

      // Use proper decimals for toToken
      const toTokenDecimalsToUse = toTokenDecimals || toTokenBalance?.decimals || 18;
      const amountOutMinimum = parseUnits(
        (parseFloat(toAmount) * (1 - slippage / 100)).toString(),
        toTokenDecimalsToUse
      );

      console.log("Swap parameters:", {
        tokenIn: getTokenAddress(fromToken),
        tokenOut: getTokenAddress(toToken),
        fee: poolFee,
        recipient: address,
        amountIn: amountInWei.toString(),
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
      });

      writeSwap({
        address: SWAP_ROUTER,
        abi: ROUTER_ABI,
        functionName: "exactInputSingle",
        args: [
          {
            tokenIn: getTokenAddress(fromToken),
            tokenOut: getTokenAddress(toToken),
            fee: poolFee,
            recipient: address,
            deadline: Math.floor(Date.now() / 1000) + 60 * 10,
            amountIn: amountInWei,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: 0,
          },
        ],
      });
    } catch (error) {
      console.error("Swap failed:", error);
      const errorMessage = parseErrorMessage(error);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resetTransaction = () => {
    setTransactionStep("");
    setIsApproving(false);
    setIsSwapping(false);
  };

  const forceBalanceRefresh = async () => {
    console.log("Forcing balance refresh...");
    await Promise.all([
      refetchFromTokenBalance(),
      refetchToTokenBalance(),
    ]);
  };

  // Enhanced success handling with forced refresh
  useEffect(() => {
    if (isSwapSuccess && transactionStep === "swapping") {
      console.log("Swap successful! Hash:", swapHash);

      setTransactionStep("success");
      setIsSwapping(false);
      toast.success(`${fromToken} to ${toToken} swap completed successfully!`);

      setTimeout(() => {
        setFromAmount("");
        setToAmount("");
      }, 3000);

      setTimeout(() => {
        setTransactionStep("");
      }, 8000);
    }
  }, [isSwapSuccess, transactionStep]);

  const handleTransactionError = (message) => {
    setTransactionStep("error");
    setIsApproving(false);
    setIsSwapping(false);
    console.error("Transaction error:", message);
    setTimeout(() => setTransactionStep(""), 5000);
  };

  const getButtonText = () => {
    if (transactionStep === "approving" || isApproveLoading) {
      return "Approving...";
    }
    if (transactionStep === "swapping" || isSwapLoading) {
      return "Swapping...";
    }
    if (transactionStep === "success") {
      return "Swap Successful!";
    }
    if (transactionStep === "error") {
      return "Try Again";
    }
    return `Swap ${fromToken} to ${toToken}`;
  };

  const isButtonDisabled = () => {
    return (
      !fromAmount ||
      parseFloat(fromAmount) <= 0 ||
      isApproving ||
      isSwapping ||
      isApproveLoading ||
      isSwapLoading ||
      validateSwapAmount() !== null
    );
  };

  const getButtonAction = () => {
    if (transactionStep === "error") {
      return resetTransaction;
    }
    if (transactionStep === "success") {
      return forceBalanceRefresh;
    }
    return handleSwap;
  };

  return (
    <>
      <div className="box h-full">
        <div className="inner p-5 h-full">
          <div className="flex flex-col gap-5">


            <div className="flex flex-col gap-2">
              {/* From Token Input */}
              <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
                <div className="left">
                  <p className="m-0 text-xs">You Pay</p>
                  <input
                    type="text"
                    placeholder="0.000"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="border-0 p-0 max-w-[200px] text-2xl bg-transparent p-0 outline-0 text-white placeholder:text-white"
                    disabled={isApproving || isSwapping || isApproveLoading || isSwapLoading}
                  />
                  {address && (
                    <>
                      <p className="m-0 text-xs text-gray-400 mt-1">
                        {fromTokenBalanceLoading
                          ? "Loading..."
                          : fromTokenBalanceError
                            ? `Balance: -`
                            : `Balance: ${formatBalance(fromTokenBalance)} ${fromToken}`}
                      </p>
                      {!fromTokenBalanceLoading && !fromTokenBalanceError && fromTokenBalance && (
                        <div className="mt-2">
                          <button
                            onClick={handleInputMaxBalance}
                            disabled={isApproving || isSwapping || isApproveLoading || isSwapLoading}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            Max
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="right">
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="h-[38px] flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2 cursor-pointer"
                      onClick={() => setFromToken(fromToken === "USDL" ? "RWAL" : "USDL")}
                    >
                      {fromToken} 
                    </div>
                  </div>
                </div>
              </div>

              {/* Switch Button */}
              <div className="flex justify-center">
                <button
                  onClick={switchTokens}
                  className="p-2 bg-[#060708]/30 rounded-full hover:bg-[#060708]/50 transition-colors"
                  disabled={isApproving || isSwapping || isApproveLoading || isSwapLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path
                      d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* To Token Input */}
              <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
                <div className="left">
                  <p className="m-0 text-xs">You Receive (min)</p>
                  <input
                    type="text"
                    placeholder="0.000"
                    value={getAmountOutMinimum()}
                    className="border-0 p-0 max-w-[200px] text-2xl bg-transparent p-0 outline-0 text-white placeholder:text-white"
                    disabled={true}
                    readOnly
                  />
                  {address && (
                    <p className="m-0 text-xs text-gray-400 mt-1">
                      {toTokenBalanceLoading
                        ? "Loading..."
                        : toTokenBalanceError
                          ? `Balance: - `
                          : `Balance: ${formatBalance(toTokenBalance)} ${toToken}`}
                    </p>
                  )}
                </div>
                <div className="right">
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="h-[38px] flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2 cursor-pointer"
                      onClick={() => setToToken(toToken === "USDL" ? "RWAL" : "USDL")}
                    >
                      {toToken} 
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Status */}
            {transactionStep && (
              <div className="px-5">
                <div className="flex items-center justify-center">
                  <p className="m-0 text-xs text-center">
                    {transactionStep === "approving" && `Step 1/2: Approving ${fromToken} spending...`}
                    {transactionStep === "swapping" && `Step 2/2: Executing ${fromToken} to ${toToken} swap...`}
                    {transactionStep === "success" && `✅ ${fromToken} to ${toToken} swap completed successfully!`}
                    {transactionStep === "error" && "❌ Transaction failed. Click 'Try Again' to retry."}
                  </p>
                </div>
              </div>
            )}

            {/* Swap Details */}
            <div className="px-5">
              <div className="flex items-center justify-between mb-2">
                <p className="m-0 flex items-center gap-2 text-xs">
                  Pool Fee <span className="icn">{infoIcn}</span>
                </p>
                <p className="m-0 flex items-center gap-2 text-xs">0.3%</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="m-0 flex items-center gap-2 text-xs">
                  Slippage Tolerance <span className="icn">{infoIcn}</span>
                </p>
                <p className="m-0 flex items-center gap-2 text-xs">{slippage}%</p>
              </div>
            </div>

            {/* Swap Button */}
            <div className="btnWrpper">
              {address ? (
                <button
                  onClick={getButtonAction()}
                  disabled={isButtonDisabled()}
                  className={`flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] ${isButtonDisabled()
                    ? "bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed"
                    : transactionStep === "success"
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-[#000] border-white hover:bg-transparent hover:text-white"
                    }`}
                >
                  {transactionStep === "success" ? "Refresh Balances" : getButtonText()}
                </button>
              ) : (
                <button
                  onClick={connect}
                  className="flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] bg-white text-[#000] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-[#F3F5F8] hover:bg-transparent hover:text-white"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SwapCard;

const infoIcn = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 1.5L7.5 5.5L13 1.56897"
      stroke="#000"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);