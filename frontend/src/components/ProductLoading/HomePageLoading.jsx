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
            <Skeleton variant="rounded" className="w-287" height={300} />
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {Array.from({ length: 20 }, (_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                className="w-35 max-[400px]:w-28"
                height={160}
              />
            ))}
          </div>
        </Stack>
      </PageWapper>
    </div>
  );
};

export default HomePageLoading;
