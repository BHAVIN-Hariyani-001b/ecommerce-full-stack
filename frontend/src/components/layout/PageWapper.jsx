import { memo } from "react";

const PageWapper = memo(function PageWapper({ children, className }) {
  return <div className={`max-w-310  ${className}`}>{children}</div>;
});

export default PageWapper;
