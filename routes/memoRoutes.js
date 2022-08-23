const express = require('express');
const router = express.Router();
const {
  getAllMemos,
  getArchivedMemos,
  getMemo,
  createMemo,
  updateMemo,
  deleteMemo,
} = require('../controllers/memoControllers');
const { authenticateUser } = require('../middleware/authentication');

router
  .route('/')
  .get(authenticateUser, getAllMemos)
  .post(authenticateUser, createMemo);

router.route('/archive').get(authenticateUser, getArchivedMemos);

router
  .route('/:id')
  .get(authenticateUser, getMemo)
  .patch(authenticateUser, updateMemo)
  .delete(authenticateUser, deleteMemo);

module.exports = router;
