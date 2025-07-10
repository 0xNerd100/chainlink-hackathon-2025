"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { usePathname, useRouter } from "next/navigation";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { shortenPubkey } from "@/utils/math.utils";
import NetworkSwitcher from "../common/NetworkSwitcher";

const Header = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const pathname = usePathname();
  console.log(pathname, "pagecheck");
  const [scroll, setScroll] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 50);
    });
  }, []);

  const connect = async () => {
    await open();
  };

  console.log(address, "addresscheck");

  return (
    <>
      <HeaderWrpper
        className={`${
          scroll && "active"
        }  w-full top-0 fixed bg-white/5 backdrop-blur-sm left-0 z-[999] siteHeader shadow py-2`}
      >
        <div className="container mx-auto">
          <nav className="flex items-center justify-between lg:flex-nowrap flex-wrap md:px-0 px-3 py-2">
            <Link href={"/#home"} className="flex-shrink-0">
              <img
                src={"./assets/media/logo.png"}
                alt="logo"
                className="max-w-full h-[42px] w-auto rounded-full "
                height={10000}
                width={10000}
              />
            </Link>
            <div className="right flex items-center gap-3">
              <div className="flex items-center gap-3 lg:hidden">
                {/* <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="h-[38px] flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] rounded px-2"
                  >
                    {ethIcn} {downIcn}
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
                </div> */}
                <NetworkSwitcher />
                <button
                  onClick={connect}
                  className="transition duration-[400ms] font-medium text-[#000] bg-white rounded-[5px] px-4 h-[38px] 2xl:h-[43px] 2xl:text-[20px] text-[14px]"
                >
                  {address ? shortenPubkey(address) : "Connect"}
                </button>
              </div>
              <button
                onClick={() => setMenu(!menu)}
                className="border-0 p-0 w-[30px] bg-transparent lg:hidden"
              >
                {menuToggle}
              </button>
            </div>
            <MobileMenu
              className={`${
                menu && "active"
              }  cstmMenu lg:flex lg:flex-nowrap w-full flex-wrap items-center justify-between lg:pl-5 lg:w-full gap-2 relative transition duration-[400ms]`}
            >
              <div className="flex items-center justify-between lg:hidden border-b border-dashed border-white/50 pb-2">
                <Link href={"/#home"} className="flex-shrink-0">
                  <img
                    src={"./assets/media/logo.png"}
                    alt="logo"
                    className="max-w-full h-[42px] w-auto rounded-full "
                    height={10000}
                    width={10000}
                  />
                </Link>
                <button
                  onClick={() => setMenu(!menu)}
                  className="absolute top-0 right-0 bg-transpatent border-0 p-2 "
                >
                  {crossIcn}
                </button>
              </div>
              <ul className="lg:w-auto w-full left-0 right-0 menuList list-none pl-0 mb-0 items-center flex lg:flex-row flex-col  gap-4 lg:gap-[35px]">
                <li className="">
                  <Link
                    onClick={() => setMenu(!menu)}
                    href={"/portfolio"}
                    className={`${
                      pathname === "/portfolio" || pathname === "/"
                        ? "text-white"
                        : "text-[#ddd]"
                    } transition duration-[400ms] font-medium  2xl:text-[20px] text-[14px] hover:text-white`}
                  >
                    Portfolio
                  </Link>
                </li>
                <li className="">
                  <Link
                    onClick={() => setMenu(!menu)}
                    href={"/swap"}
                    className={`${
                      pathname === "/swap" ? "text-white" : "text-[#ddd]"
                    } transition duration-[400ms] font-medium  2xl:text-[20px] text-[14px] hover:text-white`}
                  >
                    Swap
                  </Link>
                </li>
                <li className="">
                  <Link
                    onClick={() => setMenu(!menu)}
                    href={"/stake"}
                    className={`${
                      pathname === "/stake" ? "text-white" : "text-[#ddd]"
                    } transition duration-[400ms] font-medium  2xl:text-[20px] text-[14px] hover:text-white`}
                  >
                    Stake
                  </Link>
                </li>
                <li className="">
                  <Link
                    onClick={() => setMenu(!menu)}
                    href={"/bridge"}
                    className={`${
                      pathname === "/bridge" ? "text-white" : "text-[#ddd]"
                    } transition duration-[400ms] font-medium  2xl:text-[20px] text-[14px] hover:text-white`}
                  >
                    Bridge
                  </Link>
                </li>
                <li className="">
                  <Link
                    onClick={() => setMenu(!menu)}
                    href={"/metrics"}
                    className={`${
                      pathname === "/metrics" ? "text-white" : "text-[#ddd]"
                    } transition duration-[400ms] font-medium  2xl:text-[20px] text-[14px] hover:text-white`}
                  >
                    Metrics
                  </Link>
                </li>
                <li className="">
                  <Link
                    onClick={() => setMenu(!menu)}
                    href={"/guides"}
                    className={`${
                      pathname === "/guides" ? "text-white" : "text-[#ddd]"
                    } transition duration-[400ms] font-medium  2xl:text-[20px] text-[14px] hover:text-white`}
                  >
                    Guides
                  </Link>
                </li>
                <li className="">
                  <Link
                    onClick={() => setMenu(!menu)}
                    href={"/docs"}
                    className={`${
                      pathname === "/docs" ? "text-white" : "text-[#ddd]"
                    } transition duration-[400ms] font-medium  2xl:text-[20px] text-[14px] hover:text-white`}
                  >
                    Docs
                  </Link>
                </li>
                <li className="">
                  <Link
                    onClick={() => setMenu(!menu)}
                    href={"/feedback"}
                    className={`${
                      pathname === "/feedback" ? "text-white" : "text-[#ddd]"
                    } transition duration-[400ms] font-medium  2xl:text-[20px] text-[14px] hover:text-white`}
                  >
                    Feedback
                  </Link>
                </li>
              </ul>
              <ul className="lg:w-auto w-full left-0 right-0 menuList list-none pl-0 mb-0 items-center flex lg:flex-row flex-col  gap-4 lg:gap-[35px]">
                <li className="">
                  <span
                    onClick={() => setMenu(!menu)}
                    className="font-medium text-[#ddd] 2xl:text-[20px] text-[14px]"
                  >
                    APY <span className="font-bold">8.6%</span>
                  </span>
                </li>{" "}
                <li className="">
                  <span
                    onClick={() => setMenu(!menu)}
                    className="font-medium text-[#ddd] 2xl:text-[20px] text-[14px]"
                  >
                    TVL <span className="font-bold">$2.3M</span>
                  </span>
                </li>{" "}
                <li className="lg:block hidden">
                  <div className="flex items-center gap-3">
                    {/* <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="h-[38px] flex items-center gap-2 2xl:h-[43px] 2xl:text-[20px] text-[14px] border-[2px] border-[#F3F5F8] rounded px-2"
                      >
                        {ethIcn} {downIcn}
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
                    </div> */}
                    <NetworkSwitcher />
                    <button
                      onClick={connect}
                      className="transition duration-[400ms] font-medium text-[#000] bg-white rounded-[5px] px-4 h-[38px] 2xl:h-[43px] 2xl:text-[20px] text-[14px]"
                    >
                      {address ? shortenPubkey(address) : "Connect"}
                    </button>
                  </div>
                </li>
              </ul>
            </MobileMenu>
          </nav>
        </div>
      </HeaderWrpper>
    </>
  );
};

const HeaderWrpper = styled.header``;

const MobileMenu = styled.div`
  @media (max-width: 1024px) {
    position: fixed;
    left: 0;
    top: 0;
    background: #424d56;
    max-width: 300px;
    padding: 20px;
    height: 100vh;
    overflow: scroll;
    &:not(.active) {
      transform: translateX(-110%);
    }
    ul {
      gap: 0;
      li {
        padding: 15px 0;
        width: 100%;
        border-bottom: 1px dashed #dddddd24;
      }
    }
  }
`;

export default Header;

const crossIcn = (
  <svg
    width="11"
    height="11"
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.64016 0.27L5.50016 4.13L9.34016 0.29C9.42498 0.199717 9.52716 0.127495 9.64058 0.0776622C9.75399 0.0278298 9.87629 0.00141434 10.0002 0C10.2654 0 10.5197 0.105357 10.7073 0.292893C10.8948 0.48043 11.0002 0.734784 11.0002 1C11.0025 1.1226 10.9797 1.24439 10.9333 1.35788C10.8869 1.47138 10.8178 1.57419 10.7302 1.66L6.84016 5.5L10.7302 9.39C10.895 9.55124 10.9916 9.76959 11.0002 10C11.0002 10.2652 10.8948 10.5196 10.7073 10.7071C10.5197 10.8946 10.2654 11 10.0002 11C9.87272 11.0053 9.74557 10.984 9.62678 10.9375C9.508 10.8911 9.40017 10.8204 9.31016 10.73L5.50016 6.87L1.65016 10.72C1.56567 10.8073 1.46473 10.8769 1.35316 10.925C1.2416 10.9731 1.12163 10.9986 1.00016 11C0.734946 11 0.480592 10.8946 0.293056 10.7071C0.10552 10.5196 0.000162707 10.2652 0.000162707 10C-0.00216879 9.8774 0.0205781 9.75561 0.0670076 9.64212C0.113437 9.52862 0.18257 9.42581 0.270163 9.34L4.16016 5.5L0.270163 1.61C0.105348 1.44876 0.00870232 1.23041 0.000162707 1C0.000162707 0.734784 0.10552 0.48043 0.293056 0.292893C0.480592 0.105357 0.734946 0 1.00016 0C1.24016 0.003 1.47016 0.1 1.64016 0.27Z"
      fill="white"
    />
  </svg>
);

const menuToggle = (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="3.37217" width="24" height="3" rx="1.5" fill="white" />
    <rect y="11.3722" width="24" height="3" rx="1.5" fill="white" />
    <rect y="19.3722" width="24" height="3" rx="1.5" fill="white" />
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
      stroke="#F3F5F8"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const ethIcn = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 16 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.99988 0L0.629883 12.22L7.99988 16.574L15.3699 12.22L7.99988 0ZM7.99988 24L0.629883 13.617L7.99988 18L15.3699 13.617L7.99988 24Z"
      fill="white"
    />
  </svg>
);
