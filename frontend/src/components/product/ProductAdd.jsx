import ProductPageImage from "./ProductPageImage";
import ProductDetails from "./ProductDetails";

const ProductAdd = () => {
  return (
    <div className="h-140 overflow-scroll space-y-3 scrollbar-none">
      <ProductPageImage />
      <ProductDetails />
    </div>
  );
};

export default ProductAdd;
