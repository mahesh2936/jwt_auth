const rateLimit = require('express-rate-limit');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const authLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  headers: true,
  keyGenerator(req) {
    return req.body.email;
  },
  skipSuccessfulRequests: true,
  handler(/* , next */) {
    throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many unsuccessfull attempts. Please try again after 24 hrs!!');
  },
});

const apiCalledLimiter = rateLimit({
  windowMs: 5 * 60 * 60 * 1000,
  max: 5,
  handler(/* , next */) {
    throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many reuquests. Try again after 5 hrs!!');
  },
});

module.exports = {
  authLimiter,
  apiCalledLimiter,
};
