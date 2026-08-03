import React from "react";

const WebPageLoding = () => {
  return (
    <div>
      <div className="w-full flex justify-center items-center h-screen animation-pageloading">
        <img
          src="/src/assets/images/logo/logo.jpeg"
          alt="logo"
          className="w-80 object-cover"
        />
      </div>
    </div>
  );
};

export default WebPageLoding;
