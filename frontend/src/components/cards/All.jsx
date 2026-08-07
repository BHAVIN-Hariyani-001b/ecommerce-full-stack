import { lazy, memo, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomePageProduct } from "../../features/producthome/productHomeThunk";
import ProductCardList from "../common/ProductCardList";
import PageWapper from "../layout/PageWapper";
import HomePageLoading from "../ProductLoading/HomePageLoading";
import { toast } from "react-toastify";
import Loding from "../common/Loding";
import { getErrorMessage } from "../../util/getErrorMessage";
import ProductCardOther from "../common/ProductCardOther";

const HeroBanner = lazy(() => import("../product/HeroBanner"));

const All = memo(function All() {
  const { loading, error } = useSelector((state) => state.homePageProduct);
  const HomePageProduct = useSelector(
    (state) => state.homePageProduct?.HomePageProduct,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHomePageProduct());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error));
    }
  }, [error]);

  if (loading) return <HomePageLoading />;

  return (
    <PageWapper>
      <Suspense fallback={<Loding />}>
        <HeroBanner />
      </Suspense>
      {HomePageProduct.map((item) => (
        <ProductCardList key={item?.id} product={item} />
      ))}
    </PageWapper>
  );
});

export default All;
