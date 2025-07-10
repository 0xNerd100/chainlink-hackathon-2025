"use client";
import React from "react";
import styled from "styled-components";

const TableLayout = ({ column, data, columnView }) => {
  return (
    <>
      <div className="overflow-x-auto">
        <Table className={` text-xs w-full`}>
          {columnView && (
            <thead>
              <tr className="">
                {column &&
                  column.length > 0 &&
                  column.map((item, key) => (
                    <>
                      <th
                        className="font-medium px-3 py-3 2xl:text-[20px] text-[14px] text-white border-b border-[#F3F5F8]/60 text-left"
                        key={key}
                      >
                        {item.head}
                      </th>
                    </>
                  ))}
              </tr>
            </thead>
          )}
          <tbody>
            {data &&
              data?.length > 0 &&
              data.map((data, columnkey) => {
                return (
                  <tr className={columnkey % 2 === 0 ? "" : ""}>
                    {column &&
                      column.length > 0 &&
                      column.map((item, key) => {
                        if (item.component) {
                          return (
                            <td
                              className="px-3 py-3 border-b border-[#F3F5F8]/60 text-[#DDDDDD] 2xl:text-[20px] text-[14px] font-medium"
                              key={key}
                            >
                              {item.component(data, columnkey, data)}
                            </td>
                          );
                        }

                        return (
                          <td className="px-3 py-3 border-b border-[#F3F5F8]/60 2xl:text-[20px] text-[14px] font-medium">
                            {data[item?.accessor]}
                          </td>
                        );
                      })}
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      {/* <div className="text-right mt-1">
        <ul className="inline-flex rounded-full justify-end bg-[var(--backgroundColor2)]">
          <li>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#00ff4e] text-gray-500 disabled:opacity-50 cursor-not-allowed"
              tabIndex={-1}
              type="button"
              disabled=""
              aria-label="Go to previous page"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
          </li>
          <li>
            <button
              className="w-8 h-8 rounded-full hover:bg-[#00ff4e] text-gray-700 font-medium cursor-pointer active:bg-blue-500 active:text-white"
              tabIndex={0}
              aria-current="page"
              aria-label="page 1"
            >
              1
            </button>
          </li>
          <li>
            <button
              className="w-8 h-8 rounded-full hover:bg-[#00ff4e] text-gray-700 font-medium cursor-pointer hover:bg-gray-200 active:bg-blue-500 active:text-white"
              tabIndex={0}
              aria-label="Go to page 2"
            >
              2
            </button>
          </li>
          <li>
            <button
              className="w-8 h-8 rounded-full hover:bg-[#00ff4e] text-gray-700 font-medium cursor-pointer hover:bg-gray-200 active:bg-blue-500 active:text-white"
              tabIndex={0}
              aria-label="Go to page 3"
            >
              3
            </button>
          </li>
          <li>
            <button
              className="w-8 h-8 rounded-full hover:bg-[#00ff4e] text-gray-700 font-medium cursor-pointer hover:bg-gray-200 active:bg-blue-500 active:text-white"
              tabIndex={0}
              aria-label="Go to page 4"
            >
              4
            </button>
          </li>
          <li>
            <button
              className="w-8 h-8 rounded-full hover:bg-[#00ff4e] text-gray-700 font-medium cursor-pointer hover:bg-gray-200 active:bg-blue-500 active:text-white"
              tabIndex={0}
              aria-label="Go to page 5"
            >
              5
            </button>
          </li>
          <li>
            <div className="w-8 h-8 rounded-full hover:bg-[#00ff4e] text-gray-700 flex items-center justify-center cursor-default">
              …
            </div>
          </li>
          <li>
            <button
              className="w-8 h-8 rounded-full hover:bg-[#00ff4e] text-gray-700 font-medium cursor-pointer hover:bg-gray-200 active:bg-blue-500 active:text-white"
              tabIndex={0}
              aria-label="Go to page 10"
            >
              10
            </button>
          </li>
          <li>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#00ff4e] text-gray-500 cursor-pointer hover:bg-gray-200"
              tabIndex={0}
              type="button"
              aria-label="Go to next page"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </li>
        </ul>
      </div> */}
    </>
  );
};

const Table = styled.table``;

export default TableLayout;
