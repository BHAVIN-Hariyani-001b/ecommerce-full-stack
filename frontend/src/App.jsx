import { memo, useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Cart from "./components/cart/Cart";
import useAdminVerify from "./hook/useAdminVerify";
import ViewCheckOut from "./components/checkout/ViewCheckout";
import Modal from "./components/common/Modal";
import ProductAdd from "./components/product/ProductAdd";
import { productPageAPI } from "./features/productPage/ProductPageThunk";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttributesAPI } from "./admin/features/attributes/attributesThunk";
import { setAttributeName } from "./admin/features/attributes/attributesSlice";
import { wishListFetchAPI } from "./features/wishlist/wishlistThunk";
import { setProductList } from "./features/wishlist/wishlistSlice";

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
  const user = useSelector((state) => state.auth.user);

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

  const attributes = useSelector((state) => state.attribute?.attributes);

  useEffect(() => {
    dispatch(fetchAttributesAPI());
  }, [dispatch]);

  useEffect(() => {
    (async () => await dispatch(wishListFetchAPI(user?.id)).unwrap())();
    dispatch(setProductList());
  }, [dispatch, user]);

  useEffect(() => {
    if (!attributes) return;

    const grouped = attributes.reduce((acc, attr) => {
      const key = attr.attribute_name;
      const valueIds = (attr.values ?? attr.options ?? []).map((v) => v.id);
      acc[key] = valueIds;
      return acc;
    }, {});

    dispatch(setAttributeName(grouped));
  }, [attributes, dispatch]);

  return (
    <div>
      {!isAdminRoute && !about && !contact && (
        <Header
          setQuery={setSearchQuery}
          setSideBar={setSideBar}
          sideBar={sideBar}
        />
      )}

      <Toaster
        position="top-center"
        reverseOrder={false} // equivalent to newestOnTop={false}
        gutter={8}
        toastOptions={{
          duration: 1500, // equivalent to autoClose={1500}
          className: "custom-toast-container",
          style: {
            // "theme=colored" isn't built-in — you style it manually
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: { background: "#22c55e", color: "#fff" },
          },
          error: {
            style: { background: "#ef4444", color: "#fff" },
          },
        }}
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
