//non-sensitive user info to be attached to the cookie
const createTokenUser = (user) => {
  return { userId: user._id, username: user.username, role: user.role };
};

module.exports = createTokenUser;
