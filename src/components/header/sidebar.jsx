import Link from "next/link";
import { useRouter } from "next/navigation";

import React from "react";
import styled from "styled-components";

const Sidebar = ({ menu, setMenu }) => {
  const router = useRouter();

  return (
    <>
      <SidebarCstm className="fixed lg:hidden bg-black z-[9999] top-[0] shadow max-w-[373px] w-full py-14 px-5 flex flex-col justify-between">
        <button
          onClick={() => setMenu(!menu)}
          className="border-0 p-0 absolute top-2 right-2"
        >
          {closeToggle}
        </button>
        <ul className=" left-0 right-0 menuList mx-auto list-none pl-0 mb-0 gap-10 lg:px-3 w-full">
          <li className=" border-b boder-[#E6E8EC] py-3">
            <Link
              onClick={() => setMenu(!menu)}
              href="/#home"
              className="active uppercase font-medium relative pb-[1px]  hover:text-[#68dfd0]"
            >
              Home
            </Link>
          </li>
          <li className=" border-b boder-[#E6E8EC] py-3">
            <Link
              onClick={() => setMenu(!menu)}
              href="/#about"
              className="uppercase font-medium relative pb-[1px]  hover:text-[#68dfd0]"
            >
              About
            </Link>
          </li>
          <li className=" border-b boder-[#E6E8EC] py-3">
            <Link
              onClick={() => setMenu(!menu)}
              href="/#howitwork"
              className="uppercase font-medium relative pb-[1px]  hover:text-[#68dfd0]"
            >
              Features
            </Link>
          </li>
          <li className=" border-b boder-[#E6E8EC] py-3">
            <Link
              onClick={() => setMenu(!menu)}
              href="/#faq"
              className="uppercase font-medium relative pb-[1px]  hover:text-[#68dfd0]"
            >
              fAQ
            </Link>
          </li>
        </ul>
        <ul className="list-none pl-0 mb-0 ">
          <li className="py-2">
            <Link
              onClick={() => setMenu(!menu)}
              href={"/#getintouch"}
              className="flex items-center justify-center bg-[#79F4E4] uppercase rounded-[10px] h-[55px] text-[#000] font-bold text-[16px] px-5 w-full"
            >
              Getting Started
            </Link>
          </li>
        </ul>
      </SidebarCstm>
    </>
  );
};

const SidebarCstm = styled.div`
  height: 100%;
`;

export default Sidebar;

const closeToggle = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.363281"
      y="14.1426"
      width="20"
      height="1.6"
      rx="0.8"
      transform="rotate(-45 0.363281 14.1426)"
      fill="#fff"
    />
    <rect
      x="1.49609"
      y="0.163086"
      width="20"
      height="1.6"
      rx="0.8"
      transform="rotate(45 1.49609 0.163086)"
      fill="#fff"
    />
  </svg>
);
