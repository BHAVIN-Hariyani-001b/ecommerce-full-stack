import { memo } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = memo(function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={1500} />
      <Outlet />
    </div>
  );
});

export default App;
