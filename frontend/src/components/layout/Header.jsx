import { useState } from "react";
import HeaderBar from "./HeaderBar";
import Navbar from "./Navbar";
import SignIn from "../Popup/SignIn";
import SignUp from "../Popup/SignUp";
import { useDispatch } from "react-redux";
import { clearAuthError } from "../../features/auth/authSlice";

const Header = () => {
  const [authView, setAuthView] = useState("signin");
  const [authOpen, setAuthOpen] = useState(false);

  const dispatch = useDispatch();

  const openSignIn = () => {
    setAuthView("signin");
    setAuthOpen(true);
    dispatch(clearAuthError());
  };
  
  const openSignUp = () => {
    setAuthView("signup");
    setAuthOpen(true);
    dispatch(clearAuthError());
  };

  return (
    <>
      <HeaderBar onLoginClick={openSignIn} />
      <Navbar />
      <SignIn
        open={authOpen && authView === "signin"}
        onClose={() => setAuthOpen(false)}
        onSwitchToSignUp={openSignUp}
      />
      <SignUp
        open={authOpen && authView === "signup"}
        onClose={() => setAuthOpen(false)}
        onSwitchToSignIn={openSignIn}
      />
    </>
  );
};


export default Header;
