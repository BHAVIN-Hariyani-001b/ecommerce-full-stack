import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const SkeletonAddProduct = () => {
  return (
    <div className="border p-3 border-gray-200 rounded-xl">
      <Stack spacing={2} className="space-y-2">
        <Skeleton animation="wave" variant="text" sx={{ fontSize: "2rem" }} />
        <Skeleton animation="wave" variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton animation="wave" variant="rounded" height={60} />
        <Skeleton animation="wave" variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton animation="wave" variant="rounded" height={60} />
        <Skeleton animation="wave" variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton animation="wave" variant="rounded" height={100} />
      </Stack>
    </div>
  );
};

export default SkeletonAddProduct;
