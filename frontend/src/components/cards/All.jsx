import { lazy, memo, Suspense } from "react";

const HeroBanner = lazy(() => import("../product/HeroBanner"));

const All = memo(function All() {
  return (
    <div>
      <Suspense fallback={<div>loding...</div>}>
        <HeroBanner />
      </Suspense>
    </div>
  );
});

export default All;
