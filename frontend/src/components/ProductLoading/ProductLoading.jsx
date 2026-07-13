import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const ProductLoading = () => {
  return (
    <div className="p-1">
      <Stack spacing={1}>
        <div className="flex gap-2 flex-wrap justify-center items-center">
          {Array.from({ length: 20 }, (_, index) => (
            <Skeleton key={index} variant="rounded" className="w-35 max-[400px]:w-28" height={180} />
          ))}
        </div>
      </Stack>
    </div>
  );
};

export default ProductLoading;
