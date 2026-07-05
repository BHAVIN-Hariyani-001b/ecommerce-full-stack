import React, { useEffect, useMemo, useState } from "react";
import Passwordshow from "../common/Passwordshow";
import { useDispatch } from "react-redux";
import {
  clearError,
  setIsPasswordMath,
} from "../../features/forgotPassword/forgotPasswordSlice";

const NewPassword = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const passwordMismatch = useMemo(
    () =>
      password.length > 0 &&
      confirmPassword.length > 0 &&
      password !== confirmPassword,
    [password, confirmPassword],
  );

  useEffect(() => {
    dispatch(setIsPasswordMath(!passwordMismatch));
    dispatch(clearError());
  }, [passwordMismatch, dispatch]);

  const confirmInputClassName = useMemo(
    () =>
      [
        "border rounded-xl px-3 py-2 outline-none focus:ring-2",
        passwordMismatch
          ? "border-red-300 focus:ring-red-200"
          : "border-gray-200 focus:ring-[#8685ef]/30",
      ].join(" "),
    [passwordMismatch],
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1">
        <label htmlFor="newpassword" className="text-sm text-[#586274]">
          New Password
        </label>
        <input
          id="newpassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8685ef]/30"
          placeholder="Create a password"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="conPass" className="text-sm text-[#586274]">
          Confirm New Password
        </label>
        <input
          id="conPass"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={confirmInputClassName}
          placeholder="Repeat password"
        />
        {passwordMismatch ? (
          <p className="text-xs text-red-500">Passwords do not match.</p>
        ) : null}
      </div>

      <div>
        <Passwordshow
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </div>
    </div>
  );
};

export default NewPassword;
