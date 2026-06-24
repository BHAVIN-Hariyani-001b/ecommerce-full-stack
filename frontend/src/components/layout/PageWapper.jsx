import { memo } from "react";

const PageWapper = memo(function PageWapper({ children, className }) {
  return (
    <div className={`mx-auto w-full min-w-0 max-w-310 ${className ?? ""}`}>
      {children}
    </div>
  );
});

export default PageWapper;
