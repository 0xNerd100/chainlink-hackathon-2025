"use client";
import { useState } from "react";
import { useChainId, useSwitchChain } from "wagmi";

import styled from "styled-components";

const logo = {
  ETH: "/assets/media/eth.svg",
  BNB: "/assets/media/bnb.svg",
  SepoliaETH: "/assets/media/eth.svg", // Using same ETH logo for Sepolia
};

const networkNames = {
  1: "ETH", // Ethereum Mainnet
  56: "BNB", // BSC Mainnet
  11155111: "SepoliaETH", // Ethereum Sepolia Testnet
};

function NetworkSwitcher() {
  const { chains, switchChain } = useSwitchChain();
  const chainId = useChainId();
  
  // Function to get network symbol based on chain ID
  const getNetworkSymbol = (chainId: number) => {
    return networkNames[chainId as keyof typeof networkNames] || "ETH";
  };
  
  const [selected, setSelected] = useState(getNetworkSymbol(chainId));
  
  const handleNetwork = (chain: any) => {
    switchChain({ chainId: chain?.id });
    const networkSymbol = getNetworkSymbol(chain?.id);
    setSelected(networkSymbol);
  };

  return (
    <>
      <NetworkButton className="dropdown dropdown-bottom dropdown-end  ">
        <div
          tabIndex={0}
          role="button"
          className="h-[38px] flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] rounded px-2"
        >
          <img
            src={logo[selected as keyof typeof logo]}
            height={10000}
            width={10000}
            alt=""
            className="max-w-full h-[20px] w-[20px] object-contain rounded-full"
          />
          <span className="lg:block hidden">
            {selected === "SepoliaETH" ? "Sepolia" : selected}
          </span>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content text-black/80 menu bg-white border border-white/50 rounded-box z-1 w-52 p-2 shadow-sm mb-1"
        >
          {chains.map((chain) => (
            <li key={chain.id} className="">
              <button onClick={() => handleNetwork(chain)}>
                {chain.name}
                {chain.id === 11155111 && " (Testnet)"}
              </button>
            </li>
          ))}
        </ul>
      </NetworkButton>
    </>
  );
}

const NetworkButton = styled.div`
  .outside {
    -webkit-clip-path: polygon(
      90.12% 100%,
      100% 64.46%,
      100% 0%,
      70.71% 0%,
      12.42% 0%,
      0% 29.29%,
      0% 100%,
      29.29% 100%
    );
    clip-path: polygon(
      90.12% 100%,
      100% 64.46%,
      100% 0%,
      70.71% 0%,
      12.42% 0%,
      0% 29.29%,
      0% 100%,
      29.29% 100%
    );
    .inside {
      position: absolute;
      top: 1.5px;
      left: 1.5px;
      right: 1.5px;
      bottom: 1.5px;
      background-color: #072902e3;
      color: #26fa0f !important;
      -webkit-clip-path: polygon(
        90.12% 100%,
        100% 64.46%,
        100% 0%,
        70.71% 0%,
        12.42% 0%,
        0% 29.29%,
        0% 100%,
        29.29% 100%
      );
      clip-path: polygon(
        90.12% 100%,
        100% 64.46%,
        100% 0%,
        70.71% 0%,
        12.42% 0%,
        0% 29.29%,
        0% 100%,
        29.29% 100%
      );
    }
  }
`;

export default NetworkSwitcher;
