import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";

const ProductLoading = () => {
  const countProduct = useSelector(
    (state) => state.searchProduct.searchProductCount,
  ) || 10;
  return (
    <div className="p-10">
      <Stack spacing={1}>
        <div className="flex gap-4 flex-wrap">
          {Array.from({ length: countProduct }, (_, index) => (
            <Skeleton key={index} variant="rounded" width={160} height={200} />
          ))}
        </div>
      </Stack>
    </div>
  );
};

export default ProductLoading;
