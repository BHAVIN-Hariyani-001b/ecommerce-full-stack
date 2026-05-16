import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import SearchProduct from "./pages/SearchProduct.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store.js";
import { setupInterceptors } from "./middleware/index.js";
import Dashboard from "./admin/pages/Dashboard/Dashboard.jsx";
import "./index.css";

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
        path : "/admin",
        element : <Dashboard />
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
