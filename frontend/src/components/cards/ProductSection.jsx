import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryProduct } from "../../features/categoryProduct/categoryProductThunk";
import ProductCard from "../common/ProductCard";
import PageWapper from "../layout/PageWapper";
import ProductLoading from "../ProductLoading/ProductLoading";
import { toast } from "react-toastify";

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
    <div>
      <PageWapper>
        {loading && <ProductLoading />}
        {!loading && (
          <>
            <h1 className="py-4 px-3 text-2xl font-semibold">{active}</h1>
            <div className="grid grid-cols-6 max-[1100px]:grid-cols-5 max-[900px]:grid-cols-4 max-[700px]:grid-cols-3 max-[600px]:flex max-[600px]:flex-wrap max-[600px]:justify-center place-items-center">
              {categoryProduct.map((item) => (
                <ProductCard key={item?.id} item={item} />
              ))}
            </div>
          </>
        )}
      </PageWapper>
    </div>
  );
});

export default ProductSection;
