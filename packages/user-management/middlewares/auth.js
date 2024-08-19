const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('utility/utils/ApiError');
const { UserTypes } = require('utility/config/constant');
const { tokenTypes } = require('utility/config/tokens');
const { partnerProfileService, internalProfileService } = require('../services');
const { Token } = require('../models');

const verifyCallback = (req, resolve, reject, type) => async (err, user, info) => {
  const token = req.headers.authorization;
  if (type === 'public' && !token) {
    req.user = { userType: 'public' };
    return resolve();
  }
  if (!token) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  const authTokenDoc = await Token.findOne({
    token: token.substring(7, token.length),
    type: tokenTypes.ACCESS,
  });

  if (err || info || !user || (authTokenDoc !== null && authTokenDoc.blacklisted)) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  req.user = { id: user._doc._id.toString(), ...user._doc };
  if (user.userType === UserTypes.TENANT || user.userType === UserTypes.LANDLORD) {
    req.user.role = user.userType;
    req.user.eqaroId = user.eqaroId;
  } else if (user.userType === UserTypes.INTERNAL) {
    const result = await internalProfileService.queryInternalProfiles({ userId: req.user._id }, {});
    if (result.results.length === 0) {
      return reject(new ApiError(httpStatus.NOT_FOUND, 'Internal Profile Not Found..!!'));
    }
    req.user.role = result.results[0].role;
    req.user.eqaroId = result.results[0].eqaroId;
  } else if (user.userType === UserTypes.PARTNER) {
    const result = await partnerProfileService.queryPartnerProfiles({ userId: req.user._id }, {});
    if (result.results.length === 0) {
      return reject(new ApiError(httpStatus.NOT_FOUND, 'Partner Profile Not Found..!!'));
    }
    req.user.role = result.results[0].role;
    req.user.eqaroId = result.results[0].eqaroId;
  }

  resolve();
};

const auth = (type) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, type))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
