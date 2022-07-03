const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    // domain:
    //   process.env.NODE_ENV === 'production'
    //     ? 'https://test-cookies-yoo.netlify.app/'
    //     : '',
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneMonth),
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    // domain:
    //   process.env.NODE_ENV === 'production'
    //     ? 'https://test-cookies-yoo.netlify.app/'
    //     : '',
  });
};

module.exports = { createJWT, isTokenValid, attachCookiesToResponse };
