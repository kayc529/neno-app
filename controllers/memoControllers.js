const Memo = require('../models/Memo');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermission } = require('../utils');

const getAllMemos = async (req, res) => {
  const user = req.user;

  const memos = await Memo.find({
    user: user.userId,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    memos,
    count: memos.length,
  });
};

const getMemo = async (req, res) => {
  const { id: memoId } = req.params;
  const userId = req.user.userId;
  const memo = await Memo.findOne({
    _id: memoId,
  });

  if (!memo) {
    throw new CustomError.NotFoundError(`No memo with id ${memoId}`);
  }

  checkPermission(userId, memo.user);
  res.status(StatusCodes.OK).json({ success: true, memo });
};

const createMemo = async (req, res) => {
  const user = req.user;
  const newMemo = await Memo.create({ ...req.body, user: user.userId });
  res.status(StatusCodes.CREATED).json({ success: true, memo: newMemo });
};

const updateMemo = async (req, res) => {
  const { id: memoId } = req.params;
  const memo = await Memo.findOne({
    _id: memoId,
  });

  if (!memo) {
    throw new CustomError.NotFoundError(`No memo with id ${memoId}`);
  }

  checkPermission(req.user.userId, memo.user);

  const updatedMemo = await Memo.findOneAndUpdate(
    {
      _id: memoId,
    },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(StatusCodes.OK).json({ success: true, memo: updatedMemo });
};

const deleteMemo = async (req, res) => {
  const { id: memoId } = req.params;
  const memo = await Memo.findOne({
    _id: memoId,
  });

  if (!memo) {
    throw new CustomError.NotFoundError(`No memo with id ${memoId}`);
  }

  checkPermission(req.user.userId, memo.user);

  await Memo.findOneAndDelete({ _id: memoId });

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = { getAllMemos, getMemo, createMemo, updateMemo, deleteMemo };
