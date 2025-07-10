import { useAppKit } from "@reown/appkit/react";
import React from "react";
import { useAccount } from "wagmi";

const UnStakeCard = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const connect = async () => {
    await open();
  };
  return (
    <>
      <div className="box h-full">
        <div className="inner p-5 h-full">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
                <div className="left">
                  <p className="m-0 text-xs">You Spend</p>
                  <input
                    type="text"
                    placeholder="0.000"
                    className="border-0 p-0 max-w-[200px] text-2xl bg-transparent p-0 outline-0 text-white placeholder:text-white"
                  />
                </div>
                <div className="right">
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="h-[38px] flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2"
                    >
                      LsGOLD {downIcn}
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                    >
                      <li>
                        <a>Item 1</a>
                      </li>
                      <li>
                        <a>Item 2</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
                <div className="left">
                  <p className="m-0 text-xs">You Receive</p>
                  <input
                    type="text"
                    placeholder="0.000"
                    className="border-0 p-0 max-w-[200px] text-2xl bg-transparent p-0 outline-0 text-white placeholder:text-white"
                  />
                </div>
                <div className="right">
                  <p className="m-0 text-2xl text-white">USDL</p>
                </div>
              </div>
            </div>
            <div className="px-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="m-0 flex items-center gap-2 text-xs">
                    Withdraw Delay Time <span className="icn">{infoIcn}</span>
                  </p>
                  <p className="m-0 flex items-center gap-2 text-xs">7 days</p>
                </div>
              </div>
            </div>
            <div className="btnWrpper">
              {address ? (
                <>
                  <button className="flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] bg-white text-[#000] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-white hover:bg-transparent hover:text-white">
                    Unstake
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={connect}
                    className="flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] bg-white text-[#000] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-white hover:bg-transparent hover:text-white"
                  >
                    Connect Wallet
                  </button>
                </>
              )}
            </div>
            <div className="">
              <div className="rounded bg-[#060708]/30 py-3 px-3 text-xs flex justify-center items-center gap-2">
                <span className="icn">{warningIcn}</span>
                Unstaking new tokens will reset the 7 day delay timer.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnStakeCard;

const warningIcn = (
  <svg
    width="19"
    height="16"
    viewBox="0 0 19 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.40239 1.63055L1.7185 13.0886C1.22425 13.936 1.83541 15 2.81633 15H16.1841C17.1651 15 17.7761 13.936 17.2819 13.0886L10.598 1.63055C10.1076 0.789816 8.89283 0.789816 8.40239 1.63055Z"
      stroke="#DDDDDD"
      strokeWidth="1.71"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 5.46777V9.59837"
      stroke="#DDDDDD"
      strokeWidth="1.71"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.50036 12.4582C9.32488 12.4582 9.18262 12.316 9.18262 12.1405C9.18262 11.965 9.32488 11.8228 9.50036 11.8228"
      stroke="#DDDDDD"
      strokeWidth="1.71"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.50049 12.4582C9.67597 12.4582 9.81823 12.316 9.81823 12.1405C9.81823 11.965 9.67597 11.8228 9.50049 11.8228"
      stroke="#DDDDDD"
      strokeWidth="1.71"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

const downIcn = (
  <svg
    width="15"
    height="8"
    viewBox="0 0 15 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 1.5L7.5 5.5L13 1.56897"
      stroke="#000"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);
