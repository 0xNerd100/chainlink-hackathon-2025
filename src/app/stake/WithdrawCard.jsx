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
import { LS_GOLD_ABI, WITHDRAW_USDL, ERC20_ABI ,XRWAL_VAULT_ABI } from "@/abi";
import { toast } from "react-toastify";



const WithdrawCard = ({vault , buttonText}) => {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [inputAmount, setInputAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [transactionStep, setTransactionStep] = useState(""); 
  const [unlockRequestTime, setUnlockRequestTime] = useState(null);
  const [claimCountdown, setClaimCountdown] = useState(0);

  const NETWORK_CONFIG = {
  11155111: { // Sepolia
    name: "Sepolia",
    USDL: "0x8Fad99ADF150373D94e0e19FE0c13FA1aBc3942D",
    RWAL: "0x75C15055f01FB5e845326960daCCAA86e8B13Fa1",
    LS_VAULT: vault,
    WITHDRAW_QUEUE: "0x994844cEe68A9b19f613E59f56a85e898277FfE3" 
  }
  // Add more networks here as needed
};
  
  // Get current network config
  const currentNetwork = NETWORK_CONFIG[chainId];
  
  // Determine if this is XRWAL vault (uses RWAL token instead of USDL)
  const isXRwalVault = vault === "0x6D055dE49e9df5D10D462269192dadEd8f835ffA";
  const tokenSymbol = isXRwalVault ? "RWAL" : "USDL";
  const vaultABI = isXRwalVault ? XRWAL_VAULT_ABI : LS_GOLD_ABI;

  
  // Contract addresses based on current network and vault type
  const LS_VAULT_ADDRESS = currentNetwork?.LS_VAULT;
  const WITHDRAW_QUEUE_ADDRESS = currentNetwork?.WITHDRAW_QUEUE;
  
  const USDL_ADDRESS = currentNetwork?.USDL;
  const RWAL_ADDRESS = currentNetwork?.RWAL;
  const TOKEN_ADDRESS = isXRwalVault ? RWAL_ADDRESS : USDL_ADDRESS;
 

  // Contract write hooks
  const {
    writeContract: writeApprove,
    data: approveHash,
    error: approveError,
  } = useWriteContract();
  
  const {
    writeContract: writeRedeem,
    data: redeemHash,
    error: redeemError,
  } = useWriteContract();
  
  const {
    writeContract: writeClaim,
    data: claimHash,
    error: claimError,
  } = useWriteContract();

  const {
    writeContract: writeClaimApprove,
    data: claimApproveHash,
    error: claimApproveError,
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
    isLoading: isRedeemLoading,
    isSuccess: isRedeemSuccess,
    error: redeemReceiptError,
  } = useWaitForTransactionReceipt({
    hash: redeemHash,
  });

  const {
    isLoading: isClaimLoading,
    isSuccess: isClaimSuccess,
    error: claimReceiptError,
  } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  const {
    isLoading: isClaimApproveLoading,
    isSuccess: isClaimApproveSuccess,
    error: claimApproveReceiptError,
  } = useWaitForTransactionReceipt({
    hash: claimApproveHash,
  });

  // Get LsGOLD balance
  const {
    data: lsGoldBalance,
    isLoading: lsGoldBalanceLoading,
    error: lsGoldBalanceError,
    refetch: refetchLsGoldBalance,
  } = useBalance({
    address: address,
    token: LS_VAULT_ADDRESS,
    query: {
      enabled: !!address && !!LS_VAULT_ADDRESS,
      refetchInterval: 10000,
    },
  });

  // Get token balance (USDL or RWAL)
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

  // Read LsGOLD allowance for the vault (for redeem)
  const { 
    data: allowance, 
    refetch: refetchAllowance 
  } = useReadContract({
    address: LS_VAULT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address, LS_VAULT_ADDRESS],
    query: {
      enabled: !!address && !!LS_VAULT_ADDRESS,
      refetchInterval: 5000,
    }
  });

  // Read LsGOLD allowance for the withdraw queue (for claim)
  const { 
    data: claimAllowance, 
    refetch: refetchClaimAllowance 
  } = useReadContract({
    address: LS_VAULT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address, WITHDRAW_QUEUE_ADDRESS],
    query: {
      enabled: !!address && !!LS_VAULT_ADDRESS && !!WITHDRAW_QUEUE_ADDRESS,
      refetchInterval: 5000,
    }
  });

  // Get pending withdrawal info from withdraw queue
  const {
    data: pendingWithdrawal,
    refetch: refetchPendingWithdrawal,
  } = useReadContract({
    address: WITHDRAW_QUEUE_ADDRESS,
    abi: WITHDRAW_USDL,
    functionName: "pending",
    args: [address],
    query: {
      enabled: !!address && !!WITHDRAW_QUEUE_ADDRESS,
      refetchInterval: 5000,
    }
  });

  // Get withdraw delay from withdraw queue
  const { data: withdrawDelay } = useReadContract({
    address: WITHDRAW_QUEUE_ADDRESS,
    abi: WITHDRAW_USDL,
    functionName: "withdrawDelay",
    query: { enabled: !!WITHDRAW_QUEUE_ADDRESS }
  });

  // Check if withdraw queue is paused
  const { data: isWithdrawPaused } = useReadContract({
    address: WITHDRAW_QUEUE_ADDRESS,
    abi: WITHDRAW_USDL,
    functionName: "paused",
    query: { enabled: !!WITHDRAW_QUEUE_ADDRESS }
  });

  // Check if vault is paused
  const { data: isVaultPaused } = useReadContract({
    address: LS_VAULT_ADDRESS,
    abi: vaultABI,
    functionName: "paused",
    query: { enabled: !!LS_VAULT_ADDRESS }
  });

  // Preview redeem - calculate expected assets
  const { data: expectedAssets } = useReadContract({
    address: LS_VAULT_ADDRESS,
    abi: vaultABI,
    functionName: "previewRedeem",
    args: [inputAmount ? parseUnits(inputAmount, 18) : 0n],
    query: {
      enabled: !!LS_VAULT_ADDRESS && !!inputAmount && inputAmount !== "0",
    }
  });

  // Connect wallet
  const connect = async () => {
    await open();
  };

  // Helper function to format balance
  const formatBalance = (balance) => {
    if (!balance) return "0.0000";
    try {
      return (Number(balance.value) / Math.pow(10, balance.decimals)).toFixed(4);
    } catch (error) {
      console.error("Error formatting balance:", error);
      return "0.0000";
    }
  };

  // Handle Max button click
  const handleInputMaxBalance = () => {
    if (!lsGoldBalance) {
      toast.error("Unable to fetch balance");
      return;
    }

    try {
      const maxBalance = formatUnits(lsGoldBalance.value, lsGoldBalance.decimals);
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

  // Check if user has pending withdrawal that's ready to claim
  const canClaim = () => {
    if (!pendingWithdrawal || !pendingWithdrawal[0] || !pendingWithdrawal[1]) return false;
    const [amount, unlockTime] = pendingWithdrawal;
    const currentTime = Math.floor(Date.now() / 1000);
    return Number(amount) > 0 && Number(unlockTime) <= currentTime;
  };

  // Check if user has pending withdrawal that's still locked
  const hasPendingWithdrawal = () => {
    if (!pendingWithdrawal || !pendingWithdrawal[0]) return false;
    return Number(pendingWithdrawal[0]) > 0;
  };

  // Calculate remaining unlock time
  const getRemainingUnlockTime = () => {
    if (!pendingWithdrawal || !pendingWithdrawal[1]) return 0;
    const [, unlockTime] = pendingWithdrawal;
    const currentTime = Math.floor(Date.now() / 1000);
    const remaining = Number(unlockTime) - currentTime;
    return Math.max(0, remaining);
  };

  // Format remaining time
  const formatRemainingTime = (seconds) => {
    if (seconds <= 0) return "Ready to claim";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Check if we're in countdown mode (after unlock request)
  const isInCountdownMode = () => {
    return unlockRequestTime && claimCountdown > 0;
  };

  // Check if claim approval is needed
  const needsClaimApproval = () => {
    if (!pendingWithdrawal || !claimAllowance) return false;
    const pendingAmount = pendingWithdrawal[0];
    return claimAllowance < pendingAmount;
  };

  // Validate redeem amount
  const validateRedeemAmount = () => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      return "Please enter a valid amount";
    }

    if (!lsGoldBalance) {
      return "Unable to fetch balance";
    }

    const amountInWei = parseUnits(inputAmount, lsGoldBalance.decimals);
    if (amountInWei > lsGoldBalance.value) {
      return `Insufficient ${buttonText} balance`;
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

  // Handle redeem (unlock request) - with approval step
  const handleRedeem = async () => {
    const validationError = validateRedeemAmount();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setTransactionStep("approving");
      setIsApproving(true);

      // Convert amount to wei
      const amountInWei = parseUnits(inputAmount, lsGoldBalance.decimals);

      // Step 1: Approve vault token spending by vault
      writeApprove({
        address: LS_VAULT_ADDRESS,
        abi: vaultABI,
        functionName: "approve",
        args: [LS_VAULT_ADDRESS, amountInWei],
      });
    } catch (error) {
      console.error("Approve failed:", error);
      const errorMessage = parseErrorMessage(error);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle the actual redeem transaction
  const handleRedeemTransaction = async () => {
    try {
      setTransactionStep("redeeming");
      setIsApproving(false);
      setIsRedeeming(true);

      // Convert amount to wei
      const amountInWei = parseUnits(inputAmount, lsGoldBalance.decimals);

      // Call redeem function
      writeRedeem({
        address: LS_VAULT_ADDRESS,
        abi: vaultABI,
        functionName: "redeem",
        args: [amountInWei, address, address],
      });
    } catch (error) {
      console.error("Redeem failed:", error);
      const errorMessage = parseErrorMessage(error);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle claim approval
  const handleClaimApproval = async () => {
    try {
      setTransactionStep("claim-approving");
      setIsClaiming(true);

      // Get pending withdrawal amount
      const pendingAmount = pendingWithdrawal[0];

      // Approve withdraw queue to spend vault tokens
      writeClaimApprove({
        address: LS_VAULT_ADDRESS,
        abi: vaultABI,
        functionName: "approve",
        args: [WITHDRAW_QUEUE_ADDRESS, pendingAmount],
      });
    } catch (error) {
      console.error("Claim approval failed:", error);
      const errorMessage = parseErrorMessage(error);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle claim
  const handleClaim = async () => {
    try {
      // Check if approval is needed first
      if (needsClaimApproval()) {
        await handleClaimApproval();
        return;
      }

      setTransactionStep("claiming");
      setIsClaiming(true);

      // Call claim function from withdraw queue
      writeClaim({
        address: WITHDRAW_QUEUE_ADDRESS,
        abi: WITHDRAW_USDL,
        functionName: "claim",
        args: [LS_VAULT_ADDRESS],
      });
    } catch (error) {
      console.error("Claim failed:", error);
      const errorMessage = parseErrorMessage(error);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle actual claim transaction after approval
  const handleClaimTransaction = async () => {
    try {
      setTransactionStep("claiming");

      // Call claim function from withdraw queue
      writeClaim({
        address: WITHDRAW_QUEUE_ADDRESS,
        abi: WITHDRAW_USDL,
        functionName: "claim",
        args: [LS_VAULT_ADDRESS],
      });
    } catch (error) {
      console.error("Claim failed:", error);
      const errorMessage = parseErrorMessage(error);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resetTransaction = () => {
    setTransactionStep("");
    setIsApproving(false);
    setIsRedeeming(false);
    setIsClaiming(false);
    setUnlockRequestTime(null);
    setClaimCountdown(0);
  };

  const resetAfterSuccess = () => {
    // Reset all transaction states
    setTransactionStep("");
    setIsApproving(false);
    setIsRedeeming(false);
    setIsClaiming(false);
    setUnlockRequestTime(null);
    setClaimCountdown(0);

    // Reset form inputs
    setInputAmount("");

    // Refetch balances and pending withdrawals
    refetchLsGoldBalance();
    refetchTokenBalance();
    refetchPendingWithdrawal();
    refetchAllowance();
    refetchClaimAllowance();
  };

  const handleTransactionError = (message) => {
    setTransactionStep("error");
    setIsApproving(false);
    setIsRedeeming(false);
    setIsClaiming(false);
    console.error("Transaction error:", message);

    // Reset transaction step to empty after 5 seconds
    setTimeout(() => {
      setTransactionStep("");
    }, 5000);
  };

  // Effect to handle approval success and trigger redeem
  useEffect(() => {
    if (isApproveSuccess && transactionStep === "approving") {
      handleRedeemTransaction();
    }
  }, [isApproveSuccess, transactionStep]);

  // Effect to handle claim approval success and trigger claim
  useEffect(() => {
    if (isClaimApproveSuccess && transactionStep === "claim-approving") {
      handleClaimTransaction();
    }
  }, [isClaimApproveSuccess, transactionStep]);

  // Effect to handle redeem success
  useEffect(() => {
    if (isRedeemSuccess && transactionStep === "redeeming") {
      setTransactionStep("success");
      setIsRedeeming(false);
      setUnlockRequestTime(Date.now());
      setClaimCountdown(60); // 60 seconds countdown
      toast.success("Unlock request submitted successfully!");

      // Reset form after a short delay
      setTimeout(() => {
        setInputAmount("");
        refetchLsGoldBalance();
        refetchPendingWithdrawal();
        refetchAllowance();
      }, 2000);

      // Reset transaction step to empty after 5 seconds
      setTimeout(() => {
        setTransactionStep("");
      }, 5000);
    }
  }, [isRedeemSuccess, transactionStep]);

  // Effect to handle claim success
  useEffect(() => {
    if (isClaimSuccess && transactionStep === "claiming") {
      setTransactionStep("success");
      setIsClaiming(false);
      toast.success(`${tokenSymbol} claimed successfully!`);

      // Reset after success
      setTimeout(() => {
        resetAfterSuccess();
      }, 2000);

      // Reset transaction step to empty after 5 seconds
      setTimeout(() => {
        setTransactionStep("");
      }, 5000);
    }
  }, [isClaimSuccess, transactionStep]);

  // Countdown effect for claim button
  useEffect(() => {
    if (claimCountdown > 0) {
      const timer = setTimeout(() => {
        setClaimCountdown(claimCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [claimCountdown]);

  // Effect to handle errors
  useEffect(() => {
    if (approveError && transactionStep === "approving") {
      const errorMessage = parseErrorMessage(approveError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [approveError, transactionStep]);

  useEffect(() => {
    if (redeemError && transactionStep === "redeeming") {
      const errorMessage = parseErrorMessage(redeemError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [redeemError, transactionStep]);

  useEffect(() => {
    if (claimError && transactionStep === "claiming") {
      const errorMessage = parseErrorMessage(claimError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [claimError, transactionStep]);

  useEffect(() => {
    if (claimApproveError && transactionStep === "claim-approving") {
      const errorMessage = parseErrorMessage(claimApproveError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [claimApproveError, transactionStep]);

  useEffect(() => {
    if (approveReceiptError && transactionStep === "approving") {
      const errorMessage = parseErrorMessage(approveReceiptError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [approveReceiptError, transactionStep]);

  useEffect(() => {
    if (redeemReceiptError && transactionStep === "redeeming") {
      const errorMessage = parseErrorMessage(redeemReceiptError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [redeemReceiptError, transactionStep]);

  useEffect(() => {
    if (claimReceiptError && transactionStep === "claiming") {
      const errorMessage = parseErrorMessage(claimReceiptError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [claimReceiptError, transactionStep]);

  useEffect(() => {
    if (claimApproveReceiptError && transactionStep === "claim-approving") {
      const errorMessage = parseErrorMessage(claimApproveReceiptError);
      handleTransactionError(errorMessage);
      toast.error(errorMessage);
    }
  }, [claimApproveReceiptError, transactionStep]);

  // Auto-refresh remaining time
  useEffect(() => {
    if (hasPendingWithdrawal() && !canClaim()) {
      const interval = setInterval(() => {
        refetchPendingWithdrawal();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasPendingWithdrawal(), canClaim(), refetchPendingWithdrawal]);

  const getButtonText = () => {
    if (transactionStep === "approving" || isApproveLoading) {
      return `Approving ${buttonText}...`;
    }
    if (transactionStep === "redeeming" || isRedeemLoading) {
      return "Processing Unlock Request...";
    }
    if (transactionStep === "claim-approving" || isClaimApproveLoading) {
      return "Approving for Claim...";
    }
    if (transactionStep === "claiming" || isClaimLoading) {
      return "Claiming...";
    }
    if (transactionStep === "success") {
      return canClaim() || isInCountdownMode() ? "Claim Successful!" : "Unlock Request Successful!";
    }
    if (transactionStep === "error") {
      return "Try Again";
    }
    if (canClaim()) {
      return needsClaimApproval() ? "Approve & Claim" : "Claim";
    }
    if (isInCountdownMode()) {
      return `Claim (${claimCountdown}s)`;
    }
    return "Unlock Request";
  };

  const isButtonDisabled = () => {
    if (canClaim()) {
      return isClaiming || isClaimLoading || isClaimApproveLoading || transactionStep === "claiming" || transactionStep === "claim-approving";
    }
    if (isInCountdownMode()) {
      return true; // Disabled during countdown
    }
    return (
      !inputAmount ||
      parseFloat(inputAmount) <= 0 ||
      isApproving ||
      isRedeeming ||
      isApproveLoading ||
      isRedeemLoading ||
      transactionStep === "approving" ||
      transactionStep === "redeeming" ||
      validateRedeemAmount() !== null
    );
  };

  const getButtonAction = () => {
    if (transactionStep === "error") {
      return resetTransaction;
    }
    if (transactionStep === "success") {
      return resetAfterSuccess;
    }
    if (canClaim()) {
      return handleClaim;
    }
    if (isInCountdownMode()) {
      return () => {}; // No action during countdown
    }
    return handleRedeem;
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
              Please switch to a supported network to continue.
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

  if (isVaultPaused || isWithdrawPaused) {
    return (
      <div className="box h-full">
        <div className="inner p-5 h-full">
          <div className="flex flex-col gap-5 items-center justify-center">
            <h3 className="text-xl text-white mb-4">Service Paused</h3>
            <p className="text-sm text-gray-400 text-center">
              Withdrawal service is currently paused. Please try again later.
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
          <h3 className="text-lg text-white">Withdraw {tokenSymbol}</h3>
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
            {currentNetwork.name}
          </span>
        </div>

  
      
        {/* Success message after unlock request */}
        {isInCountdownMode() && (
          <div className="p-4 rounded-[10px] bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <p className="m-0 text-green-400 font-medium">Unlock Request Successful!</p>
              </div>
              <p className="m-0 text-sm text-gray-300 mb-3">
                Your {tokenSymbol} will be available to claim in:
              </p>
              <div className="text-2xl font-mono text-white mb-3">
                {claimCountdown}s
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${((60 - claimCountdown) / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Input section - only show if no pending withdrawal and not in countdown mode */}
        {!hasPendingWithdrawal() && !isInCountdownMode() && (
          <div className="flex flex-col gap-2">
            <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
              <div className="left">
                <p className="m-0 text-xs">You Redeem</p>
                <input
                  type="text"
                  placeholder="0.000"
                  value={inputAmount}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="border-0 p-0 max-w-[200px] text-2xl bg-transparent outline-0 text-white placeholder:text-white"
                  disabled={
                    isApproving ||
                    isRedeeming ||
                    isApproveLoading ||
                    isRedeemLoading ||
                    transactionStep === "approving" ||
                    transactionStep === "redeeming"
                  }
                />
                {/* LsGOLD Balance Display */}
                {address && (
                  <>
                    <p className="m-0 text-xs text-gray-400 mt-1">
                      {lsGoldBalanceLoading
                        ? "Loading..."
                        : lsGoldBalanceError
                          ? "Balance: -"
                          : `Balance: ${formatBalance(lsGoldBalance)} ${buttonText}`}
                    </p>
                    {!lsGoldBalanceLoading && !lsGoldBalanceError && lsGoldBalance && (
                      <div className="mt-2">
                        <button
                          onClick={handleInputMaxBalance}
                          disabled={
                            isApproving ||
                            isRedeeming ||
                            isApproveLoading ||
                            isRedeemLoading ||
                            transactionStep === "approving" ||
                            transactionStep === "redeeming"
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
                <p className="m-0 text-2xl text-white">{buttonText}</p>
              </div>
            </div>

            <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
              <div className="left">
                <p className="m-0 text-xs">You Receive</p>
                <input
                  type="text"
                  placeholder="0.000"
                  value={expectedAssets ? formatUnits(expectedAssets, 18).slice(0, 10) : "0.000"}
                  readOnly
                  className="border-0 p-0 max-w-[200px] text-2xl bg-transparent outline-0 text-white placeholder:text-white"
                />
                 <p className="m-0 text-xs text-gray-400 mt-1">
              {tokenBalanceLoading
                ? "Loading..."
                : tokenBalanceError
                  ? "Balance : -"
                  :` Balance : ${formatBalance(tokenBalance)} ${tokenSymbol}`}
            </p>
                
              </div>
              <div className="right">
                <p className="m-0 text-2xl text-white">{tokenSymbol}</p>
              </div>
              
            </div>
            
          </div>
        )}

        {/* Transaction Status */}
        {transactionStep && (
          <div className="px-5">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                {(transactionStep === "approving" || transactionStep === "redeeming" || 
                  transactionStep === "claiming" || transactionStep === "claim-approving") && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <p className="m-0 text-xs text-center">
                  {transactionStep === "approving" &&
                    `Step 1/2: Approving ${buttonText} spending...`}
                  {transactionStep === "redeeming" &&
                    "Step 2/2: Processing unlock request..."}
                  {transactionStep === "claim-approving" &&
                    "Approving for claim..."}
                  {transactionStep === "claiming" &&
                    `Claiming ${tokenSymbol}...`}
                  {transactionStep === "success" &&
                    (canClaim() ? `✅ ${tokenSymbol} claimed successfully!` : "✅ Unlock request submitted!")}
                  {transactionStep === "error" &&
                    "❌ Transaction failed. Click 'Try Again' to retry."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw info */}
        <div className="px-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="m-0 flex items-center gap-2 text-xs">
                Withdraw Delay Time <span className="icn">{infoIcn}</span>
              </p>
              <p className="m-0 flex items-center gap-2 text-xs">
                {withdrawDelay ? `${Number(withdrawDelay)}s` : "60s"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="m-0 flex items-center gap-2 text-xs">
                Withdraw Fee <span className="icn">{infoIcn}</span>
              </p>
              <p className="m-0 flex items-center gap-2 text-xs">0%</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="btnWrapper flex flex-col gap-3">
          {/* Show Claim button when withdrawal is ready */}
          {hasPendingWithdrawal() && canClaim() && !isInCountdownMode() ? (
            <button
              onClick={getButtonAction()}
              disabled={isButtonDisabled()}
              className={`flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] ${
                isButtonDisabled()
                  ? "bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed"
                  : transactionStep === "success"
                    ? "bg-green-500 text-white border-green-500"
                    : transactionStep === "claiming" || transactionStep === "claim-approving"
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
              }`}
            >
              {(transactionStep === "claiming" || transactionStep === "claim-approving") && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              )}
              <span className="text-lg">💰</span>
              {transactionStep === "claiming" 
                ? `Claiming ${tokenSymbol}...` 
                : transactionStep === "claim-approving"
                  ? "Approving Claim..."
                  : transactionStep === "success"
                    ? "✅ Claimed Successfully"
                    : transactionStep === "error"
                      ? "Try Again"
                      : `Claim ${tokenSymbol}`}
            </button>
          ) : isInCountdownMode() ? (
            /* Show countdown button during countdown */
            <button
              disabled={true}
              className="flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] bg-gray-600 text-gray-400 border-[2px] border-gray-600 cursor-not-allowed font-medium px-4 min-w-[100px]"
            >
              <span className="text-lg">⏳</span>
              Claim Available in {claimCountdown}s
            </button>
          ) : (
            /* Show Unlock Request button when no pending withdrawal or not ready to claim */
            <button
              onClick={getButtonAction()}
              disabled={isButtonDisabled()}
              className={`flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] ${
                isButtonDisabled()
                  ? "bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed"
                  : transactionStep === "success"
                    ? "bg-green-500 text-white border-green-500"
                    : transactionStep === "error"
                      ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                      : "bg-white text-[#000] border-white hover:bg-transparent hover:text-white"
              }`}
            >
              {(transactionStep === "approving" || transactionStep === "redeeming") && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              )}
              {transactionStep === "approving"
                ? "Approving..."
                : transactionStep === "redeeming"
                  ? "Processing..."
                  : transactionStep === "success"
                    ? "✅ Request Submitted"
                    : transactionStep === "error"
                      ? "Try Again"
                      : "Unlock Request"}
            </button>
          )}
        </div>

        {/* Transaction hash display */}
        {(approveHash || redeemHash || claimHash || claimApproveHash) && (
          <div className="text-center">
            <p className="text-xs text-gray-400">
              Transaction: 
              <a 
                href={`https://sepolia.etherscan.io/tx/${claimHash || claimApproveHash || redeemHash || approveHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 ml-1 underline"
              >
                View on Etherscan ↗
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default WithdrawCard;

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