import { memo, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Cart from "./components/cart/Cart";
import useAdminVerify from "./hook/useAdminVerify";
import BottomMenu from "./admin/components/common/BottomMenu";

const App = memo(function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sideBar, setSideBar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSearch = location.pathname.startsWith("/search");

  const { isAdmin, isLoading } = useAdminVerify();

  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [isAdmin, navigate, isLoading]);

  return (
    <div>
      {!isAdminRoute && (
        <Header
          setQuery={setSearchQuery}
          setSideBar={setSideBar}
          sideBar={sideBar}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        transition={Slide}
        pauseOnHover
        theme="colored"
        className="custom-toast-container"
      />

      <Outlet context={{ searchQuery, setSearchQuery, sideBar, setSideBar }} />

      {!isAdminRoute && !isSearch && (
        <>
          <Cart setSideBar={setSideBar} sideBarOpen={sideBar} />
          <Footer />
        </>
      )}
    </div>
  );
});

export default App;
