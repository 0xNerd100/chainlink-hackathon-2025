import React from "react";

const Bridge = () => {
  return (
    <>
      <section className="py-10 relative">
        <div className="container">
          <div className="grid gap-4 grid-cols-12">
            <div className="col-span-12">
              <div className="mx-auto max-w-[540px]">
                <div className="box h-full">
                  <div className="inner p-5 h-full">
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <label
                              htmlFor=""
                              className="m-0 text-[#E2E2E2] font-medium"
                            >
                              From
                            </label>
                            <div className="dropdown dropdown-end">
                              <div
                                tabIndex={0}
                                role="button"
                                className="h-[38px] min-w-[115px] inline-flex justify-center items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2"
                              >
                                Select {downIcn}
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
                          <div className="p-3 flex items-center justify-between relative gap-3 rounded-[10px] bg-[#060708]/30">
                            <div className="left">
                              <p className="m-0 text-xs">Send</p>
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
                                  className="h-[38px] min-w-[115px] justify-center flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2"
                                >
                                  USDL {downIcn}
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
                        </div>
                        <div className="">
                          <div className="text-right">
                            <button className="inline-flex items-center justify-center bg-[rgba(6,7,8,0.3)] rounded-[5px] p-2">
                              {swapIcn}
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <label
                              htmlFor=""
                              className="m-0 text-[#E2E2E2] font-medium"
                            >
                              From
                            </label>
                            <div className="dropdown dropdown-end">
                              <div
                                tabIndex={0}
                                role="button"
                                className="h-[38px] min-w-[115px] inline-flex justify-center items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2"
                              >
                                Select {downIcn}
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
                              <div className="dropdown dropdown-end">
                                <div
                                  tabIndex={0}
                                  role="button"
                                  className="h-[38px] min-w-[115px] justify-center flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] text-black bg-[#F3F5F8] rounded px-2"
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
                        </div>
                      </div>
                      <div className="px-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <p className="m-0 flex items-center gap-2 text-xs">
                              Gas Fee <span className="icn">{infoIcn}</span>
                            </p>
                            <p className="m-0 flex items-center gap-2 text-xs">
                              -
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="m-0 flex items-center gap-2 text-xs">
                              Estimated Time{" "}
                              <span className="icn">{infoIcn}</span>
                            </p>
                            <p className="m-0 flex items-center gap-2 text-xs">
                              -
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="btnWrpper">
                        <button className="flex w-full items-center justify-center gap-3 h-[50px] rounded-[10px] bg-white text-[#000] transition duration-[400ms] font-medium px-4 min-w-[100px] border-[2px] border-white hover:bg-transparent hover:text-white">
                          Bridge Tokens
                        </button>
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

export default Bridge;

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

const swapIcn = (
  <svg
    width="21"
    height="18"
    viewBox="0 0 21 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.5 5.33317L5.5 1.6665M5.5 1.6665L1.5 5.33317M5.5 1.6665V16.3332"
      stroke="#F3F5F8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 12.6665L15.5 16.3332M15.5 16.3332L19.5 12.6665M15.5 16.3332V1.6665"
      stroke="#F3F5F8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
