import { parseAbi } from "viem";

export const ONRAMP_ABI = parseAbi([
  'struct TokenAmount { address token; uint256 amount; }',
  'struct EVM2AnyMessage { bytes receiver; bytes data; TokenAmount[] tokenAmounts; address feeToken; bytes extraArgs; }',
  'event CCIPMessageSent(uint64 indexed destinationChainSelector, bytes32 indexed messageId, EVM2AnyMessage message, uint256 feeTokenAmount, address feeToken)'
]);