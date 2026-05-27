import { memo } from "react";
import { Outlet } from "react-router-dom";

const App = memo(function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
});

export default App;
