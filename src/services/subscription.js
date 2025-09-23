import http from "./http.service";
import Promisable from "./promisable.service";

const url = "subscribe";

const SubscriptionService = {
  add: async (data, navigate) => {
    const config = {
      baseURL: http.getUserBaseUrl(),
    };

    const [success, error] = await Promisable.asPromise(
      http.post(`${url}/add`, data, config)
    );
    if (success && navigate) {
      navigate.push("/");
    }

    return [success, error];
  },
};

export default SubscriptionService;
