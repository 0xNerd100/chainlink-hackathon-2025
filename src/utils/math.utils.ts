import { ethers } from "ethers";
import { defaultChain, supportedChains, config, referals } from "./config";

export const shortenPubkey = (address: string): string => {
  if (!address) {
    return "";
  }
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
};

export const toUnits = (
  value: string | number | bigint,
  decimals: number
): string | undefined => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return;
  }

  if (!decimals && decimals !== 0) {
    return;
  }

  // Convert to a safe BigInt format
  let bigIntValue: bigint;
  try {
    if (typeof value === "number") {
      bigIntValue = BigInt(Math.floor(value)); // Ensure integer
    } else {
      bigIntValue = BigInt(value.toString()); // Safe conversion for string/bigint
    }
  } catch (error) {
    console.error("Error converting to BigInt:", error);
    return;
  }

  const formatValue = ethers.formatUnits(bigIntValue, decimals);
  return Number(formatValue).toFixed(4);
};

export const fromUnits = (value: string | number, decimals: number): bigint => {
  return ethers.parseUnits(value.toString(), decimals);
};

export const validateChains = (chainId: number): boolean => {
  return supportedChains.includes(chainId);
};

export const getReferals = (addr: string | null) => {
  if (!addr) {
    return config[defaultChain].ico;
  } else if (addr?.length === 42) {
    return addr;
  } else if (addr?.length < 42) {
    //@ts-expect-error ignore
    return referals[addr] ?? config[defaultChain].ico;
  }
  return config[defaultChain].ico;
};
