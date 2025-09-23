import { categoryActions } from "@/redux/slices/categorySlice";
import http from "./http.service";
import Promisable from "./promisable.service";

const CategoryService = {
  getAll: async (dispatch) => {
    // const config = {
    //   baseURL: http.getUserBaseUrl(),
    // };

    const [success, error] = await Promisable.asPromise(
      http.get(`category/all`)
    );

    if (success) {
      const { result } = success.data;
      dispatch(categoryActions.setCategories(result));
    }

    return [success, error];
  },
};

export default CategoryService;
