import { memo, useCallback, useEffect, useState } from "react";
import HeaderBar from "./HeaderBar";
import Navbar from "./Navbar";
import SignIn from "../Popup/SignIn";
import SignUp from "../Popup/SignUp";
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
