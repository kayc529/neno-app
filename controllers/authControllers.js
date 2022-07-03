const User = require('../models/User');
const Token = require('../models/Token');

const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const crypto = require('crypto');
const { createTokenUser, attachCookiesToResponse } = require('../utils');

const register = async (req, res) => {
  const { username, email, password } = req.body;
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
  });

  //send verification email

  //send res
  res.status(StatusCodes.CREATED).json({
    username: user.username,
    email: user.email,
    role: user.role,
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

    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  //if token does not exist, create new refresh token and write to db
  //attach cookie to response
  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  //remove token from db
  // await Token.findOneAndDelete({ user: req.user.userId });

  console.log('server logout');
  //expires accessToken cookie
  res.cookie('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: -1,
    path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : '',
    domain: process.env.NODE_ENV === 'production' ? '' : 'localhost',
  });

  //expires refreshToken cookie
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: -1,
    path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : '',
    domain: process.env.NODE_ENV === 'production' ? '' : 'localhost',
  });

  res.status(200).json({ success: true });
};

const verifyEmail = async (req, res) => {
  res.status(200).send('verifyEmail');
};

const forgotPassword = async (req, res) => {
  res.status(200).send('forgotPassword');
};

const resetPassword = async (req, res) => {
  res.status(200).send('resetPassword');
};

module.exports = {
  login,
  register,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
