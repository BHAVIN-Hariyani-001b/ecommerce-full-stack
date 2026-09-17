import ProductPageImage from "./ProductPageImage";
import ProductDetails from "./ProductDetails";

const ProductAdd = ({ setCheckOut }) => {
  return (
    <div className="h-140 overflow-scroll space-y-3 scrollbar-none">
      <ProductPageImage />
      <ProductDetails setCheckOut={setCheckOut} />
    </div>
  );
};

export default ProductAdd;
