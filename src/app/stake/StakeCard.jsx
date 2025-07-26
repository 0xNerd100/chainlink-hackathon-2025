import { useAppKit } from "@reown/appkit/react";
import React, { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { ERC20_ABI, LS_GOLD_ABI } from "@/abi";
import { toast } from "react-toastify";



const StakeCard = ({vault , buttonText}) => {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [inputAmount, setInputAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [transactionStep, setTransactionStep] = useState(""); // "approving", "staking", "success", "error"
  
  // Get current network config
  
const NETWORK_CONFIG = {
  11155111: { // Sepolia
    name: "Sepolia",
    USDL: "0xB7217747Ab3592Dd5Ec3C82640b3ec6dF5D93b9D",
    RWAL:"0x75C15055f01FB5e845326960daCCAA86e8B13Fa1",
    LS_VAULT: vault
  }
  // Add more networks here as needed
};

const currentNetwork = NETWORK_CONFIG[chainId];

  // Determine if this is XRWAL vault (uses RWAL token instead of USDL)
  const isXRwalVault = vault === "0x6D055dE49e9df5D10D462269192dadEd8f835ffA";
  const tokenSymbol = isXRwalVault ? "RWAL" : "USDL";
  
  // Contract addresses based on current network and vault type
  const USDL_ADDRESS = currentNetwork?.USDL;
  const RWAL_ADDRESS = currentNetwork?.RWAL;
  const TOKEN_ADDRESS = isXRwalVault ? RWAL_ADDRESS : USDL_ADDRESS;
  const LS_VAULT_ADDRESS = currentNetwork?.LS_VAULT;

  // Contract write hooks
  const {
    writeContract: writeApprove,
    data: approveHash,
    error: approveError,
  } = useWriteContract();
  
  const {
    writeContract: writeStake,
    data: stakeHash,
    error: stakeError,
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
    isLoading: isStakeLoading,
    isSuccess: isStakeSuccess,
    error: stakeReceiptError,
  } = useWaitForTransactionReceipt({
    hash: stakeHash,
  });

  // Get token balance (USDL or RWAL) using useBalance hook
  const {
    data: tokenBalance,
    isLoading: tokenBalanceLoading,
    error: tokenBalanceError,
    refetch: refetchTokenBalance,
  } = useBalance({
    address: address,
    token: TOKEN_ADDRESS,
    query: {
      enabled: !!address && !!TOKEN_ADDRESS,
      refetchInterval: 10000,
    },
  });

  // Get LsGOLD balance
  const {
    data: lsGoldBalance,
    refetch: refetchLsGoldBalance,
  } = useReadContract({
    address: LS_VAULT_ADDRESS,
    abi: LS_GOLD_ABI,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address && !!LS_VAULT_ADDRESS,
      refetchInterval: 10000,
    }
  });
  

  // Read token allowance
  const { 
    data: allowance, 
    refetch: refetchAllowance 
  } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address, LS_VAULT_ADDRESS],
    query: {
      enabled: !!address && !!TOKEN_ADDRESS && !!LS_VAULT_ADDRESS,
      refetchInterval: 5000,
    }
  });

  // Preview deposit - calculate expected shares
  const { data: expectedShares } = useReadContract({
    address: LS_VAULT_ADDRESS,
    abi: LS_GOLD_ABI,
    functionName: "previewDeposit",
    args: [inputAmount ? parseUnits(inputAmount, 18) : 0n],
    query: {
      enabled: !!LS_VAULT_ADDRESS && !!inputAmount && inputAmount !== "0",
    }
  });

  // Read vault data for pool info
  const { data: totalSupply } = useReadContract({
    address: LS_VAULT_ADDRESS,
    abi: LS_GOLD_ABI,
    functionName: "totalSupply",
    query: { enabled: !!LS_VAULT_ADDRESS }
  });

  const { data: isPaused } = useReadContract({
    address: LS_VAULT_ADDRESS,
    abi: LS_GOLD_ABI,
    functionName: "paused",
    query: { enabled: !!LS_VAULT_ADDRESS }
  });

  // Connect wallet
  const connect = async () => {
    await open();
  };

  // Helper function to format balance
  const formatBalance = (balance) => {
    if (!balance) return "0.0000";
    try {
      return (Number(balance.value) / Math.pow(10, balance.decimals)).toFixed();
    } catch (error) {
      console.error("Error formatting balance:", error);
      return "0.0000";
    }
  };

  // Handle Max button click
  const handleInputMaxBalance = () => {
    if (!tokenBalance) {
      toast.error("Unable to fetch balance");
      return;
    }

    try {
      const maxBalance = formatUnits(tokenBalance.value, tokenBalance.decimals);
      setInputAmount(parseFloat(maxBalance).toFixed(4));
    } catch (error) {
      console.error("Error setting max balance:", error);
      toast.error("Error setting max balance");
    }
  };

  // Handle input change
  const handleInputChange = (value) => {
    setInputAmount(value);
  };

  // Calculate pool share percentage
  const calculatePoolShare = () => {
    if (!expectedShares || !totalSupply || totalSupply === 0n) return "0.00";
    const newTotalSupply = totalSupply + expectedShares;
    const percentage = (Number(expectedShares) / Number(newTotalSupply)) * 100;
    return percentage.toFixed(4);
  };

  // Validate stake amount
  const validateStakeAmount = () => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      return "Please enter a valid amount";
    }

    if (!tokenBalance) {
      return "Unable to fetch balance";
    }

    const amountInWei = parseUnits(inputAmount, tokenBalance.decimals);
    if (amountInWei > tokenBalance.value) {
      return `Insufficient ${tokenSymbol} balance`;
    }

    return null;
  };

  // Helper function to parse error messages
  const parseErrorMessage = (error) => {
    if (!error) return "Unknown error occurred";

    if (error.message) {
      if (
        error.message.includes("User rejected") ||
        error.message.includes("user rejected")
      ) {
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

      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    return "Transaction failed. Please try again";
  };

  // Check if approval is needed
  const needsApproval = () => {
    if (!inputAmount || !allowance || !tokenBalance) return false;
    const inputAmountBigInt = parseUnits(inputAmount, tokenBalance.decimals);
    return allowance < inputAmountBigInt;
  };

  // Handle stake transaction
  const handleStake = async () => {
    const validationError = validateStakeAmount();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setTransactionStep("approving");
      setIsApproving(true);

      // Convert amount to wei
      const amountInWei = parseUnits(inputAmount, tokenBalance.decimals);

      // Step 1: Approve token spending
      writeApprove({
        address: TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [LS_VAULT_ADDRESS, amountInWei],
      });
    } catch (error) {
      console.error("Approval failed:", error);
      const errorMessage = parseErrorMessage(error);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Effect to handle approval success and trigger stake
  useEffect(() => {
    if (isApproveSuccess && transactionStep === "approving") {
      handleDeposit();
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

  // Effect to handle stake errors
  useEffect(() => {
    if (stakeError && transactionStep === "staking") {
      const errorMessage = parseErrorMessage(stakeError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [stakeError, transactionStep]);

  // Effect to handle receipt errors
  useEffect(() => {
    if (approveReceiptError && transactionStep === "approving") {
      const errorMessage = parseErrorMessage(approveReceiptError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [approveReceiptError, transactionStep]);

  useEffect(() => {
    if (stakeReceiptError && transactionStep === "staking") {
      const errorMessage = parseErrorMessage(stakeReceiptError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [stakeReceiptError, transactionStep]);

  const handleDeposit = async () => {
    try {
      setTransactionStep("staking");
      setIsApproving(false);
      setIsStaking(true);

      const amountInWei = parseUnits(inputAmount, tokenBalance.decimals);

      // Step 2: Call deposit function
      await writeStake({
        address: LS_VAULT_ADDRESS,
        abi: LS_GOLD_ABI,
        functionName: "deposit",
        args: [amountInWei, address],
      });
    } catch (error) {
      console.error("Stake failed:", error);
      const errorMessage = parseErrorMessage(error);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resetTransaction = () => {
    setTransactionStep("");
    setIsApproving(false);
    setIsStaking(false);
  };

  const resetAfterSuccess = () => {
    // Reset all transaction states
    setTransactionStep("");
    setIsApproving(false);
    setIsStaking(false);

    // Reset form inputs
    setInputAmount("");

    // Refetch balances
    refetchTokenBalance();
    refetchLsGoldBalance();
    refetchAllowance();
  };

  // Effect to handle stake success
  useEffect(() => {
    if (isStakeSuccess && transactionStep === "staking") {
      setTransactionStep("success");
      setIsStaking(false);
      toast.success(`${tokenSymbol} staked successfully!`);

      // Reset form after a short delay
      setTimeout(() => {
        setInputAmount("");
        // Refetch balances
        refetchTokenBalance();
        refetchLsGoldBalance();
        refetchAllowance();
      }, 2000);

      // Reset transaction step to empty after 5 seconds
      setTimeout(() => {
        setTransactionStep("");
      }, 5000);
    }
  }, [isStakeSuccess, transactionStep]);

  const handleTransactionError = (message) => {
    setTransactionStep("error");
    setIsApproving(false);
    setIsStaking(false);
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
    if (transactionStep === "staking" || isStakeLoading) {
      return "Staking...";
    }
    if (transactionStep === "success") {
      return "Stake Successful!";
    }
    if (transactionStep === "error") {
      return "Try Again";
    }
    return "Stake";
  };

  const isButtonDisabled = () => {
    return (
      !inputAmount ||
      parseFloat(inputAmount) <= 0 ||
      isApproving ||
      isStaking ||
      isApproveLoading ||
      isStakeLoading ||
      validateStakeAmount() !== null
    );
  };

  const getButtonAction = () => {
    if (transactionStep === "error") {
      return resetTransaction;
    }
    if (transactionStep === "success") {
      return resetAfterSuccess;
    }
    return handleStake;
  };

  if (!isConnected) {
    return (
      <div className="box h-full">
        <div className="inner p-5 h-full">
          <div className="flex flex-col gap-5 items-center justify-center">
            <h3 className="text-xl text-white mb-4">Connect Your Wallet</h3>
            <button
              onClick={connect}
              className="flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] bg-white text-[#000] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-white hover:bg-transparent hover:text-white"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentNetwork) {
    return (
      <div className="box h-full">
        <div className="inner p-5 h-full">
          <div className="flex flex-col gap-5 items-center justify-center">
            <h3 className="text-xl text-white mb-4">Unsupported Network</h3>
            <p className="text-sm text-gray-400 text-center">
              Please switch to a supported network to continue staking.
            </p>
            <button
              onClick={() => open({ view: "Networks" })}
              className="flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] bg-white text-[#000] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-white hover:bg-transparent hover:text-white"
            >
              Switch Network
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div className="box h-full">
        <div className="inner p-5 h-full">
          <div className="flex flex-col gap-5 items-center justify-center">
            <h3 className="text-xl text-white mb-4">Vault Paused</h3>
            <p className="text-sm text-gray-400 text-center">
              The vault is currently paused. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box h-full">
      <div className="inner p-5 h-full">
        <div className="flex flex-col gap-5">
          {/* Network indicator */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg text-white">Stake {tokenSymbol}</h3>
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
              {currentNetwork.name}
            </span>
          </div>

          {/* Input section */}
          <div className="flex flex-col gap-2">
            <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
              <div className="left">
                <p className="m-0 text-xs">You Spend</p>
                <input
                  type="text"
                  placeholder="0.000"
                  value={inputAmount}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="border-0 p-0 max-w-[200px] text-2xl bg-transparent p-0 outline-0 text-white placeholder:text-white"
                  disabled={
                    isApproving ||
                    isStaking ||
                    isApproveLoading ||
                    isStakeLoading
                  }
                />
                {/* Token Balance Display */}
                {address && (
                  <>
                    <p className="m-0 text-xs text-gray-400 mt-1">
                      {tokenBalanceLoading
                        ? "Loading..."
                        : tokenBalanceError
                          ? "Balance: -"
                          : `Balance: ${formatBalance(tokenBalance)} ${tokenSymbol}`}
                    </p>
                    {!tokenBalanceLoading && !tokenBalanceError && tokenBalance && (
                      <div className="mt-2">
                        <button
                          onClick={handleInputMaxBalance}
                          disabled={
                            isApproving ||
                            isStaking ||
                            isApproveLoading ||
                            isStakeLoading
                          }
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
                <p className="m-0 text-2xl text-white">{tokenSymbol}</p>
              </div>
            </div>

            <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
              <div className="left">
                <p className="m-0 text-xs">You Receive</p>
                <input
                  type="text"
                  placeholder="0.000"
                  value={expectedShares ? formatUnits(expectedShares, 18).slice(0, 10) : "0.000"}
                  readOnly
                  className="border-0 p-0 max-w-[200px] text-2xl bg-transparent outline-0 text-white placeholder:text-white"
                />
                {/* LsGOLD Balance Display */}
                {address && (
                  <p className="m-0 text-xs text-gray-400 mt-1">
                    Balance: {lsGoldBalance ? formatUnits(lsGoldBalance, 18).slice(0, 8) : "0.00"} {buttonText}
                  </p>
                )}
              </div>
              <div className="right">
                <div className="h-[38px] flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2">
                  {buttonText}
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
                `Step 1/2: Approving ${tokenSymbol} spending...`}
                {transactionStep === "staking" &&
                "Step 2/2: Executing Stake..."}
                {transactionStep === "success" &&
                `✅ ${tokenSymbol} staked successfully!`}
                {transactionStep === "error" &&
                "❌ Transaction failed. Click 'Try Again' to retry."}
                </p>
              </div>
            </div>
          )}

          {/* Pool info */}
          <div className="px-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="m-0 flex items-center gap-2 text-xs">
                  Pool Share <span className="icn">{infoIcn}</span>
                </p>
                <p className="m-0 flex items-center gap-2 text-xs">{calculatePoolShare()}%</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="m-0 flex items-center gap-2 text-xs">
                  Stake Fee <span className="icn">{infoIcn}</span>
                </p>
                <p className="m-0 flex items-center gap-2 text-xs">0%</p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="btnWrapper">
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
              {getButtonText()}
            </button>
          </div>

          {/* Transaction hash display */}
          {(approveHash || stakeHash) && (
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Transaction: 
                <a 
                  href={`https://sepolia.etherscan.io/tx/${stakeHash || approveHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 ml-1"
                >
                  View on Etherscan
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StakeCard;

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