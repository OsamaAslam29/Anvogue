import axios from 'axios';
import configs from '../config/index';
import ToasterService from '../utils/toaster.util';
import AuthService from './auth.service';
import { log } from '../utils/logger.util';

const { CancelToken } = axios;

let source = CancelToken.source();

axios.defaults.baseURL = configs.API_URL;

axios.interceptors.request.use(
  (config) => {
    const { url, data, method } = config;

    log(`http ${method} request`, url, '\n', data);

    return { ...config, cancelToken: source.token };
  },
  (error) => Promise.reject(error)
);
axios.interceptors.response.use(
  (res) => {
    const { config } = res;
    const { url, method } = config;
    const { result, message } = res.data;

    log(`http ${method} response`, url, '\n', result);
    ToasterService.showSuccess(message);

    return res;
  },
  (err) => {
    const { config, message: msg, response } = err;
    const message = response?.data?.message;
    const { url, method } = config;

    log(`http ${method} error`, url, message || msg);
    ToasterService.showError(message || msg);

    if (!response) throw err;

    const code = response.data.statusCode;

    if (
      code === 401 ||
      message === 'Session has expired' ||
      message === 'Unauthorized Access'
    ) {
      AuthService.logout();
      source.cancel(message);

      setTimeout(() => {
        source = CancelToken.source();

        if (window.location.pathname !== '/') window.location.assign('/');
      }, 300);
    }

    throw err;
  }
);
const http = {
  get: axios.get,
  put: axios.put,
  post: axios.post,
  patch: axios.patch,
  delete: axios.delete,
  getUserBaseUrl: () => configs.USER_API_URL,
  setJWT: () => {
    axios.defaults.headers.common.Authorization =
      localStorage.getItem('token') || '';
    axios.defaults.headers.common.Branchid =
      localStorage.getItem('branchId') || '';
  },
  setMultiPart: () => ({ headers: { 'Content-Type': 'multipart/form-data' } })
};

export default http;
