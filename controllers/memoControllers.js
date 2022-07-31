const Memo = require('../models/Memo');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermission } = require('../utils');

const getAllMemos = async (req, res) => {
  const user = req.user;
  const { pinned, keyword, start, end, sorting } = req.query;
  const queryObject = {};

  queryObject.user = user.userId;

  if (pinned) {
    queryObject.isPinned = pinned === 'true';
  }

  if (keyword) {
    const re = new RegExp(keyword, 'i');
    queryObject.$or = [
      {
        content: { $regex: re },
      },
      { title: { $regex: re } },
      { tags: { $regex: re } },
    ];
  }

  if (start) {
    queryObject.createdAt = { $gte: new Date(start) };
  }

  if (end) {
    queryObject.createdAt = queryObject.createdAt
      ? { ...queryObject.createdAt, $lte: new Date(end) }
      : { $lte: new Date(end) };
  }

  //filter
  let result = Memo.find(queryObject);

  //sorting -:desc
  result = sorting
    ? result.sort(`-isPinned ${sorting}`)
    : result.sort(`-isPinned -updatedAt`);

  const memos = await result;

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
