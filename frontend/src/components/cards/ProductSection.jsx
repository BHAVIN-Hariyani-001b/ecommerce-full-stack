import { memo } from "react";

const ProductSection = memo(function ProductSection({ category }) {
  return (
    <div>
      <h1>{category}</h1>
    </div>
  );
});

export default ProductSection;
