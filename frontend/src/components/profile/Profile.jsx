import { useCallback, useState } from "react";
import { logoutUser } from "../../features/auth/authThunk";

import { FaRegCircleUser } from "react-icons/fa6";
import { PiUserCircle } from "react-icons/pi";
import ProfileSettingShow from "./ProfileSettingShow";
import UserProfileUpdate from "./UserProfileUpdate";
import UserOrderHistory from "./UserOrderHistory";
import UserLocation from "./UserLocation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteUserAPI } from "../../admin/features/user/userThunk";
import DeletePopup from "../../admin/components/common/DeletePopup";
import { logout } from "../../features/auth/authSlice";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [openPage, setOpenPage] = useState("Profile");
  const [delteId, setDeleteId] = useState(null);
  const dispatch = useDispatch();

  const pages = {
    Profile: <UserProfileUpdate />,
    "Order History": <UserOrderHistory />,
    "Saved Location": <UserLocation />,
  };

  const PageRender = () => {
    return pages[openPage] ?? null;
  };

  const handleOnDeleteAccount = useCallback(() => {
    dispatch(logoutUser());
    dispatch(logout());
    toast.success("logout successfully");
    dispatch(deleteUserAPI(delteId));
    toast.success("Delete Account successfully");
    setDeleteId(null);
  }, [dispatch, delteId]);

  return (
    <div>
      <div className="grid grid-cols-3 w-full border border-gray-300 rounded-2xl h-120 max-[900px]:flex max-[600px]:flex-wrap overflow-auto scrollbar-none">
        <div className="w-full flex items-center justify-center">
          <ProfileSettingShow openPage={openPage} setOpenPage={setOpenPage} />
        </div>
        <div className=" w-full h-full col-span-2 p-5 overflow-scroll scrollbar-none">
          <div className="space-y-3">
            <PageRender />
            {openPage === "Profile" && (
              <div className="pl-1">
                <button
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setDeleteId(user?.id)}
                >
                  Delete Account
                </button>
                <p>
                  Deleting your account will remove all your orders,any active
                  referral
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {delteId && (
        <DeletePopup
          onClose={() => setDeleteId(null)}
          handleDelete={handleOnDeleteAccount}
        />
      )}
    </div>
  );
};

export default Profile;
