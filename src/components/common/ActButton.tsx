"use client"
import React from "react";
import BtnLoader from "./BtnLoader";

interface ActButtonProps {
  label: string;
  onClick: () => void;
  load?: boolean;
}

const ActButton: React.FC<ActButtonProps> = ({ label, onClick, load = false }) => {
  return (
      <button
        onClick={onClick}
        disabled={load}
        className="absolute top-0 text-black text-[16px] font-semibold left-0 w-full h-full flex items-center justify-center text-center"
      >
        {load ? <BtnLoader /> : label}
      </button>
  );
};

export default ActButton;
