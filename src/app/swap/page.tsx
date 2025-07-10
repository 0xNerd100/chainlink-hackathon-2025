"use client";
import React, { useState } from "react";
import SwapCard from "./swapCard";
import RedeemptionCard from "./ReedemtionCard";

const Swap = () => {
  const tabData = [
    {
      id: 1,
      title: "Swap",
      component: (
        <>
          <SwapCard />
        </>
      ),
    },
    {
      id: 2,
      title: "Redeem",
      component: (
        <>
          <RedeemptionCard />
        </>
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
              <div className="mx-auto max-w-[540px]">
                <div className="flex items-center gap-3 mb-3">
                  {tabData.map((item) => (
                    <button
                      onClick={() => handleTab(item.id)}
                      className={`${
                        tab == item.id
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

export default Swap;
