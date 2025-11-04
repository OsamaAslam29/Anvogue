import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import compareReducer from "./slices/compareSlice";
import authReducer from "./slices/authSlice";
import ordersReducer from "./slices/ordersSlice";
import emiReducer from "./slices/emiSlice";
import footerReducer from "./slices/footerSlice";

// Create a storage that only works on client side
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? require("redux-persist/lib/storage").default
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["categories", "products", "cart", "wishlist", "compare", "auth", "orders", "emi", "footer"], // Only persist these reducers
};

const rootReducer = combineReducers({
  products: productReducer,
  categories: categoryReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  compare: compareReducer,
  auth: authReducer,
  orders: ordersReducer,
  emi: emiReducer,
  footer: footerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
