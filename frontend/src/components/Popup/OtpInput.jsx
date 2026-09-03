import React, { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtpRequest } from "../../features/forgotPassword/forgotPasswordThunk";
import toast from "react-hot-toast";
import { setStep } from "../../features/forgotPassword/forgotPasswordSlice";

const LENGTH = 4;

const OtpInput = ({ otp, onChange }) => {
  const otpRef = useRef([]);
  const dispatch = useDispatch();
  const email = useSelector((state) => state.forgotPassword.email);
  const otpVerified = useSelector((state) => state.forgotPassword.otpVerified);
  console.log(otpVerified);

  useEffect(() => {
    if (otpRef.current[0]) {
      otpRef.current[0].focus();
    }
  }, []);

  const handelVerifyOtp = async (otp) => {
    try {
      await dispatch(verifyOtpRequest({ email, otp })).unwrap();
      // console.log("mathc")
      toast.success("OTP verified successfully");
      dispatch(setStep(3));
    } catch (error) {
      toast.error(error || "Invalid OTP, please try again");
    }
  };

  const handleOnChange = (e, index) => {
    const value = e.target.value;

    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    onChange(newOtp);

    if (value) {
      otpRef.current[index + 1]?.focus();
    }

    const isCompleted =
      (otp.length === LENGTH && !otp.includes("")) ||
      (index === LENGTH - 1 && value);
    if (isCompleted) {
      console.log("icom");
      handelVerifyOtp(newOtp.join(""));
    }
  };

  const handleOnKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        onChange(newOtp);
      } else {
        otpRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: LENGTH }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (otpRef.current[index] = el)}
          type="text"
          value={otp[index] || ""}
          maxLength={6}
          onChange={(e) => handleOnChange(e, index)}
          onKeyDown={(e) => handleOnKeyDown(e, index)}
          className="w-15 h-15 border text-lg border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8685ef]/30 text-center"
        />
      ))}
    </div>
  );
};

export default memo(OtpInput);
