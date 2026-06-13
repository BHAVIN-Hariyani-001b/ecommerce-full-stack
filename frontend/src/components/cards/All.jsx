import { lazy, memo, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomePageProduct } from "../../features/producthome/productHomeThunk";
import ProductCard from "../common/ProductCard";
import ProductCardList from "../common/ProductCardList";
import PageWapper from "../layout/PageWapper";

const HeroBanner = lazy(() => import("../product/HeroBanner"));

const All = memo(function All() {
  const { loading, error } = useSelector((state) => state.homePageProduct);
  const HomePageProduct = useSelector(
    (state) => state.homePageProduct?.HomePageProduct,
  );
  console.log(HomePageProduct);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHomePageProduct());
  }, [dispatch]);

  if (loading)
    return <div className="text-center py-8">Loading products...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <PageWapper>
        <Suspense fallback={<div>loding...</div>}>
          <HeroBanner />
        </Suspense>
        <div className="">
          <div>
            {HomePageProduct.map((item) => (
              <ProductCardList key={item?.id} product={item} />
            ))}
          </div>
        </div>
      </PageWapper>
    </div>
  );
});

export default All;
