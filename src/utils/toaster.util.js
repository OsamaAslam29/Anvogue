let error;
let success;

const ToasterService = {
  showError: (message) => error?.(message),
  showSuccess: (message) => success?.(message),
  subscribe: (successCB, errorCB) => {
    error = errorCB;
    success = successCB;
  },
};

export default ToasterService;
