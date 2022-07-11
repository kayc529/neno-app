const createTokenUser = require('./createTokenUser');
const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const checkPermission = require('./checkPermission');

module.exports = {
  createTokenUser,
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  checkPermission,
};
