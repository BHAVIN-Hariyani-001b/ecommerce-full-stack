import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import PageWapper from "../layout/PageWapper";

const HomePageLoading = () => {
  return (
    <div className="flex justify-center">
      <PageWapper>
        <Stack spacing={3}>
          <div className="flex justify-center items-center max-[600px]:hidden">
            <Skeleton variant="rounded" className="w-full" height={300} />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Skeleton variant="rounded" width={180} height={200} />
            <Skeleton variant="rounded" width={180} height={200} />
            <Skeleton variant="rounded" width={180} height={200} />
            <Skeleton variant="rounded" width={180} height={200} />
            <Skeleton variant="rounded" width={180} height={200} />
            <Skeleton variant="rounded" width={180} height={200} />
          </div>
        </Stack>
      </PageWapper>
    </div>
  );
};

export default HomePageLoading;
