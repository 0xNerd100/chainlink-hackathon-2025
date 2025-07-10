import Image from "next/image";
import React from "react";

const BtnLoader = () => {
  return (
    <img
      src={"img"}
      // src={imageURl + "loader.gif"}
      alt=""
      className="max-w-full object-contain w-auto"
      height={20}
      width={20}
      style={{ height: 20 }}
    />
  );
};

export default BtnLoader;
