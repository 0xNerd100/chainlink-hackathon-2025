import { useAppKit } from "@reown/appkit/react";
import React, { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { getContractAddress } from "../../config/contract";
import { parseUnits, formatUnits } from "viem";
import { BOOTSTRAP_ABI, ERC20_ABI } from "@/abi";
import { toast } from "react-toastify";

const SwapCard = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [usdcAmount, setUsdcAmount] = useState("");
  const [usdlAmount, setUsdlAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [transactionStep, setTransactionStep] = useState(""); // "approving", "buying", "success", "error"

  // Get contract addresses for current network
  const USDC_ADDRESS = getContractAddress(chainId, "USDC");
  const USDL_ADDRESS = getContractAddress(chainId, "USDL");
  const BOOTSTRAP_ADDRESS = getContractAddress(chainId, "BOOTSTRAP"); // You'll need to add this to your config

  // Contract write hooks
  const {
    writeContract: writeApprove,
    data: approveHash,
    error: approveError,
  } = useWriteContract();
  const {
    writeContract: writeBuy,
    data: buyHash,
    error: buyError,
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
    isLoading: isBuyLoading,
    isSuccess: isBuySuccess,
    error: buyReceiptError,
  } = useWaitForTransactionReceipt({
    hash: buyHash,
  });

  // Get USDC balance
  const {
    data: usdcBalance,
    isLoading: usdcBalanceLoading,
    error: usdcBalanceError,
    refetch: refetchUsdcBalance,
  } = useBalance({
    address: address,
    token: USDC_ADDRESS,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  });

  // Get USDL balance
  const {
    data: usdlBalance,
    isLoading: usdlBalanceLoading,
    error: usdlBalanceError,
    refetch: refetchUsdlBalance,
  } = useBalance({
    address: address,
    token: USDL_ADDRESS,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  });

  const connect = async () => {
    await open();
  };

  // Helper function to format balance
  const formatBalance = (balance) => {
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

  const handleUsdcAmountChange = (value) => {
    setUsdcAmount(value);
    // For 1:1 swap, USDL amount equals USDC amount
    setUsdlAmount(value);
  };

  console.log("approveError", approveError);
  const handleUsdlAmountChange = (value) => {
    setUsdlAmount(value);
    // For 1:1 swap, USDC amount equals USDL amount
    setUsdcAmount(value);
  };

  const validateSwapAmount = () => {
    if (!usdcAmount || parseFloat(usdcAmount) <= 0) {
      return "Please enter a valid amount";
    }

    if (!usdcBalance) {
      return "Unable to fetch balance";
    }

    const amountInWei = parseUnits(usdcAmount, usdcBalance.decimals);
    if (amountInWei > usdcBalance.value) {
      return "Insufficient USDC balance";
    }

    return null;
  };

  // Helper function to parse error messages
  const parseErrorMessage = (error) => {
    if (!error) return "Unknown error occurred";

    // Handle different error types
    if (error.message) {
      // Check for user rejection
      if (
        error.message.includes("User rejected") ||
        error.message.includes("user rejected")
      ) {
        return "Transaction was rejected by user";
      }

      // Check for insufficient funds
      if (error.message.includes("insufficient funds")) {
        return "Insufficient funds for transaction";
      }

      // Check for gas estimation errors
      if (error.message.includes("gas")) {
        return "Gas estimation failed. Please try again";
      }

      // Check for network errors
      if (error.message.includes("network")) {
        return "Network error. Please check your connection";
      }

      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    return "Transaction failed. Please try again";
  };

  const handleSwap = async () => {
    const validationError = validateSwapAmount();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setTransactionStep("approving");
      setIsApproving(true);

      // Convert amount to wei
      const amountInWei = parseUnits(usdcAmount, usdcBalance.decimals);

      // Step 1: Approve USDC spending
      await writeApprove({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [BOOTSTRAP_ADDRESS, amountInWei],
      });
    } catch (error) {
      console.error("Approval failed:", error);
      const errorMessage = parseErrorMessage(error);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Effect to handle approval success and trigger buy
  useEffect(() => {
    if (isApproveSuccess && transactionStep === "approving") {
      handleBuy();
    }
  }, [isApproveSuccess, transactionStep]);

  // Effect to handle approval errors
  useEffect(() => {
    if (approveError && transactionStep === "approving") {
      const errorMessage = parseErrorMessage(approveError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [approveError, transactionStep]);

  // Effect to handle buy errors
  useEffect(() => {
    if (buyError && transactionStep === "buying") {
      const errorMessage = parseErrorMessage(buyError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [buyError, transactionStep]);

  // Effect to handle receipt errors
  useEffect(() => {
    if (approveReceiptError && transactionStep === "approving") {
      const errorMessage = parseErrorMessage(approveReceiptError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [approveReceiptError, transactionStep]);

  useEffect(() => {
    if (buyReceiptError && transactionStep === "buying") {
      const errorMessage = parseErrorMessage(buyReceiptError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [buyReceiptError, transactionStep]);

  const handleBuy = async () => {
    try {
      setTransactionStep("buying");
      setIsApproving(false);
      setIsBuying(true);

      const amountInWei = parseUnits(usdcAmount, usdcBalance.decimals);

      // Step 2: Call buy function
      await writeBuy({
        address: BOOTSTRAP_ADDRESS,
        abi: BOOTSTRAP_ABI,
        functionName: "buy",
        args: [amountInWei],
      });
    } catch (error) {
      console.error("Buy failed:", error);
      const errorMessage = parseErrorMessage(error);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resetTransaction = () => {
    setTransactionStep("");
    setIsApproving(false);
    setIsBuying(false);
  };

  const resetAfterSuccess = () => {
    // Reset all transaction states
    setTransactionStep("");
    setIsApproving(false);
    setIsBuying(false);

    // Reset form inputs
    setUsdcAmount("");
    setUsdlAmount("");

    // Refetch balances
    refetchUsdcBalance();
    refetchUsdlBalance();
  };

  // Effect to handle buy success
  useEffect(() => {
    if (isBuySuccess && transactionStep === "buying") {
      setTransactionStep("success");
      setIsBuying(false);
      toast.success("Swap completed successfully!");

      // Reset form after a short delay
      setTimeout(() => {
        setUsdcAmount("");
        setUsdlAmount("");
        // Refetch balances
        refetchUsdcBalance();
        refetchUsdlBalance();
      }, 2000);
    }
  }, [isBuySuccess, transactionStep]);
  // Effect to handle buy success
  useEffect(() => {
    if (isBuySuccess && transactionStep === "buying") {
      setTransactionStep("success");
      setIsBuying(false);
      toast.success("Swap completed successfully!");
      
      // Reset form after a short delay
      setTimeout(() => {
        setUsdcAmount("");
        setUsdlAmount("");
        // Refetch balances
        refetchUsdcBalance();
        refetchUsdlBalance();
      }, 2000);

      // Reset transaction step to empty after 5 seconds
      setTimeout(() => {
        setTransactionStep("");
      }, 5000);
    }
  }, [isBuySuccess, transactionStep]);

  const handleTransactionError = (message) => {
    setTransactionStep("error");
    setIsApproving(false);
    setIsBuying(false);
    console.error("Transaction error:", message);
    
    // Reset transaction step to empty after 5 seconds
    setTimeout(() => {
      setTransactionStep("");
    }, 5000);
  };

  const getButtonText = () => {
    if (transactionStep === "approving" || isApproveLoading) {
      return "Approving...";
    }
    if (transactionStep === "buying" || isBuyLoading) {
      return "Swapping...";
    }
    if (transactionStep === "success") {
      return "Swap Successful!";
    }
    if (transactionStep === "error") {
      return "Try Again";
    }
    return "Swap";
  };

  const isButtonDisabled = () => {
    return (
      !usdcAmount ||
      parseFloat(usdcAmount) <= 0 ||
      isApproving ||
      isBuying ||
      isApproveLoading ||
      isBuyLoading ||
      validateSwapAmount() !== null
    );
  };

  const getButtonAction = () => {
    if (transactionStep === "error") {
      return resetTransaction;
    }
    if (transactionStep === "success") {
      return resetAfterSuccess;
    }
    return handleSwap;
  };

  return (
    <>
      <div className="box h-full">
        <div className="inner p-5 h-full">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
                <div className="left">
                  <p className="m-0 text-xs">You Spend</p>
                  <input
                    type="text"
                    placeholder="0.000"
                    value={usdcAmount}
                    onChange={(e) => handleUsdcAmountChange(e.target.value)}
                    className="border-0 p-0 max-w-[200px] text-2xl bg-transparent p-0 outline-0 text-white placeholder:text-white"
                    disabled={
                      isApproving ||
                      isBuying ||
                      isApproveLoading ||
                      isBuyLoading
                    }
                  />
                  {/* USDC Balance Display */}
                  {address && (
                    <p className="m-0 text-xs text-gray-400 mt-1">
                      {usdcBalanceLoading
                        ? "Loading..."
                        : usdcBalanceError
                        ? "Error loading balance"
                        : `Balance: ${formatBalance(usdcBalance)} USDC`}
                    </p>
                  )}
                </div>
                <div className="right">
                  <p className="m-0 text-2xl text-white">USDC</p>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
                <div className="left">
                  <p className="m-0 text-xs">You Receive</p>
                  <input
                    type="text"
                    placeholder="0.000"
                    value={usdlAmount}
                    onChange={(e) => handleUsdlAmountChange(e.target.value)}
                    className="border-0 p-0 max-w-[200px] text-2xl bg-transparent p-0 outline-0 text-white placeholder:text-white"
                    disabled={
                      isApproving ||
                      isBuying ||
                      isApproveLoading ||
                      isBuyLoading
                    }
                  />
                  {/* USDL Balance Display */}
                  {address && (
                    <p className="m-0 text-xs text-gray-400 mt-1">
                      {usdlBalanceLoading
                        ? "Loading..."
                        : usdlBalanceError
                        ? "Error loading balance"
                        : `Balance: ${formatBalance(usdlBalance)} USDL`}
                    </p>
                  )}
                </div>
                <div className="right">
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="h-[38px] flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2"
                    >
                      USDL {downIcn}
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
                    {transactionStep === "approving" &&
                      "Step 1/2: Approving USDC spending..."}
                    {transactionStep === "buying" &&
                      "Step 2/2: Executing swap..."}
                    {transactionStep === "success" &&
                      "✅ Swap completed successfully!"}
                    {transactionStep === "error" &&
                      "❌ Transaction failed. Click 'Try Again' to retry."}
                  </p>
                </div>
              </div>
            )}

            <div className="px-5">
              <div className="flex items-center justify-between">
                <p className="m-0 flex items-center gap-2 text-xs">
                  Swap Fee <span className="icn">{infoIcn}</span>
                </p>
                <p className="m-0 flex items-center gap-2 text-xs">0%</p>
              </div>
            </div>

            <div className="btnWrpper">
              {address ? (
                <>
                  <button
                    onClick={getButtonAction()}
                    disabled={isButtonDisabled()}
                    className={`flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] ${
                      isButtonDisabled()
                        ? "bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed"
                        : transactionStep === "success"
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-[#000] border-white hover:bg-transparent hover:text-white"
                    }`}
                  >
                    {getButtonText()}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={connect}
                    className="flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] bg-white text-[#000] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-[#F3F5F8] hover:bg-transparent hover:text-white"
                  >
                    Connect Wallet
                  </button>
                </>
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
