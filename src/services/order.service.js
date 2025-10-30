import http from "./http.service";
import Promisable from "./promisable.service";

const url = "order"; // adjust if your API path differs

const OrderService = {
  list: async () => {
    http.setJWT?.();
    const [success, error] = await Promisable.asPromise(http.get(`${url}/all`));
    if (success) {
      const data = success.data?.result ?? success.data ?? [];
      return [Array.isArray(data) ? data : [], null];
    }
    return [[], error];
  },
};

export default OrderService;


