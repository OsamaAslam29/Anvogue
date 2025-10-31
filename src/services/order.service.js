import http from "./http.service";
import Promisable from "./promisable.service";

const url = "order"; // adjust if your API path differs

const OrderService = {
  list: async () => {
    http.setJWT?.();
    const [success, error] = await Promisable.asPromise(http.get(`${url}/all/customer`));
    if (success) {
      const data = success.data?.result ?? success.data ?? [];
      return [Array.isArray(data) ? data : [], null];
    }
    return [[], error];
  },
  create: async (orderData) => {
    http.setJWT?.();
    const [success, error] = await Promisable.asPromise(http.post(`${url}/add`, orderData));
    if (success) {
      const data = success.data?.result ?? success.data ?? success.data;
      return [data, null];
    }
    return [null, error];
  },
};

export default OrderService;


