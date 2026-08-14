import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";

const AdminProfile = ({ displayName }) => {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#8685ef]/15 flex items-center justify-center">
          <FaRegCircleUser className="text-[#8685ef] text-xl" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-[#586274]">Signed in as</p>
          <p
            className="font-semibold text-[#2b2f3a] truncate"
            title={displayName}
          >
            {displayName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
