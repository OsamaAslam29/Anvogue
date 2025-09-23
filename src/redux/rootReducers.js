import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";

const rootReducer = combineReducers({
  products: productReducer,
  categories: categoryReducer,
});

export default rootReducer;
