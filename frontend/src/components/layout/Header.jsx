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
  setAuthOpen,
  setAuthView,
  setForgotPassword,
} from "../../features/auth/authSlice";
import { fetchCartItem } from "../../features/card/cardThunk";
import { useLocation } from "react-router-dom";

const Header = memo(function Header({ setSideBar, sideBar, setQuery }) {

  const location = useLocation();
  const dispatch = useDispatch();
  const sessionExpired = useSelector((state) => state.auth.sessionExpired);
  const { user, authView, authOpen, forgotPassword } = useSelector(
    (state) => state.auth,
  );
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      dispatch(fetchCartItem(user.id));
    }
  }, [dispatch, isLoggedIn, user?.id]);

  useEffect(() => {
    if (sessionExpired) {
      dispatch(setForgotPassword(false));
      dispatch(setAuthView("signin"));
      dispatch(setAuthOpen(true));
      dispatch(clearSessionExpired());
    }
  }, [sessionExpired, dispatch]);

  const openSignIn = useCallback(() => {
    dispatch(setForgotPassword(false));
    dispatch(setAuthView("signin"));
    dispatch(setAuthOpen(true));
    dispatch(clearAuthError());
  }, [dispatch]);

  const openSignUp = useCallback(() => {
    dispatch(setForgotPassword(false));
    dispatch(setAuthView("signup"));
    dispatch(setAuthOpen(true));
    dispatch(clearAuthError());
  }, [dispatch]);

  const openForgotPassword = useCallback(() => {
    dispatch(setAuthOpen(false));
    dispatch(setForgotPassword(true));
  }, [dispatch]);

  const closeAuth = useCallback(() => dispatch(setAuthOpen(false)), [dispatch]);
  const closeForgotPassword = useCallback(() => dispatch(setForgotPassword(false)), [dispatch]);

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
