import React from "react";
import { useSelector } from "react-redux";

const ProductAbout = () => {

  const product = useSelector((state) => state.product.product);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold">About This Item</h1>
        <div
          className="py-2"
          dangerouslySetInnerHTML={{ __html: product.aboutItem }}
        />
      </div>
    </div>
  );
};

export default ProductAbout;
