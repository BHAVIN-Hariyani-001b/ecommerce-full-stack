import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store.js";
import { setupInterceptors } from "./middleware/index.js";
import "./index.css";
import Loding from "./components/common/Loding.jsx";

const Home = lazy(() => import("./pages/Home"));
const SearchProduct = lazy(() => import("./pages/SearchProduct"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard/Dashboard"));

// Setup axios interceptors after store is created
setupInterceptors(store);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/search",
        element: <SearchProduct />,
      },
      {
        path: "/admin",
        element: <Dashboard />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<Loding />}>
          <RouterProvider router={router} />
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
