import { footerActions } from "@/redux/slices/footerSlice";
import http from "./http.service";
import Promisable from "./promisable.service";

const FooterService = {
  getAll: async (dispatch) => {
    dispatch(footerActions.setLoading(true));
    
    try {
      const [success, error] = await Promisable.asPromise(
        http.get(`footer-info/all`)
      );

      if (success) {
        const { result } = success.data;
        // Get the last record from the result array
        const footerInfo = result && result.length > 0 ? result[result.length - 1] : null;
        dispatch(footerActions.setFooterInfo(footerInfo));
      } else {
        dispatch(footerActions.setError(error?.message || "Failed to fetch footer info"));
      }
    } catch (err) {
      dispatch(footerActions.setError(err?.message || "An error occurred"));
    }
    
    dispatch(footerActions.setLoading(false));
    return [true, null];
  },
};

export default FooterService;

