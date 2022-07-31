const CustomerError = require('../errors');
const checkPermission = (requestUserId, resourceUserId) => {
  if (requestUserId === resourceUserId.toString()) return;
  throw new CustomerError.UnauthorizedError(
    'Not authorized to access this route'
  );
};

module.exports = checkPermission;
