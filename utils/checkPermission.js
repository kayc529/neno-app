const CustomerError = require('../errors');
const checkPermission = (requestUserId, resourceUserId) => {
  if (requestUserId === requestUserId.toString()) return;
  throw new CustomerError.UnauthorizedError(
    'Not authorized to access this route'
  );
};

module.exports = checkPermission;
