import React, { useCallback, useMemo } from "react";
import { PiUserCircle } from "react-icons/pi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { PiMapPinArea } from "react-icons/pi";
import { useSelector } from "react-redux";
import { LuMails } from "react-icons/lu";

const ProfileSettingShow = ({ openPage, setOpenPage }) => {
  const ProfileList = [
    {
      FiledName: "Profile",
      icon: <PiUserCircle size={20} />,
    },
    {
      FiledName: "Order History",
      icon: <HiOutlineShoppingBag size={20} />,
    },
    {
      FiledName: "Saved Address",
      icon: <PiMapPinArea size={20} />,
    },
  ];

  const user = useSelector((state) => state.auth.user);

  const displayName = useMemo(
    () =>
      user?.username.charAt(0).toUpperCase() + user?.username.slice(1) ||
      "Profile",
    [user?.username],
  );

  const handleOnClickProfile = useCallback(
    (item) => {
      setOpenPage(item);
    },
    [setOpenPage],
  );

  return (
    <div className="w-full h-full max-[900px]:h-fit max-[900px]:shadow-2xl max-[900px]:rounded-2xl p-5 border-r border-gray-300">
      <div className="space-y-3">
        <div className="flex justify-start items-center gap-3 bg-gray-500/10 p-2 rounded-lg">
          <PiUserCircle size={50} />
          <div className="flex flex-col">
            <span className="font-normal text-[18px] text-black line-clamp-2 w-40 truncate">
              {displayName}
            </span>
            <div className="flex items-center gap-1 justify-center">
              <span>
                <LuMails />
              </span>
              <span className="w-40 truncate">{user?.email}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start gap-3">
          {ProfileList.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-start cursor-pointer hover:bg-gray-300/30 w-full gap-3 text-[17px] text-black p-3 rounded-lg hover:scale-102 duration-500 ${openPage == item.FiledName && "bg-blue-400/30"}`}
              onClick={() => handleOnClickProfile(item.FiledName)}
            >
              {item.icon}
              <div>{item.FiledName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingShow;
