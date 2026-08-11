import { memo, useState } from "react";
import { useSelector } from "react-redux";

const UserProfileUpdate = () => {
  const user = useSelector((state) => state.auth.user);

  const [userName, setUserName] = useState(user?.username);
  const [userPhone, setUserPhone] = useState("");

  return (
    <div className="p-5">
      <h1 className="font-serif text-[26px] font-semibold text-gray-900 p-2">User Profile</h1>
      <div className="flex justify-center items-center w-full h-full p-5 border border-gray-300 rounded-2xl">
        <form className="w-full h-full">
          <div className="flex flex-col justify-center items-start p-2 space-y-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border border-gray-300 p-2 outline-none rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-center items-start p-2 space-y-2">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              name="phone"
              value={userPhone}
              placeholder="8945XXXXXX"
              onChange={(e) => setUserPhone(e.target.value)}
              className="w-full border border-gray-300 p-2 outline-none rounded-lg"
            />
          </div>
          <div className="w-full p-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-lg text-white p-2">
              Submit
            </button>
          </div>{" "}
        </form>
      </div>
    </div>
  );
};

export default memo(UserProfileUpdate);
