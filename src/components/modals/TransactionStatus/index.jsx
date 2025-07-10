import Image from "next/image";
import { ethers } from "ethers"; // css

import React, { useState } from "react";

const TransactionStatusPop = ({ transactionStatus, setTransactionStatus }) => {
  const handleTransactionStatus = () => {
    setTransactionStatus(!transactionStatus);
  };
  async function importTokenToWallet(
    tokenAddress,
    tokenSymbol,
    tokenDecimals,
    tokenImage = ""
  ) {
    try {
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found. Please install MetaMask.");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);

      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log("Token successfully added to wallet!");
      } else {
        console.log("Token was not added to wallet.");
      }
    } catch (error) {
      console.error("Error adding token to wallet:", error);
    }
  }
  return (
    <>
      <div
        className={` fixed inset-0 flex items-center justify-center cstmModal z-[9999] p-5`}
      >
        <div
          onClick={handleTransactionStatus}
          className="absolute inset-0 bg-black opacity-90"
        ></div>
        <div
          className={`modalDialog p-2 mx-auto rounded-[20px] backdrop-blur-[6px] md:p-[20px] z-10 bg-[#1d1d1d] max-w-[400px] overflow-auto w-full`}
        >
          <div className="py-2 flex justify-center mb-2">{tickIcn}</div>
          <div className="text-center mt-8">
            <p className="m-0 text-[26px] themeClr font-bold">
              Transaction Completed!
            </p>
            <div className="mt-4 flex flex-col gap-3 text-center">
              <button
                onClick={() =>
                  importTokenToWallet(
                    "0x70bfbBc660E73551FAb37587Dc4db223d50DB0b0", // USDT
                    "GMC",
                    18
                    // "https://cryptologos.cc/logos/tether-usdt-logo.png"
                  )
                }
                className="flex items-center rounded-full justify-center px-3 h-[45px] bg-[#EFC139] transition duration-[400ms] hover:bg-[#1F8F3E] w-full"
              >
                Import GMC
              </button>
              <button
                onClick={handleTransactionStatus}
                className="text-[#EFC139] font-medium text-[14px]"
              >
                Back to Sale!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionStatusPop;

const tickIcn = (
  <svg
    width="80"
    height="80"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_1_2)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 7.5C0 5.51088 0.790176 3.60322 2.1967 2.1967C3.60322 0.790176 5.51088 0 7.5 0C9.48912 0 11.3968 0.790176 12.8033 2.1967C14.2098 3.60322 15 5.51088 15 7.5C15 9.48912 14.2098 11.3968 12.8033 12.8033C11.3968 14.2098 9.48912 15 7.5 15C5.51088 15 3.60322 14.2098 2.1967 12.8033C0.790176 11.3968 0 9.48912 0 7.5ZM7.072 10.71L11.39 5.312L10.61 4.688L6.928 9.289L4.32 7.116L3.68 7.884L7.072 10.71Z"
        fill="#198619"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_2">
        <rect width="15" height="15" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
