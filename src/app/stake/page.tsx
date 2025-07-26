"use client";
import React, { useState } from "react";
import StakeCard from "./StakeCard";
import UnStakeCard from "./UnStakeCard";
import WithdrawCard from "./WithdrawCard";

const Stake = () => {
  const lsGoldVault = "0x311c3e8beBe51082c1D6FFB3755375D945f9c6db";
  const lsUsreVault = "0x8a3A9a698aBD7b4DaE4c6A083542F6a4208C7D64";
  const lsSP500Vault = "0xfD03191876983b1dDF21a2a551371291CD0bbC87";
  const lsUsaiVault = "0x8591566C2cF6761679A71990031E742388FbAFd8";
  const xRwalVault = "0x6D055dE49e9df5D10D462269192dadEd8f835ffA";

  const tabData = [
    {
      id: 1,
      title: "Stake",
      component: (
        <div className="flex flex-wrap gap-10 justify-center">
          <div className="flex-shrink-3 w-full sm:w-auto sm:max-w-[calc(33.333%-0.75rem)]">
            <StakeCard vault={lsGoldVault} buttonText={"LsGOLD"} />
          </div>
          <div className="flex-shrink-3 w-full sm:w-auto sm:max-w-[calc(33.333%-0.75rem)]">
            <StakeCard vault={lsUsreVault} buttonText={"LsUSRE"} />
          </div>
          <div className="flex-shrink-3 w-full sm:w-auto sm:max-w-[calc(33.333%-0.75rem)]">
            <StakeCard vault={lsSP500Vault} buttonText={"LsSP500"} />
          </div>
          <div className="flex-shrink-3 w-full sm:w-auto sm:max-w-[calc(33.333%-0.75rem)]">
            <StakeCard vault={lsUsaiVault} buttonText={"LsUsAI"} />
          </div>
            <div className="flex-shrink-3 w-full sm:w-auto sm:max-w-[calc(33.333%-0.75rem)]">
            <StakeCard vault={xRwalVault} buttonText={"XRWAL"} />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Unstake",
      component: (
        <div className="flex flex-wrap gap-10 justify-center">
          <div className="flex-shrink-0 w-full sm:w-auto sm:max-w-[calc(33.333%-0.75rem)]">
            <UnStakeCard />
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Withdraw",
      component: (
        <div className="flex flex-wrap gap-10 justify-center">
          <div className="flex-shrink-3 w-full sm:w-auto sm:max-w-[calc(33.333%-0.75rem)]">
            <WithdrawCard vault={lsGoldVault} buttonText={"LsGOLD"} />
          </div>
          <div className="flex-shrink-3 w-full sm:w-auto sm:max-w-[calc(33.333%-0.75rem)]">
            <WithdrawCard vault={lsUsreVault} buttonText={"LsUSRE"} />
          </div>
          <div className="flex-shrink-3 w-full sm:w-auto sm:max-w-[calc(33.333%-0.75rem)]">
            <WithdrawCard vault={lsSP500Vault} buttonText={"LsSP500"} />
          </div>
          <div className="flex-shrink-3 w-full sm:w-auto sm:max-w-[calc(33.333%-0.75rem)]">
            <WithdrawCard vault={lsUsaiVault} buttonText={"LsUsAI"} />
          </div>
          <div className="flex-shrink-3 w-full sm:w-auto sm:max-w-[calc(33.333%-0.75rem)]">
            <WithdrawCard vault={xRwalVault} buttonText={"XRWAL"} />
          </div>
        </div>
      ),
    },
  ];
  const [tab, setTab] = useState<number>(1); // optional: default value can be 0

  const handleTab = (id: number) => {
    setTab(id);
  };
  return (
    <>
      <section className="py-10 relative">
        <div className="container">
          <div className="grid gap-4 grid-cols-12">
            <div className="col-span-12">
              <div className="mx-auto max-w-[1200px]">
                <div className="flex items-center gap-3 mb-3">
                  {tabData.map((item) => (
                    <button
                      onClick={() => handleTab(item.id)}
                      className={`${tab == item.id
                          ? "active text-white border-[#4c5156] backdrop-blur-[21px] shadow-[inset_-5px_-5px_250px_rgba(255,255,255,0.02)] bg-[radial-gradient(100%_100%_at_0%_0%,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_100%)]"
                          : "border-transparent"
                        } flex items-center justify-center px-4 py-1 rounded-[10px] border font-medium text-[16px]`}
                      key={item.id}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
                <div className="content">
                  {" "}
                  {tabData.find((item) => item.id === tab)?.component}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Stake;