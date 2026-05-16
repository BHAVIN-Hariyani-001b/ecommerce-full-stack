import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { logout } from "../../features/auth/authSlice";
import Modal from "../common/Modal"
import { FaRegCircleUser } from "react-icons/fa6";

function Logout() {
  const dispatch = useDispatch();
  const user  = useSelector((state) => state.auth.user);
  const displayName = user?.username || "Profile";
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setLogoutOpen(true)}
        className="flex items-center flex-col justify-center gap-1 cursor-pointer"
        aria-label="Open profile menu"
      >
        <FaRegCircleUser className="w-9 h-6 max-[600px]:w-8 max-[600px]:h-5" />
        <p className="max-w-24 truncate" title={displayName}>
          {displayName}
        </p>
      </button>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Account"
      >
        <div className="flex flex-col gap-4">
          
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

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setLogoutOpen(false)}
              className="border cursor-pointer border-gray-200 text-[#454d5c] rounded-xl px-4 py-2 text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch(logout());
                setLogoutOpen(false);
              }}
              className="cursor-pointer rounded-xl bg-[#8685ef] text-white px-4 py-2 text-sm font-medium hover:opacity-95 active:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Logout;
