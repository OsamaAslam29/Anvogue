import http from "./http.service";
import Promisable from "./promisable.service";
import { setUser, clearUser } from "@/redux/slices/authSlice";

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

  login: async (data, navigate, dispatch) => {
    const config = {
      baseURL: http.getUserBaseUrl(),
    };

    const [success, error] = await Promisable.asPromise(
      http.post(`${url}/login`, data, config)
    );

    if (success) {
      const { result } = success.data;
      const token = result.token;
      try {
        localStorage.setItem("token", `Bearer ${token}`);
        // Persist full user payload for UI rendering (name, email, role, etc.)
        // The backend returns { result: { token, ...userFields } }
        const persistedUser = { ...result };
        // Ensure token is included on the user object for easy access if needed
        if (!persistedUser.token) persistedUser.token = token;
        localStorage.setItem("user", JSON.stringify(persistedUser));
      } catch {}
      // update redux state if provided
      dispatch?.(setUser({ ...result }));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'));
      }
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
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
    } catch {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }
    // update redux state
    dispatch?.(clearUser());
    if (navigate?.push) {
      navigate.push("/");
    } else if (typeof navigate === 'function') {
      navigate("/");
    }
  },
};

export default AuthService;
