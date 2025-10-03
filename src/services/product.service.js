import { productActions } from "@/redux/slices/productSlice";
import http from "./http.service";
import Promisable from "./promisable.service";

const ProductService = {
  getAll: async (dispatch) => {
    const [success, error] = await Promisable.asPromise(
      http.get(`product/all`)
    );

    if (success) {
      const { result } = success.data;
      dispatch(productActions.setProducts(result));
    }

    return [success, error];
  },
  getAllByCategory: async (categoryId, dispatch) => {
    const [success, error] = await Promisable.asPromise(
      http.get(`product/${categoryId}`)
    );

    if (success) {
      const { result } = success.data;
      dispatch(productActions.setProducts(result));
    }

    return [success, error];
  },
  getById: async (id, dispatch) => {
    dispatch(productActions.setLoading(true));
    const [success, error] = await Promisable.asPromise(
      http.get(`product/${id}`)
    );

    if (success) {
      const { result } = success.data;
      dispatch(productActions.setSelectedProduct(result));
    }
    dispatch(productActions.setLoading(false));

    return [success, error];
  },
};

export default ProductService;
