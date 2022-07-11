const CustomError = require('../errors');
const { isTokenValid, attachCookiesToResponse } = require('../utils');
const Token = require('../models/Token');

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    //if accessToken is present, get user from accessToken
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    //if accessToken is absent, get user from refreshToken
    //and check if the refreshToken matches the one in the DB
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    //if no existing token for that user in the DB
    //or the refreshToken is set to invalid
    if (!existingToken || !existingToken.isValid) {
      throw new CustomerError.UnauthenticatedError('Authentication Invalid');
    }

    //resend cookies to the client
    //(reset the expiry time for the cookies whenever the user makes an API call)
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    //add user to the request for controller
    req.user = payload.user;

    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

module.exports = { authenticateUser };
