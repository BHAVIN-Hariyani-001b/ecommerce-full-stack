import { useState } from "react";
import HeaderBar from "./HeaderBar";
import Navbar from "./Navbar";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Header = () => {
  const [authView, setAuthView] = useState("signin"); // "signin" | "signup"
  const [authOpen, setAuthOpen] = useState(false);

  const openSignIn = () => {
    setAuthView("signin");
    setAuthOpen(true);
  };

  const openSignUp = () => {
    setAuthView("signup");
    setAuthOpen(true);
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
