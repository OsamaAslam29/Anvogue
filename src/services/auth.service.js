import http from "./http.service";
import Promisable from "./promisable.service";

const url = "auth";

const AuthService = {
  register: async (data, navigate) => {
    const config = {
      baseURL: http.getUserBaseUrl(),
    };

    const [success, error] = await Promisable.asPromise(
      http.post(`${url}/signup`, data, config)
    );
    if (success && navigate) {
      navigate.push("/login");
    }

    return [success, error];
  },

  login: async (data, navigate) => {
    const config = {
      baseURL: http.getUserBaseUrl(),
    };

    const [success, error] = await Promisable.asPromise(
      http.post(`${url}/login`, data, config)
    );

    if (success) {
      const { result } = success.data;

      const token = result.token;
      localStorage.setItem("token", `Bearer ${token}`);
      navigate.push("/");
    }

    return [success, error];
  },

  forgotPassword: async (data, navigate) => {
    const config = { baseURL: http.getUserBaseUrl() };
    const [success, error] = await Promisable.asPromise(
      http.post(`${url}/forgot-password-request`, data, config)
    );

    if (success) {
      navigate.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    }

    return [success, error];
  },
  newPassword: async (data, navigate) => {
    const config = { baseURL: http.getUserBaseUrl() };
    const [success, error] = await Promisable.asPromise(
      http.post(`${url}/set-forgot-password`, data, config)
    );

    if (success) {
      navigate.push("/login");
    }

    return [success, error];
  },
  // updatePassword: async (data, dispatch) => {
  //   dispatch?.(authActions.setLoading(true));
  //   const config = { baseURL: http.getUserBaseUrl() };
  //   const [success, error] = await Promisable.asPromise(
  //     http.post('/forgotPassword/update', data, config)
  //   );

  //   if (success) {
  //     const { result } = success.data;
  //     dispatch?.(authActions.setUser(result));
  //     dispatch?.(modalActions.closeModal());
  //   }

  //   dispatch?.(authActions.setLoading(false));

  //   return [success, error];
  // },
  logout: (dispatch, navigate) => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
    dispatch?.(authActions.logout());
    dispatch?.(authActions.setUser(null));
  },
};

export default AuthService;
