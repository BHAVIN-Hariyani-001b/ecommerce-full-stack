import { memo, useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Cart from "./components/cart/Cart";
import useAdminVerify from "./hook/useAdminVerify";
import ViewCheckOut from "./components/checkout/ViewCheckout";
import Modal from "./components/common/Modal";
import ProductAdd from "./components/product/ProductAdd";
import { productPageAPI } from "./features/productPage/ProductPageThunk";
import { useDispatch } from "react-redux";

const App = memo(function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sideBar, setSideBar] = useState(false);
  const [checkOut, setCheckOut] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSearch = location.pathname.startsWith("/search");
  const contact = location.pathname.startsWith("/contact");
  const about = location.pathname.startsWith("/about");

  const { isAdmin, isLoading } = useAdminVerify();

  const handleCloseCheckOut = useCallback(
    () => setCheckOut(false),
    [setCheckOut],
  );

  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [isAdmin, navigate, isLoading]);

  const [addToItem, setAddToItem] = useState(false);
  const [addToItemData, setToItemData] = useState("");

  const AddToCartOpen = useCallback(
    async (e, item) => {
      e.preventDefault();
      e.stopPropagation();
      setAddToItem(true);
      setToItemData(item);
      await dispatch(productPageAPI(item));
    },
    [dispatch],
  );

  const AddToCartClose = useCallback(() => setAddToItem(false), []);

  return (
    <div>
      {!isAdminRoute && !about && !contact && (
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

      <Outlet
        context={{
          searchQuery,
          setSearchQuery,
          sideBar,
          setSideBar,
          checkOut,
          AddToCartOpen,
          AddToCartClose,
        }}
      />

      <Modal open={addToItem} onClose={AddToCartClose} title="Add To Item">
        <ProductAdd item={addToItemData} />
      </Modal>

      {!isAdminRoute && !isSearch && !about && !contact && (
        <>
          <Cart
            setSideBar={setSideBar}
            sideBarOpen={sideBar}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
          />
          <Modal
            open={checkOut}
            onClose={handleCloseCheckOut}
            title="Please Order"
            widthClassName="max-w-6xl h-160"
          >
            <ViewCheckOut checkOut={checkOut} setCheckOut={setCheckOut} />
          </Modal>
          <Footer />
        </>
      )}
    </div>
  );
});

export default App;
