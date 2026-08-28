import { memo, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import Modal from "../common/Modal";
import { FaRegCircleUser } from "react-icons/fa6";
import { logoutUser } from "../../features/auth/authThunk";
import Profile from "../profile/Profile";
import AdminProfile from "../profile/AdminProfile";

const Logout = memo(function Logout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const displayName = useMemo(
    () => user?.username || "Profile",
    [user?.username],
  );
  const [logoutOpen, setLogoutOpen] = useState(false);

  const openModal = useCallback(() => setLogoutOpen(true), []);
  const closeModal = useCallback(() => setLogoutOpen(false), []);
  const role = useSelector((state) => state.auth?.user?.role);
  // console.log(user.id);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    dispatch(logout());
    setLogoutOpen(false);
  }, [dispatch]);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center flex-col justify-center cursor-pointer"
        aria-label="Open profile menu"
      >
        <FaRegCircleUser className="w-9 h-6 max-[600px]:w-8 max-[600px]:h-5 max-[600px]:text-[#5c647a]" />
        <p
          className="max-w-24 truncate max-[600px]:text-[#5c647a]"
          title={displayName}
        >
          {displayName}
        </p>
      </button>

      <Modal
        open={logoutOpen}
        onClose={closeModal}
        title="Account"
        widthClassName={role === "admin" ? "max-w-xl" : "max-w-6xl"}
      >
        <div className="flex flex-col gap-4">
          {role === "user" ? (
            <Profile />
          ) : (
            <AdminProfile displayName={displayName} />
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="border cursor-pointer border-gray-200 text-[#454d5c] rounded-xl px-4 py-2 text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-xl bg-[#8685ef] text-white px-4 py-2 text-sm font-medium hover:opacity-95 active:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default Logout;
