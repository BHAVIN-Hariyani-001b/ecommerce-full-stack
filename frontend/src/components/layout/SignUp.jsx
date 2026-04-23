import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import { registerUser } from "../../features/auth/authThunk";
import { clearAuthError } from "../../features/auth/authSlice";

const SignUp = ({ open, onClose, onSwitchToSignIn }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
      setPassword("");
      setConfirmPassword("");
      onClose?.();
    } catch {
      // handled in slice
    }
  };

  const passwordMismatch =
    password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <Modal open={open} onClose={onClose} title="Sign Up" widthClassName="max-w-sm">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && (
          <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl px-3 py-2 text-sm">
            {error}
          </div>
        )}
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
            onFocus={() => dispatch(clearAuthError())}
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
            onFocus={() => dispatch(clearAuthError())}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="signup-password" className="text-sm text-[#586274]">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8685ef]/30"
            placeholder="Create a password"
            onFocus={() => dispatch(clearAuthError())}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="signup-confirm" className="text-sm text-[#586274]">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={[
              "border rounded-xl px-3 py-2 outline-none focus:ring-2",
              passwordMismatch
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-200 focus:ring-[#8685ef]/30",
            ].join(" ")}
            placeholder="Repeat password"
            onFocus={() => dispatch(clearAuthError())}
          />
          {passwordMismatch && (
            <p className="text-xs text-red-500">Passwords do not match.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || passwordMismatch}
          className="w-full rounded-xl bg-[#8685ef] text-white font-medium py-2.5 hover:opacity-95 active:opacity-90 transition-opacity"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-sm text-center text-[#586274]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-[#454d5c] font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </form>
    </Modal>
  );
};

export default SignUp;
