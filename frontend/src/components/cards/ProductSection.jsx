import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryProduct } from "../../features/categoryProduct/categoryProductThunk";
import ProductCard from "../common/ProductCard";
import PageWapper from "../layout/PageWapper";

const ProductSection = memo(function ProductSection() {
  const categoryProduct = useSelector(
    (state) => state.categoryProduct.products,
  );
  const active = useSelector((state) => state.userCategory.active);
  console.log(categoryProduct);
  const dispatch = useDispatch();

  useEffect(() => {
    if (active) {
      dispatch(fetchCategoryProduct(String(active)));
    }
  }, [dispatch, active]);
  return (
    <div>
      <PageWapper>
        <h1 className="py-4 px-3 text-2xl font-semibold">{active}</h1>
        <div className="flex flex-wrap justify-center items-center max-[600px]:grid max-[600px]:grid-cols-2 max-[600px]:gap-4 max-[600px]:place-items-center">
          {categoryProduct.map((item) => (
            <ProductCard key={item?.id} item={item} />
          ))}
        </div>
      </PageWapper>
    </div>
  );
});

export default ProductSection;
