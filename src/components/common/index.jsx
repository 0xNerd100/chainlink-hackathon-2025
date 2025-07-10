import { useState, useEffect, useRef } from "react";
// css
import { AccordionItemWrpper, CstmDropdown, YellowBtn } from "./commonStyled";
import { useRouter } from "next/router";

// accordion item
export const AccordionItem = ({
  title,
  children,
  btnClass,
  svg,
  btnIcnClass,
  isOpen,
  onClick,
  wrpperClass,
}) => {
  return (
    <AccordionItemWrpper className={`${wrpperClass} AccordionItem`}>
      <button
        className={`${btnClass} ${isOpen && "active"}  accordionBtn w-full `}
        onClick={onClick}
      >
        {svg && <span className={`${btnIcnClass}`}>{svg}</span>}
        <span>{title}</span>
        <span
          className={` accordionIcn arrow inline-flex items-center justify-center absolute right-2`}
        >
          {arrowDown}
        </span>
      </button>
      {isOpen && (
        <div className="relative accordionBody py-2 px-3">{children}</div>
      )}
    </AccordionItemWrpper>
  );
};

export const CstmPagination = () => {
  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <p className="m-0 text-gray-400 font-normal text-xs">
          Showing 1 to 8 of 32
        </p>
        <ul
          className={`${styles.paginationWrp} list-none pl-0 mb-0 flex items-center gap-2`}
        >
          <li className="px-1">
            <button className="border-0 p-0 transparent flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
              >
                <g filter="url(#filter0_d_46_1503)">
                  <rect
                    x="2"
                    y="2"
                    width="32"
                    height="32"
                    rx="8"
                    fill="white"
                  />
                  <rect
                    x="2.5"
                    y="2.5"
                    width="31"
                    height="31"
                    rx="7.5"
                    stroke="#C8C8D0"
                  />
                </g>
                <path
                  d="M20.3337 22.6668L15.667 18.0002L20.3337 13.3335"
                  stroke="#131316"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <defs>
                  <filter
                    id="filter0_d_46_1503"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.898039 0 0 0 0 0.905882 0 0 0 0 0.921569 0 0 0 1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_46_1503"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_46_1503"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </button>
          </li>
          <li className="px-1">
            <button
              className={`${styles.paginationBtn} ${styles.active}  flex items-center justify-center rounded`}
            >
              1
            </button>
          </li>
          <li className="px-1">
            <button
              className={`${styles.paginationBtn}  flex items-center justify-center rounded`}
            >
              ...
            </button>
          </li>
          <li className="px-1">
            <button
              className={`${styles.paginationBtn}  flex items-center justify-center rounded`}
            >
              10
            </button>
          </li>
          <li className="px-1">
            <button className="border-0 p-0 transparent flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
              >
                <g filter="url(#filter0_d_46_1504)">
                  <rect
                    x="2"
                    y="2"
                    width="32"
                    height="32"
                    rx="8"
                    fill="white"
                  />
                  <rect
                    x="2.5"
                    y="2.5"
                    width="31"
                    height="31"
                    rx="7.5"
                    stroke="#C8C8D0"
                  />
                </g>
                <path
                  d="M15.667 22.6668L20.3337 18.0002L15.667 13.3335"
                  stroke="#131316"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  stroke-linejoin="round"
                />
                <defs>
                  <filter
                    id="filter0_d_46_1504"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.898039 0 0 0 0 0.905882 0 0 0 0 0.921569 0 0 0 1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_46_1504"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_46_1504"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </button>
          </li>
        </ul>
        <div className="flex items-center gap-1">
          <p className="m-0 text-gray-400 font-normal text-xs">Show</p>
          <select className="block w-full pr-4 font-semibold ps-2 text-xs  py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200">
            <option value="">10 rows</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>
      </div>
    </>
  );
};

export const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);
  return (
    <>
      <label className="relative inline-block w-12 h-6">
        <input
          type="checkbox"
          checked={isOn}
          onChange={() => setIsOn(!isOn)}
          className="opacity-0 w-0 h-0 absolute"
          style={{ height: 0, width: 0 }}
        />
        <span
          className={`slider block w-full h-full rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
            isOn ? "bg-blue-500" : "bg-gray-500"
          }`}
        ></span>
        <span
          className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition-all duration-300 ease-in-out ${
            isOn ? "translate-x-6 bg-white" : "bg-white"
          }`}
        ></span>
      </label>
    </>
  );
};

const arrowDown = (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.20711 0.792893C8.81658 0.402369 8.18342 0.402369 7.79289 0.792893L5 3.58579L2.20711 0.792893C1.81658 0.402369 1.18342 0.402369 0.792894 0.792893C0.402369 1.18342 0.402369 1.81658 0.792894 2.20711L4.29289 5.70711C4.68342 6.09763 5.31658 6.09763 5.70711 5.70711L9.20711 2.20711C9.59763 1.81658 9.59763 1.18342 9.20711 0.792893Z"
      fill="#777E91"
    />
  </svg>
);
