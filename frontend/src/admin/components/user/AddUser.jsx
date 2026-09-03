import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createUserAPI, updateUserAPI } from "../../features/user/userThunk";

const initialUserData = {
  UName: "",
  UEmail: "",
  UPassword: "",
  Status: "",
};

const AddProduct = ({ closeAddUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  // console.log(userData);

  

  const dispatch = useDispatch();

  const { error, loading, isUpdate } = useSelector((state) => state.user);

  useEffect(() => {
    if (isUpdate?.id) {
      setUserData({
        UName: isUpdate?.username,
        Status: isUpdate?.role,
        UEmail: isUpdate?.email,
      });
    } else {
      setUserData(initialUserData);
    }
  }, [isUpdate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isCheckFill = (data) =>
    Boolean(data.UName.trim() && data.UEmail.trim() && data.Status);

  const handleOnSubmit = async () => {
    if (!isCheckFill(userData)) {
      toast.error("Please fill all required fields correctly.");
      return false;
    }

    if (isUpdate?.id) {
      await dispatch(updateUserAPI({ id: isUpdate?.id, userData }));
      toast.success("user update successfully");
      closeAddUser();
    } else {
      if (userData.UPassword == "" && userData.UPassword) {
        toast.error("Password is required.");
        return;
      }
      await dispatch(createUserAPI(userData)).unwrap();
      toast.success("user create successfully");
      closeAddUser();
    }
  };

  return (
    <div className="transition-transform duration-900 ease-in">
      <div className="p-4 border border-gray-300 rounded-xl">
        <form onSubmit={(e) => e.preventDefault()}>
          {error ? (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl px-3 py-2 text-sm">
              {error}
            </div>
          ) : null}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-gray-500">
                User Name
              </label>
              <input
                type="text"
                name="UName"
                id="username"
                value={userData.UName}
                onChange={handleOnChange}
                placeholder="e.g. xyz"
                className="border border-gray-200 p-3 outline-none rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="useremail" className="text-gray-500">
                Email
              </label>
              <input
                type="text"
                name="UEmail"
                id="useremail"
                value={userData.UEmail}
                onChange={handleOnChange}
                placeholder="e.g. example@gmail.com"
                className="border border-gray-200 p-3 outline-none rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                Role
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl h-12 px-3">
                <select
                  name="Status"
                  value={userData.Status}
                  onChange={handleOnChange}
                  className="appearance-none outline-none w-full h-full cursor-pointer bg-transparent text-[16px] p-1"
                >
                  <option value="option">select option</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <IoIosArrowDown className="shrink-0 text-gray-400" />
              </div>
            </div>
            {!isUpdate?.id && (
              <div className="flex flex-col gap-2">
                <label htmlFor="Password" className="text-gray-500">
                  Password
                </label>
                <div className="flex justify-center items-center border  rounded-lg border-gray-200">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="UPassword"
                    id="Password"
                    placeholder="••••••••"
                    className=" p-3 outline-none w-full"
                    value={userData.UPassword}
                    onChange={handleOnChange}
                  />
                  <div
                    className="w-10 cursor-pointer duration-200 ease-in-out transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaRegEyeSlash size={20} />
                    ) : (
                      <FaRegEye size={20} />
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleOnSubmit}
              className="bg-green-700 text-white shadow-2xl cursor-pointer hover:bg-green-600 w-full px-3 py-3.5 rounded-xl"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
