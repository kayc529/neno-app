const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getUserProfile,
  updateProfile,
  verifyEmail,
  verifyForgetPasswordInfo,
  verifySecurityAnswer,
  verifyPasswordToken,
  resetPassword,
} = require('../controllers/authControllers');
const { authenticateUser } = require('../middleware/authentication');

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser, logout);
// router.post('/verify-email', verifyEmail);
router.get('/profile', authenticateUser, getUserProfile);
router.patch('/update-profile', authenticateUser, updateProfile);
router.post('/get-security', verifyForgetPasswordInfo);
router.post('/forgot-password', verifySecurityAnswer);
router
  .route('/reset-password/:passwordToken')
  .get(verifyPasswordToken)
  .post(resetPassword);

module.exports = router;
