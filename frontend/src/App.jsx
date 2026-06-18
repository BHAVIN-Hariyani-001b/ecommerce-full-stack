import { memo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Cart from "./components/cart/Cart";

const App = memo(function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sideBar, setSideBar] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <div>
      {!isAdminRoute && (
        <Header
          setQuery={setSearchQuery}
          setSideBar={setSideBar}
          sideBar={sideBar}
        />
      )}
      <ToastContainer position="top-right" autoClose={1500} />

      <Outlet context={{ searchQuery, setSearchQuery, sideBar, setSideBar }} />

      {!isAdminRoute && (
        <>
          <Cart setSideBar={setSideBar} sideBarOpen={sideBar} />
          <Footer />
        </>
      )}
    </div>
  );
});

export default App;
