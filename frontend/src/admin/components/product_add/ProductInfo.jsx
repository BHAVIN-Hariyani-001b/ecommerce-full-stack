import { memo, useCallback } from "react";
import BasicInfo from "./BasicInfo";
import PriceInvetary from "./PriceInvetary";



const ProductInfo = memo(function ProductInfo({ productData, setProductData }) {
  const handleOnChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setProductData((prev) => ({ ...prev, [name]: value }));
    },
    [setProductData],
  );

  return (

    <div className="flex flex-col gap-4">
      <BasicInfo productData={productData} handleOnChange={handleOnChange} />
      <PriceInvetary productData={productData} handleOnChange={handleOnChange} />
    </div>
  );
});



export default ProductInfo;

