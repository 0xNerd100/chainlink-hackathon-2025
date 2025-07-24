"use client";
import Image from "next/image";
import React, { use } from "react";
import BarChart from "@/components/Charts/BarChart";
import { useBalance, useReadContract, useAccount } from 'wagmi';



const Portfolio = () => {
  const tokenAddress = "0xB7217747Ab3592Dd5Ec3C82640b3ec6dF5D93b9D";
  const targetAddress = useAccount().address;
  console.log("Target Address", targetAddress);

    // Fetch token balance
  const { data: balance, isLoading: balanceLoading, refetch: refetchBalance } = useBalance({
    address:targetAddress,
    token: "0xB7217747Ab3592Dd5Ec3C82640b3ec6dF5D93b9D" as `0x${string}`,
    chainId:11155111,
    query: {
      enabled: !!tokenAddress && !!targetAddress,
    },
  });
  console.log("USDL Balance", balance?.value);

  return (
    <>
      <section className="relative py-10">
        <div className="container">
          <div className="grid gap-x-4 gap-y-[100px] grid-cols-12">
            <div className="col-span-12">
              <div className="head border-b border-white pb-2 mb-4">
                <h4 className="m-0 2xl:text-[22px] text-[18px]">
                  RAWL Token Balances

                </h4>
              </div>
              <div className="grid gap-4 grid-cols-12">
                {[1, 2, 4].map((item, key) => (
                  <div
                    key={key}
                    className="lg:col-span-4 sm:col-span-6 col-span-12"
                  >
                    <div className="box h-full">
                      <div className="inner p-5 h-full">
                        <div className="flex flex-col lg:gap-[50px] gap-[30px] justify-between">
                          <div className="flex items-center justify-between gap-2">
                            <div className="left flex items-center gap-2">
                              <div className="icnWrp">
                                <Image
                                  src={"/assets/media/usdLogo.png"}
                                  alt="token"
                                  height={10000}
                                  width={10000}
                                  className="max-w-full h-[40px] w-auto"
                                />
                              </div>
                              <div className="content">
                                <h6 className="m-0 leading-tight text-white text-[24px]">
                                  USDL
                                </h6>
                                <p className="m-0 text-[12px] leading-tight">
                                  $1.00
                                </p>
                              </div>
                            </div>
                            <div className="right">
                              <button className="flex text-[12px] items-center gap-2">
                                0x47ht....Rt75{" "}
                                <span className="icn">{copyIcn}</span>
                              </button>
                            </div>
                          </div>
                          <div className="">
                            <p className="m-0 text-[12px] leading-tight font-medium">
                              Balance
                            </p>
                            <h4 className="m-0 text-white leading-tight text-[24px] font-medium">
                                {balance && balance?.value /BigInt(1e18)}
                            </h4>
                            <span className="text-[10px] leading-tight block font-medium">
                              $0.00
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="flex items-center justify-center gap-3 h-[40px] rounded bg-white text-[#000] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-white hover:bg-transparent hover:text-white">
                              Swap
                            </button>
                            <button className="flex items-center justify-center gap-3 h-[40px] rounded hover:bg-white hover:text-[#000] text-[#fff] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-white">
                              Redeem
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-12">
              <div className="head border-b border-white pb-2 mb-4">
                <h4 className="m-0 2xl:text-[22px] text-[18px]">
                  RAWL Balance
                </h4>
              </div>
              <div className="box">
                <div className="inner p-5 h-full">
                  <div className="grid gap-4 grid-cols-12">
                    <div className="md:col-span-4 sm:col-span-6 col-span-12">
                      <div className="flex flex-col lg:gap-[50px] gap-[30px] justify-between">
                        <div className="flex items-center justify-between gap-2">
                          <div className="left flex items-center gap-2">
                            <div className="icnWrp">
                              <Image
                                src={"/assets/media/usdLogo.png"}
                                alt="token"
                                height={10000}
                                width={10000}
                                className="max-w-full h-[40px] w-auto"
                              />
                            </div>
                            <div className="content">
                              <h6 className="m-0 leading-tight text-white text-[24px]">
                                USDL
                              </h6>
                              <p className="m-0 text-[12px] leading-tight">
                                $1.00
                              </p>
                            </div>
                          </div>
                          <div className="right">
                            <button className="flex text-[12px] items-center gap-2">
                              0x47ht....Rt75{" "}
                              <span className="icn">{copyIcn}</span>
                            </button>
                          </div>
                        </div>
                        <div className="">
                          <div className="grid gap-3 grid-cols-12">
                            <div className="col-span-6">
                              <p className="m-0 text-[12px] leading-tight font-medium">
                                Balance
                              </p>
                              <h4 className="m-0 text-white leading-tight text-[24px] font-medium">
                                0.00 USDL
                              </h4>
                              <span className="text-[10px] leading-tight block font-medium">
                                $0.00
                              </span>
                            </div>
                            <div className="col-span-6">
                              <p className="m-0 text-[12px] leading-tight font-medium">
                                Balance
                              </p>
                              <h4 className="m-0 text-white leading-tight text-[24px] font-medium">
                                0.00 USDL
                              </h4>
                              <span className="text-[10px] leading-tight block font-medium">
                                $0.00
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="flex items-center justify-center gap-3 h-[40px] rounded bg-white text-[#000] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-white hover:bg-transparent hover:text-white">
                            Stake
                          </button>
                          <button className="flex items-center justify-center gap-3 h-[40px] rounded hover:bg-white hover:text-[#000] text-[#fff] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-white">
                            Unstake
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-8 sm:col-span-6 col-span-12">
                      <div className="pl-5 border-l border-white/40">
                        <div className="top flex items-center justify-between gap-3 pb-5 flex-wrap">
                          <h4 className="m-0 font 2xl:text-[30px] text-[24px]">
                            APY
                          </h4>
                          <p className="m-0 md:text-[14px] text-xs">
                            <span className="2xl:text-[30px] text-[24px]">
                              7.88%
                            </span>{" "}
                            APY
                          </p>
                        </div>
                        <BarChart />
                        <div className="bottom flex items-center justify-between gap-3 flex-wrap">
                          <div className="left flex items-center gap-3">
                            <div className="">
                              <div className="flex items-center gap-3">
                                <div className="rounded bg-white flex-shrink-0 w-[20px] h-[20px]"></div>
                                <p className="m-0 2xl:text-[20px]">1 Wk APY</p>
                              </div>
                              <p className="m-0 text-white">
                                Last Updated: April 28, 2025
                              </p>
                            </div>
                          </div>
                          <div className="right flex items-center gap-3">
                            <button className="rounded border-[2px] text-[16px] px-3 py-1 border-white transition duration-[200ms] text-white">
                              1 Week
                            </button>
                            <button className="rounded border-[2px] text-[16px] px-3 py-1 border-white transition duration-[200ms] text-black bg-white ">
                              7 Weeks
                            </button>
                            <button className="rounded border-[2px] text-[16px] px-3 py-1 border-white transition duration-[200ms] text-white">
                              All Time
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Portfolio;

const copyIcn = (
  <svg
    width="13"
    height="14"
    viewBox="0 0 13 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.25564 3.57144H3C1.89543 3.57144 1 4.46687 1 5.57144V11C1 12.1046 1.89543 13 3 13H7.57143C8.676 13 9.57143 12.1046 9.57143 11V10.4286"
      stroke="white"
      strokeWidth="1.2"
    />
    <path
      d="M10.143 10.4286H5.57153C4.46696 10.4286 3.57153 9.53314 3.57153 8.42857V3C3.57153 1.89543 4.46696 1 5.57153 1H10.143C11.2475 1 12.143 1.89543 12.143 3V8.42857C12.143 9.53314 11.2475 10.4286 10.143 10.4286Z"
      stroke="white"
      strokeWidth="1.2"
    />
  </svg>
);
