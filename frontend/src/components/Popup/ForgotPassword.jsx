import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../common/Modal";
import { toast, ToastContainer } from "react-toastify";
import {
  forgotPasswordRequest,
  resetPasswordRequest,
} from "../../features/forgotPassword/forgotPasswordThunk";
import {
  setEmail,
  setStep,
} from "../../features/forgotPassword/forgotPasswordSlice";
import OtpInput from "./OtpInput";
import { FaArrowLeftLong } from "react-icons/fa6";
import NewPassword from "./NewPassword";

const OTP_VALIDITY_SECONDS = 2 * 60;

const ForgotPassword = memo(function ForgotPassword({
  open,
  onClose,
  onSwitchToSignIn,
}) {
  const dispatch = useDispatch();
  const { loading, error, step, email, isPasswordMatch } = useSelector(
    (state) => state.forgotPassword,
  );
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_VALIDITY_SECONDS);
  const [btnDisable, setBtnDisable] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  useEffect(() => {
    if (!open) {
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setTimeLeft(OTP_VALIDITY_SECONDS);
      setBtnDisable(true);
      dispatch(setStep(1));
      dispatch(setEmail(""));
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (step !== 2) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (btnDisable) {
          setBtnDisable(true);
        }

        if (prev <= 1) {
          setBtnDisable(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, setBtnDisable, btnDisable]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (timeLeft == 0 && btnDisable) {
        setTimeLeft(OTP_VALIDITY_SECONDS);
      }

      try {
        await dispatch(forgotPasswordRequest({ email })).unwrap();
        dispatch(setStep(2));
        setTimeLeft(OTP_VALIDITY_SECONDS); // always reset after a successful send/resend
        setBtnDisable(true);
        toast.success("OTP sent to your email");
      } catch (error) {
        toast.error(error || "Please try again");
      }
    },
    [dispatch, email, timeLeft, btnDisable],
  );

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error("Password Do Not Match");
        return;
      }
      const re = await dispatch(
        resetPasswordRequest({ email, newPassword: password }),
      ).unwrap();
      toast.success("Password Reset Successfully");
      console.log(re);
      onClose?.();
    } catch {
      toast.error("Please try again");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        step === 1
          ? "Forgot Password"
          : step === 2
            ? "OTP Verification"
            : "Reset Password"
      }
      widthClassName="max-w-lg"
    >
      {step === 1 && (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error ? (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl px-3 py-2 text-sm">
              {error}
            </div>
          ) : null}
          <div className="flex flex-col gap-1">
            <label htmlFor="forgot-email" className="text-sm text-[#586274]">
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => dispatch(setEmail(e.target.value))}
              className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8685ef]/30"
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl cursor-pointer bg-[#8685ef] text-white font-medium py-2.5 hover:opacity-95 active:opacity-90 transition-opacity"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
          <p className="text-sm text-center text-[#586274]">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-[#454d5c] cursor-pointer font-semibold hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      )}

      {step === 2 && (
        <form className="flex flex-col gap-4 relative" onSubmit={handleSubmit}>
          <div className="text-[16px] text-center mt-5 text-[#586274] flex flex-col">
            <span className="text-lg">We have sent a verification code to</span>
            <span className="font-semibold text-[16px]">{email}</span>
          </div>

          <OtpInput otp={otp} onChange={setOtp} />

          <div>
            <p className="text-lg text-[#586274] text-center">
              Resend OTP In ({Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => dispatch(setStep(1))}
              className={`w-full rounded-xl border border-[#8685ef] text-[#586274] font-medium py-2.5 hover:opacity-95 active:opacity-90 transition-opacity`}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={btnDisable}
              className={`w-full rounded-xl text-white font-medium py-2.5 hover:opacity-95 active:opacity-90 transition-opacity ${btnDisable ? "bg-[#8785ef8c] cursor-not-allowed" : "cursor-pointer bg-[#8685ef]"}`}
            >
              {loading ? "OTP Sending..." : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form className="space-y-1 relative" onSubmit={(e) => e.preventDefault}>
          <NewPassword
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
          <div className="text-sm text-red-400 min-h-5 flex justify-center items-center rounded text-center">
            {error && error}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              onClick={() => dispatch(setStep(1))}
              className={`w-full rounded-xl border border-[#8685ef] text-[#586274] font-medium py-2.5 hover:opacity-95 active:opacity-90 transition-opacity`}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!isPasswordMatch}
              onClick={handleResetPassword}
              className={`w-full rounded-xl text-white font-medium py-2.5 hover:opacity-95 active:opacity-90 transition-opacity ${
                !isPasswordMatch
                  ? "bg-[#8785ef8c] cursor-not-allowed"
                  : "cursor-pointer bg-[#8685ef]"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
});

export default ForgotPassword;
