import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storageDefault from "redux-persist/lib/storage";
import rootReducer from "../features/rootReducer";

const storage = storageDefault.default || storageDefault;

const persistConfig = {
  key: "store",
  storage,
  whitelist: ["category", "auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
