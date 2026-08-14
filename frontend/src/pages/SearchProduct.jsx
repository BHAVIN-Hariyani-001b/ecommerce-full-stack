import { memo, useEffect, useRef, useState } from "react";
import Cart from "../components/cart/Cart";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/common/ProductCard";
import { SearchProductAPI } from "../features/search/searchThunk";
import { NavLink, useOutletContext } from "react-router-dom";
import PageWapper from "../components/layout/PageWapper";
import { clearSearch } from "../features/search/searchSlice";
import ProductLoading from "../components/ProductLoading/ProductLoading";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const SearchProduct = memo(function SearchProduct() {
  const [sideBar, setSideBar] = useState(false);
  const { searchQuery } = useOutletContext();
  const [order, setOrder] = useState("Relevance");

  const countProduct = useSelector(
    (state) => state.searchProduct.searchProductCount,
  );

  const searchProduct = useSelector((state) => state.searchProduct?.product);
  const { loading, error } = useSelector((state) => state.searchProduct);

  const dispatch = useDispatch();
  const timerRef = useRef(null);

  const ProductSearchUser = (query) => {
    if (!query || query.trim() === "") {
      dispatch(clearSearch());
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        await dispatch(SearchProductAPI({ query, filterData: order }));
      } catch {
        console.log("Failed to search product");
      }
    }, 1000);
  };

  useEffect(() => {
    ProductSearchUser(searchQuery);
    return () => clearTimeout(timerRef.current);
  }, [searchQuery, dispatch, order]);

  useEffect(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }
  }, [error]);

  const hasNoResults =
    !loading && searchQuery && searchProduct && searchProduct.length === 0;

  return (
    <div className="h-screen">
      <Helmet>
        <title>Venture | Search</title>
        <meta
          name="description"
          content="Shop fashion, mobile and more at Venture"
        />
      </Helmet>

      <main className="flex justify-center overflow-hidden">
        <PageWapper className={`w-screen`}>
          <div className="overflow-y-auto">
            {searchQuery && (
              <div className="flex justify-between items-center mb-4 w-full p-2 px-4">
                <div className="text-sm text-gray-500">
                  {countProduct} Results for{" "}
                  <span className="font-medium text-gray-800">
                    "{searchQuery}"
                  </span>
                </div>
                <div>
                  <select
                    className="text-sm border border-gray-200 rounded-md px-2 py-1 outline-none"
                    onChange={(e) => setOrder(e.target.value)}
                    value={order}
                  >
                    <option value="Relevance">Relevance</option>
                    <option value="Low_to_High">Price: Low to High</option>
                    <option value="High_to_Low">Price: High to Low</option>
                  </select>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-center items-center">
                <ProductLoading />
              </div>
            )}

            {hasNoResults && (
              <p className="text-center text-gray-500 py-10">
                No results found for "{searchQuery}"
              </p>
            )}

            {!loading && (
              <div className="grid grid-cols-5 max-[1150px]:grid-cols-4 max-[930px]:grid-cols-3 max-[700px]:flex max-[700px]:flex-wrap gap-3 place-content-center place-items-center overflow-hidden py-10">
                {searchProduct &&
                  searchProduct?.map((item) => (
                    <NavLink key={item?.id} to={`/product/${item?.id}`}>
                      <ProductCard item={item} />
                    </NavLink>
                  ))}
              </div>
            )}
          </div>

          {sideBar && (
            <aside className="w-64 shrink-0 border-l border-gray-200 bg-white px-4 py-5 flex flex-col overflow-y-auto">
              <Cart setSideBar={setSideBar} sideBarOpen={sideBar} />
            </aside>
          )}
        </PageWapper>
      </main>
    </div>
  );
});

export default SearchProduct;