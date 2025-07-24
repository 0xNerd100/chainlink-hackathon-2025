import { parseAbi } from "viem";

export const BRIDGE_ROUTER_ABI = parseAbi([
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
