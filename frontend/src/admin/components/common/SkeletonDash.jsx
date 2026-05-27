import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const SkeletonDash = () => {
  return (
    <div className="p-4">
      <Stack spacing={2}>
        <Skeleton animation="wave" variant="rounded" sx={{ fontSize: "1rem" }} />
        <div className="flex gap-4">
          <Skeleton
            height={100} width={100} animation="wave" variant="rounded"
          />
          <Skeleton
            height={100} width={100} animation="wave" variant="rounded"
          />
          <Skeleton
            height={100} width={100} animation="wave" variant="rounded"
          />
        </div>
        <Skeleton
          animation="wave"
          variant="rounded"
          sx={{ fontSize: "1rem" }}
        />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton height={100} animation="wave" variant="rounded" />
          <Skeleton height={100} animation="wave" variant="rounded" />
          <Skeleton height={100} animation="wave" variant="rounded" />
          <Skeleton height={100} animation="wave" variant="rounded" />
        </div>
        <Skeleton height={60} animation="wave" variant="rounded" />
      </Stack>
    </div>
  );
};

export default SkeletonDash;
