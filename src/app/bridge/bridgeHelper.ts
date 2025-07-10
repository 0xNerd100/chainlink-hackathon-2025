import { useState, useCallback } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { parseUnits, formatUnits, encodeFunctionData, parseAbi, decodeEventLog, keccak256, toHex } from 'viem';

// Network configurations
const NETWORK_CONFIG = {
  sepolia: {
    chainId: 11155111,
    chainSelector: "16015286601757825753",
    router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    rmnProxy: "0xba3f6251de62dED61Ff98590cB2fDf6871FbB991",
    tokenAdminRegistry: "0x95F29FEE11c5C55d26cCcf1DB6772DE953B37B82",
    registryModuleOwnerCustom: "0x62e731218d0D47305aba2BE3751E7EE9E5520790",
    link: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    confirmations: 3,
    nativeCurrencySymbol: "ETH",
    chainType: "evm"
  },
  baseSepolia: {
    chainId: 84532,
    chainSelector: "10344971235874465080",
    router: "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93",
    rmnProxy: "0x99360767a4705f68CcCb9533195B761648d6d807",
    tokenAdminRegistry: "0x736D0bBb318c1B27Ff686cd19804094E66250e17",
    registryModuleOwnerCustom: "0x8A55C61227f26a3e2f217842eCF20b52007bAaBe",
    link: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
    confirmations: 2,
    nativeCurrencySymbol: "ETH",
    chainType: "evm"
  }
};

// Token addresses
const TOKEN_ADDRESSES = {
  sepolia: {
    USDL: "0xB7217747Ab3592Dd5Ec3C82640b3ec6dF5D93b9D"
  },
  baseSepolia: {
    USDL: "0x5087d7819270DF42c46BE3D8ddc1d1B67E7399B2"
  }
};

// Enhanced ABI definitions with proper error handling
const ROUTER_ABI = parseAbi([
  'struct TokenAmount { address token; uint256 amount; }',
  'struct EVM2AnyMessage { bytes receiver; bytes data; TokenAmount[] tokenAmounts; address feeToken; bytes extraArgs; }',
  'function getFee(uint64 destinationChainSelector, EVM2AnyMessage calldata message) external view returns (uint256 fee)',
  'function ccipSend(uint64 destinationChainSelector, EVM2AnyMessage calldata message) external payable returns (bytes32)',
  'function isChainSupported(uint64 chainSelector) external view returns (bool)',
  'error UnsupportedDestinationChain(uint64 destChainSelector)',
  'error InsufficientFeeTokenAmount(uint256 expected, uint256 actual)',
  'error InvalidMsgValue(uint256 expected, uint256 actual)',
  'error TokenNotSupported(address token)'
]);

const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'function totalSupply() external view returns (uint256)'
]);

const ONRAMP_ABI = parseAbi([
  'struct TokenAmount { address token; uint256 amount; }',
  'struct EVM2AnyMessage { bytes receiver; bytes data; TokenAmount[] tokenAmounts; address feeToken; bytes extraArgs; }',
  'event CCIPMessageSent(uint64 indexed destinationChainSelector, bytes32 indexed messageId, EVM2AnyMessage message, uint256 feeTokenAmount, address feeToken)'
]);

export enum FeeType {
  NATIVE = "native",
  LINK = "LINK"
}

export interface BridgeParams {
  tokenAddress: string;
  amount: string;
  destinationChain: keyof typeof NETWORK_CONFIG;
  receiverAddress: string;
  feeType: FeeType;
}

export interface BridgeStatus {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
  messageId: string | null;
  success: boolean;
}

export interface TokenBalance {
  balance: string;
  decimals: number;
  symbol: string;
  name: string;
}

export const useBridgeHelper = () => {
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>({
    isLoading: false,
    error: null,
    txHash: null,
    messageId: null,
    success: false
  });

  const resetStatus = useCallback(() => {
    setBridgeStatus({
      isLoading: false,
      error: null,
      txHash: null,
      messageId: null,
      success: false
    });
  }, []);

  const log = useCallback((message: string, data?: any) => {
    console.log(`[Bridge Helper] ${message}`, data || '');
  }, []);

  const logError = useCallback((message: string, error?: any) => {
    console.error(`[Bridge Helper ERROR] ${message}`, error || '');
  }, []);

  const encodeExtraArgs = useCallback(() => {
    try {
      // CCIP V2 extra args encoding - matches the test script approach
      const functionSelector = keccak256(toHex("CCIP EVMExtraArgsV2")).slice(0, 10);
      const gasLimit = 0n; // No gas limit for token-only transfers
      const allowOutOfOrderExecution = true;
      
      // Encode the extra args using ABI encoding
      const encodedArgs = encodeFunctionData({
        abi: parseAbi(['function encode(uint256 gasLimit, bool allowOutOfOrderExecution) returns (bytes)']),
        functionName: 'encode',
        args: [gasLimit, allowOutOfOrderExecution]
      });
      
      const result = functionSelector + encodedArgs.slice(10);
      log('Encoded extra args:', result);
      return result;
    } catch (error) {
      logError('Error encoding extra args:', error);
      throw error;
    }
  }, [log, logError]);

  const getTokenBalance = useCallback(async (tokenAddress: string, userAddress: string, networkConfig: any) => {
    if (!publicClient) {
      throw new Error('Public client not available');
    }

    try {
      const [balance, decimals, symbol, name] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [userAddress as `0x${string}`]
        }),
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'decimals'
        }),
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'symbol'
        }),
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'name'
        })
      ]);

      const formattedBalance = formatUnits(balance, decimals);
      log(`Token balance for ${symbol}:`, {
        balance: formattedBalance,
        decimals,
        symbol,
        name,
        raw: balance.toString()
      });

      return {
        balance: formattedBalance,
        decimals,
        symbol,
        name
      };
    } catch (error) {
      logError('Error getting token balance:', error);
      throw error;
    }
  }, [publicClient, log, logError]);

  const estimateFee = useCallback(async (params: BridgeParams) => {
    if (!publicClient || !address) {
      throw new Error('Public client or address not available');
    }

    try {
      const sourceNetwork = chain?.id === NETWORK_CONFIG.sepolia.chainId ? 'sepolia' : 'baseSepolia';
      const sourceConfig = NETWORK_CONFIG[sourceNetwork];
      const destinationConfig = NETWORK_CONFIG[params.destinationChain];

      log('Estimating fee for bridge:', {
        sourceNetwork,
        destinationChain: params.destinationChain,
        amount: params.amount,
        feeType: params.feeType
      });

      const feeTokenAddress = params.feeType === FeeType.NATIVE 
        ? '0x0000000000000000000000000000000000000000' 
        : sourceConfig.link;

      const tokenAmounts = [
        {
          token: params.tokenAddress as `0x${string}`,
          amount: parseUnits(params.amount, 18)
        }
      ];

      // Use proper ABI encoding for receiver address (matches test script)
      const receiverEncoded = encodeFunctionData({
        abi: parseAbi(['function encode(address) returns (bytes)']),
        functionName: 'encode',
        args: [params.receiverAddress as `0x${string}`]
      }).slice(10); // Remove function selector

      const message = {
        receiver: ('0x' + receiverEncoded) as `0x${string}`,
        data: '0x' as `0x${string}`,
        tokenAmounts,
        feeToken: feeTokenAddress as `0x${string}`,
        extraArgs: encodeExtraArgs() as `0x${string}`
      };

      log('Message for fee estimation:', message);

      const fee = await publicClient.readContract({
        address: sourceConfig.router as `0x${string}`,
        abi: ROUTER_ABI,
        functionName: 'getFee',
        args: [BigInt(destinationConfig.chainSelector), message]
      });

      log('Estimated fee:', {
        fee: fee.toString(),
        feeFormatted: formatUnits(fee, 18),
        feeType: params.feeType
      });

      return fee;
    } catch (error) {
      logError('Error estimating fee:', error);
      throw error;
    }
  }, [publicClient, address, chain, encodeExtraArgs, log, logError]);

  const checkAllowance = useCallback(async (tokenAddress: string, spenderAddress: string) => {
    if (!publicClient || !address) {
      throw new Error('Public client or address not available');
    }

    try {
      const allowance = await publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, spenderAddress as `0x${string}`]
      });

      log('Current allowance:', {
        tokenAddress,
        spenderAddress,
        allowance: allowance.toString(),
        allowanceFormatted: formatUnits(allowance, 18)
      });

      return allowance;
    } catch (error) {
      logError('Error checking allowance:', error);
      throw error;
    }
  }, [publicClient, address, log, logError]);

  const approveToken = useCallback(async (tokenAddress: string, spenderAddress: string, amount: bigint) => {
    if (!walletClient || !address) {
      throw new Error('Wallet client or address not available');
    }

    try {
      log('Approving token:', {
        tokenAddress,
        spenderAddress,
        amount: amount.toString(),
        amountFormatted: formatUnits(amount, 18)
      });

      const hash = await walletClient.writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress as `0x${string}`, amount]
      });

      log('Approval transaction sent:', hash);
      return hash;
    } catch (error) {
      logError('Error approving token:', error);
      throw error;
    }
  }, [walletClient, address, log, logError]);

  const bridgeTokens = useCallback(async (params: BridgeParams) => {
    if (!walletClient || !publicClient || !address) {
      throw new Error('Wallet client, public client, or address not available');
    }

    setBridgeStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const sourceNetwork = chain?.id === NETWORK_CONFIG.sepolia.chainId ? 'sepolia' : 'baseSepolia';
      const sourceConfig = NETWORK_CONFIG[sourceNetwork];
      const destinationConfig = NETWORK_CONFIG[params.destinationChain];

      log('Starting bridge transaction:', {
        sourceNetwork,
        destinationChain: params.destinationChain,
        amount: params.amount,
        tokenAddress: params.tokenAddress,
        receiverAddress: params.receiverAddress,
        feeType: params.feeType
      });

      // Check token balance before bridging
      const tokenBalance = await getTokenBalance(params.tokenAddress, address, sourceConfig);
      log('Source token balance:', tokenBalance);

      // Check destination token balance
      if (params.destinationChain === 'baseSepolia') {
        try {
          const destinationBalance = await getTokenBalance(
            TOKEN_ADDRESSES.baseSepolia.USDL,
            params.receiverAddress,
            destinationConfig
          );
          log('Destination USDL balance on Base Sepolia:', destinationBalance);
        } catch (error) {
          logError('Could not fetch destination balance:', error);
        }
      }

      // Check if destination chain is supported
      const isSupported = await publicClient.readContract({
        address: sourceConfig.router as `0x${string}`,
        abi: ROUTER_ABI,
        functionName: 'isChainSupported',
        args: [BigInt(destinationConfig.chainSelector)]
      });

      if (!isSupported) {
        throw new Error(`Destination chain ${params.destinationChain} is not supported`);
      }

      log('Destination chain is supported');

      const amount = parseUnits(params.amount, 18);
      const feeTokenAddress = params.feeType === FeeType.NATIVE 
        ? '0x0000000000000000000000000000000000000000' 
        : sourceConfig.link;

      // Check if user has enough tokens - compare in wei
      const balanceInWei = parseUnits(tokenBalance.balance, tokenBalance.decimals);
      if (balanceInWei < amount) {
        throw new Error(`Insufficient token balance. Required: ${formatUnits(amount, 18)}, Available: ${tokenBalance.balance}`);
      }
      
      log('Token balance check passed:', {
        required: formatUnits(amount, 18),
        available: tokenBalance.balance,
        balanceInWei: balanceInWei.toString(),
        amountInWei: amount.toString()
      });

      // Check and approve token allowance
      const currentAllowance = await checkAllowance(params.tokenAddress, sourceConfig.router);
      if (currentAllowance < amount) {
        log('Approving token allowance...');
        const approveHash = await approveToken(params.tokenAddress, sourceConfig.router, amount);
        
        // Wait for approval confirmation
        const approvalReceipt = await publicClient.waitForTransactionReceipt({ 
          hash: approveHash,
          confirmations: sourceConfig.confirmations
        });
        log('Token approval confirmed:', approvalReceipt.transactionHash);
      }

      // If using LINK for fees, check and approve LINK allowance
      let estimatedFee: bigint;
      if (params.feeType === FeeType.LINK) {
        estimatedFee = await estimateFee(params);
        
        // Check LINK balance - compare in wei
        const linkBalance = await getTokenBalance(sourceConfig.link, address, sourceConfig);
        const linkBalanceInWei = parseUnits(linkBalance.balance, linkBalance.decimals);
        if (linkBalanceInWei < estimatedFee) {
          throw new Error(`Insufficient LINK balance. Required: ${formatUnits(estimatedFee, 18)}, Available: ${linkBalance.balance}`);
        }
        
        log('LINK balance check passed:', {
          required: formatUnits(estimatedFee, 18),
          available: linkBalance.balance,
          balanceInWei: linkBalanceInWei.toString(),
          feeInWei: estimatedFee.toString()
        });

        const linkAllowance = await checkAllowance(sourceConfig.link, sourceConfig.router);
        
        if (linkAllowance < estimatedFee) {
          log('Approving LINK token allowance...');
          const approveLinkHash = await approveToken(sourceConfig.link, sourceConfig.router, estimatedFee);
          
          const linkApprovalReceipt = await publicClient.waitForTransactionReceipt({ 
            hash: approveLinkHash,
            confirmations: sourceConfig.confirmations
          });
          log('LINK approval confirmed:', linkApprovalReceipt.transactionHash);
        }
      } else {
        estimatedFee = await estimateFee(params);
      }

      // Prepare the message - use proper encoding matching test script
      const tokenAmounts = [
        {
          token: params.tokenAddress as `0x${string}`,
          amount: amount
        }
      ];

      // Encode receiver address properly
      const receiverEncoded = encodeFunctionData({
        abi: parseAbi(['function encode(address) returns (bytes)']),
        functionName: 'encode',
        args: [params.receiverAddress as `0x${string}`]
      }).slice(10); // Remove function selector

      const message = {
        receiver: ('0x' + receiverEncoded) as `0x${string}`,
        data: '0x' as `0x${string}`,
        tokenAmounts,
        feeToken: feeTokenAddress as `0x${string}`,
        extraArgs: encodeExtraArgs() as `0x${string}`
      };

      log('Final message for CCIP send:', message);

      // Simulate the transaction first
      try {
        const value = params.feeType === FeeType.NATIVE ? estimatedFee : 0n;
        
        await publicClient.simulateContract({
          address: sourceConfig.router as `0x${string}`,
          abi: ROUTER_ABI,
          functionName: 'ccipSend',
          args: [BigInt(destinationConfig.chainSelector), message],
          value: value,
          account: address
        });

        log('Transaction simulation successful');
      } catch (simulationError) {
        logError('Transaction simulation failed:', simulationError);
        throw new Error(`Transaction simulation failed: ${simulationError}`);
      }

      // Send the CCIP message
      const value = params.feeType === FeeType.NATIVE ? estimatedFee : 0n;
      
      log('Sending CCIP transaction with value:', value.toString());
      
      const hash = await walletClient.writeContract({
        address: sourceConfig.router as `0x${string}`,
        abi: ROUTER_ABI,
        functionName: 'ccipSend',
        args: [BigInt(destinationConfig.chainSelector), message],
        value: value
      });

      log('CCIP transaction sent:', hash);

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash,
        confirmations: sourceConfig.confirmations
      });

      log('Transaction confirmed:', {
        hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status
      });

      // Parse logs to get message ID
      let messageId = '';
      const ccipMessageSentSignature = keccak256(toHex('CCIPMessageSent(uint64,bytes32,(bytes,bytes,(address,uint256)[],address,bytes),uint256,address)'));
      
      for (const log of receipt.logs) {
        try {
          if (log.topics[0] === ccipMessageSentSignature) {
            const decodedLog = decodeEventLog({
              abi: ONRAMP_ABI,
              data: log.data,
              topics: log.topics,
              eventName: 'CCIPMessageSent'
            });
            
            messageId = decodedLog.args.messageId;
            console.log('Found CCIP message ID:', messageId);
            break;
          }
        } catch (error) {
          // Continue to next log if decoding fails
          continue;
        }
      }

      if (!messageId) {
        logError('Could not find message ID in transaction logs');
      }

      setBridgeStatus({
        isLoading: false,
        error: null,
        txHash: hash,
        messageId,
        success: true
      });

      log('Bridge transaction completed successfully:', {
        txHash: hash,
        messageId,
        ccipExplorer: messageId ? `https://ccip.chain.link/msg/${messageId}` : `https://ccip.chain.link/tx/${hash}`
      });

      return { hash, messageId };

    } catch (error) {
      logError('Bridge transaction failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setBridgeStatus({
        isLoading: false,
        error: errorMessage,
        txHash: null,
        messageId: null,
        success: false
      });
      throw error;
    }
  }, [walletClient, publicClient, address, chain, checkAllowance, approveToken, estimateFee, encodeExtraArgs, getTokenBalance, log, logError]);

  const getUSDLBalance = useCallback(async (network: keyof typeof NETWORK_CONFIG, userAddress: string) => {
    if (!publicClient) {
      throw new Error('Public client not available');
    }

    try {
      const tokenAddress = TOKEN_ADDRESSES[network]?.USDL;
      if (!tokenAddress) {
        throw new Error(`USDL token address not found for network: ${network}`);
      }

      const balance = await getTokenBalance(tokenAddress, userAddress, NETWORK_CONFIG[network]);
      return balance;
    } catch (error) {
      logError(`Error getting USDL balance on ${network}:`, error);
      throw error;
    }
  }, [publicClient, getTokenBalance, logError]);

  return {
    bridgeTokens,
    estimateFee,
    bridgeStatus,
    resetStatus,
    checkAllowance,
    getTokenBalance,
    getUSDLBalance
  };
};