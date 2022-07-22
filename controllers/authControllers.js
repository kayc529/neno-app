const User = require('../models/User');
const Token = require('../models/Token');

const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const crypto = require('crypto');
const {
  createTokenUser,
  attachCookiesToResponse,
  createJWT,
  isTokenValid,
} = require('../utils');

const register = async (req, res) => {
  const {
    username,
    email,
    password,
    birthday,
    securityQuestion,
    securityAnswer,
  } = req.body;
  //check if email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError.BadRequestError('Email already exist');
  }

  //generate verificationToken
  const verificationToken = crypto.randomBytes(40).toString('hex');

  //create user in db
  const user = await User.create({
    username,
    email,
    password,
    verificationToken,
    birthday,
    securityQuestion,
    securityAnswer,
  });

  //TODO
  //send verification email

  //TO BE REMOVED
  //ignore verification
  //create token user and refreshtoken
  //attach cookies
  const tokenUser = createTokenUser(user);

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  const token = await Token.create(userToken);

  attachCookiesToResponse({
    res,
    user: tokenUser,
    refreshToken: token.refreshToken,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    user: tokenUser,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  //check if user with that email exists in db
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }

  //check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }

  //TODO
  //check if the user is verified
  //   if (!user.isVerified) {
  //     throw new CustomError.UnauthenticatedError('Please verify your email');
  //   }

  //create token user
  const tokenUser = createTokenUser(user);

  //create refresh token
  let refreshToken = '';

  //check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  //if token exists, check if the refresh token matches
  //match => refresh token = token from db
  //not match => throw unauthenticated error
  //attach cookie to response (tokenUser, refresh token)
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res.status(StatusCodes.OK).json({ success: true, user: tokenUser });
    return;
  }

  //if token does not exist(user logged out before), create new refresh token and write to db
  //attach cookie to response
  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ success: true, user: tokenUser });
};

const logout = async (req, res) => {
  //remove token from db
  await Token.findOneAndDelete({ user: req.user.userId });

  //expires accessToken cookie
  res.cookie('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: -1,
    // path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : '',
    domain: process.env.NODE_ENV === 'production' ? '' : 'localhost',
  });

  //expires refreshToken cookie
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: -1,
    // path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : '',
    domain: process.env.NODE_ENV === 'production' ? '' : 'localhost',
  });

  res.status(200).json({ success: true });
};

const verifyEmail = async (req, res) => {
  res.status(200).send('verifyEmail');
};

const verifyForgetPasswordInfo = async (req, res) => {
  const { email, birthday } = req.body;
  //check if user exists
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError.BadRequestError('Information does not match');
  }

  //check if birthday matches db
  const isBirthdayMatch = user.compareBirthdays(birthday);
  if (!isBirthdayMatch) {
    throw new CustomError.BadRequestError('Information does not match');
  }

  //return security question
  res.status(StatusCodes.OK).json({ securityQuestion: user.securityQuestion });
};

const verifySecurityAnswer = async (req, res) => {
  const { email, securityAnswer } = req.body;
  //get user with that email
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomError.BadRequestError('Information does not match');
  }
  //check if security answer match
  const isAnswerMatch = await user.compareSecurityAnswers(securityAnswer);
  if (!isAnswerMatch) {
    throw new CustomError.BadRequestError('Information does not match');
  }

  //yes => see if change password token exist
  const existingToken = user.passwordToken;
  //token exist => return token
  if (existingToken) {
    return res.status(StatusCodes.OK).json({ passwordToken: existingToken });
  }
  //token not exist => create token (contains user email) and return
  const tokenUser = createTokenUser(user);
  const passwordToken = createJWT({ payload: { user: tokenUser } });

  user.passwordToken = passwordToken;
  await user.save();

  res.status(StatusCodes.OK).json({ passwordToken });
};

const verifyPasswordToken = async (req, res) => {
  const { passwordToken } = req.params;
  let payload;

  try {
    payload = isTokenValid(passwordToken);
    if (payload.user) {
      return res.status(StatusCodes.OK).json({ success: true });
    }

    throw new CustomError.UnauthorizedError('Unauthorized to visit this page');
  } catch (error) {
    throw new CustomError.UnauthorizedError('Unauthorized to visit this page');
  }
};

const resetPassword = async (req, res) => {
  const { passwordToken } = req.params;
  const { newPassword } = req.body;

  //check if passwordToken valid
  const payload = isTokenValid(passwordToken);
  //update password
  const user = await User.findOne({ _id: payload.user.userId });
  user.password = newPassword;
  user.passwordToken = null;
  await user.save();

  res.status(StatusCodes.OK).json({ success: true, msg: 'Password updated' });
};

module.exports = {
  login,
  register,
  logout,
  verifyEmail,
  verifySecurityAnswer,
  verifyForgetPasswordInfo,
  verifyPasswordToken,
  resetPassword,
};
