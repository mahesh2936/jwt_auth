const httpStatus = require('http-status');
const axios = require('axios').default;
const ApiError = require('./ApiError');

const AxiosError = (err, next) => {
  if (err.response) {
    const { data, status } = err.response;
    if (data) {
      const nodeError = { statusCode: status, message: data.msg || data.message, stack: data.stack };
      if (next) next(nodeError);
      else throw new ApiError(nodeError.statusCode, nodeError.message, nodeError.stack);
    } else if (next) next(err);
    else throw new ApiError(httpStatus[500], '');
  } else throw new ApiError(httpStatus[500], JSON.stringify(err));
};

// Interceptors take 2 parameters:
// Axios calls the first function if the request succeeds
// Axios calls the second function if the request fails
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    AxiosError(err);
  }
);

module.exports = axios;
