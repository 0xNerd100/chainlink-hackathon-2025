"use client";
import React from "react";
import TableLayout from "@/components/tableLayout";
import ProductTrendLineChart from "@/components/Charts/LineChart";
const Metrics = () => {
  const column = [
    {
      head: "Protocol",
      accessor: "Protocol",
      component: (item: any, key: number) => {
        return (
          <>
            <div className="flex items-center gap-3">
              <div className="imgWrp flex-shrink-0">
                <img
                  src={"/assets/media/usdLogo.png"}
                  alt=""
                  className="max-w-full h-[40px] w-[40px] object-contain"
                />
              </div>
              <div className="content">
                <p className="m-0 ">{item.Protocol}</p>
              </div>
            </div>
          </>
        );
      },
    },
    { head: "Category", accessor: "Category" },

    {
      head: "Launch Date",
      accessor: "LaunchDate",
    },
    {
      head: "Latest Audit",
      accessor: "LatestAudit",
    },
    {
      head: "Links",
      accessor: "",
      isComponent: true,
      component: (item: any) => (
        <div className="ActnBtn flex items-center  gap-5">
          <button className="flex items-center justify-center border-0 p-0 bg-transparent text-white gap-3">
            Website <span className="icn">{linkIcn}</span>
          </button>
          <button className="flex items-center justify-center border-0 p-0 bg-transparent text-white gap-3">
            Docs <span className="icn">{linkIcn}</span>
          </button>
        </div>
      ),
    },
  ];
  const data = [
    {
      Protocol: "DEXTools",
      Category: "Lending",
      LaunchDate: "April 30, 2025",
      LatestAudit: "March 20, 2025",
    },
    {
      Protocol: "DEXTools",
      Category: "Lending",
      LaunchDate: "April 30, 2025",
      LatestAudit: "March 20, 2025",
    },
    {
      Protocol: "DEXTools",
      Category: "Lending",
      LaunchDate: "April 30, 2025",
      LatestAudit: "March 20, 2025",
    },
  ];
  const assetColumn = [
    {
      head: "Protocol",
      accessor: "Protocol",
      component: (item: any, key: number) => {
        return (
          <>
            <div className="flex items-center gap-3">
              <div className="imgWrp flex-shrink-0">
                <img
                  src={"/assets/media/usdLogo.png"}
                  alt=""
                  className="max-w-full h-[40px] w-[40px] object-contain"
                />
              </div>
              <div className="content">
                <p className="m-0 ">{item.Protocol}</p>
              </div>
            </div>
          </>
        );
      },
    },
    {
      head: "Asset progress",
      accessor: "AssetProgress",
      component: (item: any, key: number) => {
        return (
          <>
            <div className="flex items-center gap-3 min-w-[350px]">
              <p className="m-0">{item.AssetProgress}</p>
              <div className="relative min-w-[300] w-full rounded bg-[#060708]/30 p-2">
                <div
                  className="absolute h-full left-0 top-0 bg-white rounded"
                  style={{ width: `${item.AssetProgress}%` }}
                ></div>
              </div>
            </div>
          </>
        );
      },
    },
    {
      head: "Money Raised",
      accessor: "MoneyRaised",
    },
  ];

  const assetData = [
    { Protocol: "USDL", AssetProgress: "86.24", MoneyRaised: "$6.2M" },
    { Protocol: "USDL", AssetProgress: "86.24", MoneyRaised: "$6.2M" },
    { Protocol: "USDL", AssetProgress: "86.24", MoneyRaised: "$6.2M" },
    { Protocol: "USDL", AssetProgress: "86.24", MoneyRaised: "$6.2M" },
  ];
  return (
    <>
      <section className="py-10 relative">
        <div className="container">
          <div className="grid gap-x-4 gap-y-[60px] grid-cols-12">
            <div className="col-span-12">
              <div className="head border-b border-white pb-2 mb-4">
                <h4 className="m-0 2xl:text-[22px] text-[18px]">Preformance</h4>
              </div>
              <div className="grid gap-4 grid-cols-12">
                <div className="md:col-span-6 col-span-12">
                  <div className="box h-full">
                    <div className="inner p-5 h-full">
                      <div className="top flex items-center justify-between gap-3 pb-5 flex-wrap">
                        <h4 className="m-0 font 2xl:text-[30px] text-[24px]">
                          USDL Supply
                        </h4>
                        <p className="m-0 md:text-[14px] text-xs">
                          Updated April 24, 2025
                        </p>
                      </div>
                      <ProductTrendLineChart
                        series={[
                          {
                            name: "Desktops",
                            data: [10, 41, 35, 51],
                          },
                        ]}
                      />
                      <div className="bottom flex items-center justify-between gap-3 flex-wrap pt-4">
                        <div className="left flex items-center gap-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded bg-white flex-shrink-0 w-[20px] h-[20px]"></div>
                            <p className="m-0 2xl:text-[20px]">USDL Supply</p>
                          </div>
                        </div>
                        <div className="right flex items-center gap-3">
                          <button className="rounded border-[2px] text-[16px] px-3 py-1 border-white transition duration-[200ms] text-white">
                            2W
                          </button>
                          <button className="rounded border-[2px] text-[16px] px-3 py-1 border-white transition duration-[200ms] text-black bg-white ">
                            4W
                          </button>
                          <button className="rounded border-[2px] text-[16px] px-3 py-1 border-white transition duration-[200ms] text-white">
                            All Time
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-6 col-span-12">
                  <div className="box h-full">
                    <div className="inner p-5 h-full">
                      <div className="top flex items-center justify-between gap-3 pb-5 flex-wrap">
                        <h4 className="m-0 font 2xl:text-[30px] text-[24px]">
                          LNDR APY
                        </h4>
                        <p className="m-0 md:text-[14px] text-xs">
                          Updated April 24, 2025
                        </p>
                      </div>
                      <ProductTrendLineChart
                        series={[
                          {
                            name: "Desktops",
                            data: [10, 41, 35, 51],
                          },
                          {
                            name: "Desktops",
                            data: [40, 31, 55, 39],
                          },
                        ]}
                      />
                      <div className="bottom flex items-center justify-between gap-3 flex-wrap pt-4">
                        <div className="left flex items-center gap-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded bg-white flex-shrink-0 w-[20px] h-[20px]"></div>
                            <p className="m-0 2xl:text-[20px]">USDL Supply</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="rounded bg-[#EEEDED]/50 flex-shrink-0 w-[20px] h-[20px]"></div>
                            <p className="m-0 2xl:text-[20px]">US Treasury</p>
                          </div>
                        </div>
                        <div className="right flex items-center gap-3">
                          <button className="rounded border-[2px] text-[16px] px-3 py-1 border-white transition duration-[200ms] text-white">
                            2W
                          </button>
                          <button className="rounded border-[2px] text-[16px] px-3 py-1 border-white transition duration-[200ms] text-black bg-white ">
                            4W
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
            <div className="col-span-12">
              <div className="head border-b border-white pb-2 mb-4">
                <h4 className="m-0 2xl:text-[22px] text-[18px]">
                  Strategy Deplovement
                </h4>
              </div>
              <div className="grid gap-4 grid-cols-12">
                <div className="md:col-span-6 col-span-12">
                  <div className="box h-full">
                    <div className="inner p-5 h-full">
                      <div className="top flex items-center justify-between gap-3 pb-5 flex-wrap">
                        <h4 className="m-0 font 2xl:text-[30px] text-[24px]">
                          Asset Breakdown
                        </h4>
                        <p className="m-0 md:text-[14px] text-xs">
                          Updated April 24, 2025
                        </p>
                      </div>
                      <div className="conetnBody pb-[50px] pt-[20px]">
                        {/* <ul className="list-none pl-0 mb-0">
                          <li className="py-2"></li>
                        </ul> */}
                        <TableLayout
                          column={assetColumn}
                          columnView={false}
                          data={assetData}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-6 col-span-12">
                  <div className="box h-full">
                    <div className="inner p-5 h-full">
                      <div className="top flex items-center justify-between gap-3 pb-5 flex-wrap">
                        <h4 className="m-0 font 2xl:text-[30px] text-[24px]">
                          Asset Location
                        </h4>
                        <p className="m-0 md:text-[14px] text-xs">
                          Updated April 24, 2025
                        </p>
                      </div>
                      <div className="conetnBody pb-[50px] pt-[20px]">
                        {/* <ul className="list-none pl-0 mb-0">
                          <li className="py-2"></li>
                        </ul> */}
                        <TableLayout
                          column={assetColumn}
                          columnView={false}
                          data={assetData}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12">
              <div className="head border-b border-white pb-2 mb-4">
                <h4 className="m-0 2xl:text-[22px] text-[18px]">
                  Protocol Interactions
                </h4>
              </div>
              <div className="box">
                <div className="inner p-5 h-full">
                  <TableLayout column={column} data={data} columnView={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Metrics;

const linkIcn = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 31 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <rect width="31" height="31" fill="url(#pattern0_0_2640)" />
    <defs>
      <pattern
        id="pattern0_0_2640"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use xlinkHref="#image0_0_2640" transform="scale(0.0111111)" />
      </pattern>
      <image
        id="image0_0_2640"
        width="90"
        height="90"
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAACRElEQVR4nO3cSU4bQRSH8QIpDFEOAPcJZyHDYVAYBDvuwAJxAUSmo6AMIpgdHyrxFgS5AaN6r57d/5/kFU119+dS2+5uuxQRERERERHpB3gLHAB/aOcS+AKsd9y1XIAj/Oz03r8UgGVg4hj6svc+jiX0be99HMuhg977lwawDuwBvxU6EWAFONGMThRZh46gyAodFFmhZwCsAqfP9Bz8+yzrGi1eNpPPgLUuoW0DPwMXwD/ymQBbjWbyqi0/lWfkTeAneU1aRw4PbTN5dJGroQWLBztcjC5yNbRw8QB8ZYSRq6F/KB6AK3JGft/q3cUTY4SGjltZIy0i2zgK7R3ZxlJo78g2nkK3fuGbZuB89q/iIfRZTRTZxt2fMs7ua7dzrkPjFPnBlZp6WezaHodutxtkDo1j5EfrWaqPdls+R6FpFPm5Dz1hMoam3fvkrfrhp2SQLTSNI/eeNClD4xBZoYMiK3RQZIV2eAs3dE9eyWBoz4LWvTK35y5m1WvjaBzZxlRo78g2rkJ7R7axFTri3IVCG7un2SWyja8Zzf1XIq69Iiv0/6FvvCLbOjSjK+DYK7KNr9AV8M5i39j9JDutItv4Cv2Q19UMhQ6i0EEUOohCB1HoIAodRKGDKHQQhQ6i0EEUOohCB1HoIAodRKGDKHQQhQ6i0EEUOohCB8keOuOvG7T0t2Rgv6G0yM5LBsAnFtuHkoHdRvuDxfQNeFOyADaA7yxe5I2STX3mgY/1mDbHL5BXtv3bqWayiIiIiIiIiEjJ7Q5Ia9XvvzH68wAAAABJRU5ErkJggg=="
      />
    </defs>
  </svg>
);
