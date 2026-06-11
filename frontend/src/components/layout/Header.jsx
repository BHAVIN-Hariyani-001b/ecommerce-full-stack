import { memo, useCallback, useEffect, useState } from "react";
import HeaderBar from "./HeaderBar";
import Navbar from "./Navbar";
import SignIn from "../Popup/SignIn";
import SignUp from "../Popup/SignUp";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, clearSessionExpired } from "../../features/auth/authSlice";
import { useLocation } from "react-router-dom";

const Header = memo(function Header() {
  const [authView, setAuthView] = useState("signin");
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const sessionExpired = useSelector((state) => state.auth.sessionExpired);

  useEffect(() => {
    if (sessionExpired) {
      setAuthView("signin");
      setAuthOpen(true);
      dispatch(clearSessionExpired()); 
    }
  }, [sessionExpired, dispatch]);

  const openSignIn = useCallback(() => {
    setAuthView("signin");
    setAuthOpen(true);
    dispatch(clearAuthError());
  }, [dispatch]);

  const openSignUp = useCallback(() => {
    setAuthView("signup");
    setAuthOpen(true);
    dispatch(clearAuthError());
  }, [dispatch]);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const showNavbar = location.pathname !== "/search";

  return (
    <>
      <HeaderBar onLoginClick={openSignIn} />
      {showNavbar ? <Navbar /> : null}
      <SignIn
        open={authOpen && authView === "signin"}
        onClose={closeAuth}
        onSwitchToSignUp={openSignUp}
      />
      <SignUp
        open={authOpen && authView === "signup"}
        onClose={closeAuth}
        onSwitchToSignIn={openSignIn}
      />
    </>
  );
});

export default Header;
