import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryProduct } from "../../features/categoryProduct/categoryProductThunk";
import ProductCard from "../common/ProductCard";
import PageWapper from "../layout/PageWapper";
import ProductLoading from "../ProductLoading/ProductLoading";
import { toast } from "react-toastify";
import HeroBanner from "../product/HeroBanner";
import { NavLink } from "react-router-dom";

const ProductSection = memo(function ProductSection() {
  const categoryProduct = useSelector(
    (state) => state.categoryProduct.products,
  );
  const { loading, error } = useSelector((state) => state.categoryProduct);
  const active = useSelector((state) => state.userCategory.active);
  const dispatch = useDispatch();

  useEffect(() => {
    if (active) {
      dispatch(fetchCategoryProduct(String(active)));
    }
  }, [dispatch, active]);

  if (error) {
    return toast.error(error);
  }

  return (
    <PageWapper>
      {loading && <ProductLoading />}
      {!loading && (
        <>
          <HeroBanner />
          <h1 className="py-4 px-3 text-2xl font-semibold">{active}</h1>
          <div className="grid grid-cols-5 max-[1150px]:grid-cols-4 max-[930px]:grid-cols-3 max-[700px]:flex max-[700px]:flex-wrap gap-3 place-content-center place-items-center">
            {categoryProduct.map((item) => (
              <NavLink key={item?.id} state={{item:item}} to={`/product/${item?.id}`}>
                <ProductCard item={item} />
              </NavLink>
            ))}
          </div>
        </>
      )}
    </PageWapper>
  );
});

export default ProductSection;
