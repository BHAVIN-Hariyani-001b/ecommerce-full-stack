import React, { memo } from "react";

const UserLocation = () => {
  return (
    <div className="p-5">
      <h1 className="font-serif text-[26px] font-semibold text-gray-900 p-2">
        Saved Location
      </h1>
    </div>
  );
};

export default memo(UserLocation);
