import { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import { loginUser } from "../../features/auth/authThunk";
import Passwordshow from "../common/Passwordshow";
import { toast } from "react-toastify";

const SignIn = memo(function SignIn({
  open,
  onClose,
  onSwitchToSignUp,
  onForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await dispatch(loginUser({ email, password })).unwrap();
        setPassword("");
        toast.success("Loging Successfully");
        onClose?.();
      } catch {
        toast.error("please try again");
      }
    },
    [dispatch, email, password, onClose],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Sign In"
      widthClassName="max-w-sm"
    >
      <div className="space-y-3">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error ? (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl px-3 py-2 text-sm">
              {error}
            </div>
          ) : null}
          <div className="flex flex-col gap-1">
            <label htmlFor="signin-email" className="text-sm text-[#586274]">
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8685ef]/30"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="signin-password" className="text-sm text-[#586274]">
              Password
            </label>
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8685ef]/30"
              placeholder="••••••••"
            />
          </div>
          <div>
            <Passwordshow
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl cursor-pointer bg-[#8685ef] text-white font-medium py-2.5 hover:opacity-95 active:opacity-90 transition-opacity"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-sm text-center text-[#586274]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-[#454d5c] cursor-pointer font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>

          <div className="flex justify-center items-center text-[14px] font-semibold text-[#454d5c] hover:underline">
            <button
              type="button"
              className="cursor-pointer"
              onClick={onForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
});

export default SignIn;
