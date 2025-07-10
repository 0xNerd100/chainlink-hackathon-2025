import React from "react";

const Loader = () => {
  return (
    <>
      <div className="fixed bg-black/70 flex items-center justify-center top-0 left-0 h-full w-full z-[9999]">
        <span
          className="loading loading-bars "
          style={{ width: "80px", height: "80px" }}
        ></span>
      </div>
    </>
  );
};

export default Loader;
