import { memo, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import { registerUser } from "../../features/auth/authThunk";
import Passwordshow from "../common/Passwordshow";
import { toast } from "react-toastify";

const SignUp = memo(function SignUp({ open, onClose, onSwitchToSignIn }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, error } = useSelector((state) => state.auth);
  console.log(isLoading)
  const dispatch = useDispatch();

  const passwordMismatch = useMemo(
    () =>
      password.length > 0 &&
      confirmPassword.length > 0 &&
      password !== confirmPassword,
    [password, confirmPassword],
  );

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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) return;
      try {
        await dispatch(registerUser({ username, email, password })).unwrap();
        setPassword("");
        setConfirmPassword("");
        onSwitchToSignIn();
      } catch {
        toast.error("please try again");
      }
    },
    [dispatch, username, email, password, confirmPassword, onSwitchToSignIn],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Sign Up"
      widthClassName="max-w-sm"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error ? (
          <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl px-3 py-2 text-sm">
            {error}
          </div>
        ) : null}
        <div className="flex flex-col gap-1">
          <label htmlFor="signup-name" className="text-sm text-[#586274]">
            Username
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8685ef]/30"
            placeholder="xyz"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="signup-email" className="text-sm text-[#586274]">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8685ef]/30"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="signup-password" className="text-sm text-[#586274]">
            Password
          </label>
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8685ef]/30"
            placeholder="Create a password"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="signup-confirm" className="text-sm text-[#586274]">
            Confirm password
          </label>
          <input
            id="signup-confirm"
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

        <button
          type="submit"
          disabled={isLoading || passwordMismatch}
          className="w-full rounded-xl cursor-pointer bg-[#8685ef] text-white font-medium py-2.5 hover:opacity-95 active:opacity-90 transition-opacity"
        >
          {isLoading ? "Creating..." : "Create account"}
        </button>

        <p className="text-sm text-center text-[#586274]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-[#454d5c] cursor-pointer font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </form>
    </Modal>
  );
});

export default SignUp;
