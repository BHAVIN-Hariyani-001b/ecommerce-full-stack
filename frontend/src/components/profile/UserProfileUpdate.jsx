import { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../../features/auth/authThunk";
import toast from "react-hot-toast";

const UserProfileUpdate = () => {
  const user = useSelector((state) => state.auth.user);
  const { error, isLoading } = useSelector((state) => state.auth);

  const [userName, setUserName] = useState(user?.username);
  const [userPhone, setUserPhone] = useState(user?.phone ?? "");
  const dispatch = useDispatch();

  const handleUpdateProfile = useCallback(async () => {
    try {
      await dispatch(
        editProfile({ id: user?.id, username: userName, phone: userPhone }),
      ).unwrap();
      toast.success("Profile Update Successfully");
    } catch (err) {
      toast.error(err?.message || "Please try later");
    }
  }, [dispatch, user, userName, userPhone]);

  return (
    <div>
      <h1 className="font-serif text-[26px] font-semibold text-gray-900 p-2">
        User Profile
      </h1>
      <div className="flex justify-center items-center w-full h-full p-5 border border-gray-300 rounded-2xl">
        <form className="w-full h-full" onSubmit={(e) => e.preventDefault()}>
          {error ? (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl px-3 py-2 text-sm">
              {error}
            </div>
          ) : null}
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
            <button
              type="button"
              onClick={handleUpdateProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-lg text-white p-2 duration-700 transition-all ease-in-out"
            >
              {isLoading ? "Submiting..." : "submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UserProfileUpdate);
