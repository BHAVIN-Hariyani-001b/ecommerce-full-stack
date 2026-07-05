import { memo, useCallback, useEffect, useState } from "react";
import HeaderBar from "./HeaderBar";
import Navbar from "./Navbar";
import SignIn from "../Popup/SignIn";
import SignUp from "../Popup/SignUp";
import ForgotPassword from "../Popup/ForgotPassword";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuthError,
  clearSessionExpired,
} from "../../features/auth/authSlice";
import { fetchCartItem } from "../../features/card/cardThunk";
import { useLocation } from "react-router-dom";

const Header = memo(function Header({ setSideBar, sideBar, setQuery }) {
  const [authView, setAuthView] = useState("signin");
  const [authOpen, setAuthOpen] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const sessionExpired = useSelector((state) => state.auth.sessionExpired);
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      dispatch(fetchCartItem(user.id));
    }
  }, [dispatch, isLoggedIn, user?.id]);

  useEffect(() => {
    if (sessionExpired) {
      setForgotPassword(false);
      setAuthView("signin");
      setAuthOpen(true);
      dispatch(clearSessionExpired());
    }
  }, [sessionExpired, dispatch]);

  const openSignIn = useCallback(() => {
    setForgotPassword(false)
    setAuthView("signin");
    setAuthOpen(true);
    dispatch(clearAuthError());
  }, [dispatch]);

  const openSignUp = useCallback(() => {
    setForgotPassword(false)
    setAuthView("signup");
    setAuthOpen(true);
    dispatch(clearAuthError());
  }, [dispatch]);

  const openForgotPassword = useCallback(() => {
    setAuthOpen(false);
    setForgotPassword(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const closeForgotPassword = useCallback(() => setForgotPassword(false), []);

  const showNavbar = !(
    location.pathname === "/search" || location.pathname.startsWith("/product/")
  );

  return (
    <>
      <HeaderBar
        onLoginClick={openSignIn}
        setSideBar={setSideBar}
        sideBarOpen={sideBar}
        onSearch={setQuery}
      />
      {showNavbar ? <Navbar /> : null}
      <SignIn
        open={authOpen && authView === "signin"}
        onClose={closeAuth}
        onSwitchToSignUp={openSignUp}
        onForgotPassword={openForgotPassword}
      />
      <SignUp
        open={authOpen && authView === "signup"}
        onClose={closeAuth}
        onSwitchToSignIn={openSignIn}
      />

      <ForgotPassword
        open={forgotPassword}
        onClose={closeForgotPassword}
        onSwitchToSignIn={openSignIn}
      />
    </>
  );
});

export default Header;
