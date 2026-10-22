import { GoogleLogin } from "@react-oauth/google";
import { GoogleAuth } from "../../features/auth/authThunk";
import { useDispatch } from "react-redux";

const AuthGoogle = ({ onClose }) => {
  const dispatch = useDispatch();
  return (
    <div className="space-y-5">
      <div>
        <GoogleLogin
          text="continue_with"
          shape="circle"
          logo_alignment="left"
          onSuccess={(res) => {
            const result = dispatch(GoogleAuth(res));
            // if (GoogleAuth.fulfilled.match(result)) {
            //   onClose?.();
            // }
            onClose?.();
          }}
          onError={() => console.log("Google login failed")}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="border-t w-full border-gray-300"></div>
        <div>or</div>
        <div className="border-t w-full border-gray-300"></div>
      </div>
    </div>
  );
};

export default AuthGoogle;
