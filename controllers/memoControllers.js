const Memo = require('../models/Memo');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermission } = require('../utils');

//PAGINATION CONSTANTS
const ITEM_PER_PAGE = 12;

const getAllMemos = async (req, res) => {
  const user = req.user;
  const { pinned, keyword, start, end, sorting, page } = req.query;
  const queryObject = {};

  //get memos of that user only
  queryObject.user = user.userId;
  //get unarchived memos only
  queryObject.isArchived = false;

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
    //set to end of the day
    let endDate = new Date(end);
    endDate.setUTCHours(23, 59, 59, 999);
    queryObject.createdAt = queryObject.createdAt
      ? { ...queryObject.createdAt, $lte: endDate }
      : { $lte: endDate };
  }

  //filter
  let result = Memo.find(queryObject);

  //sorting -:desc
  result = sorting
    ? result.sort(`-isPinned ${sorting}`)
    : result.sort(`-isPinned -updatedAt`);

  //get memo with query
  let memos = await result;

  //TODO optimization
  //pagination
  const count = memos.length;
  const numOfPages = Math.ceil(memos.length / ITEM_PER_PAGE);
  let pageNum = Number(page) || 1;
  pageNum = pageNum > numOfPages ? numOfPages : pageNum;
  const startingIndex = (pageNum - 1) * ITEM_PER_PAGE;
  const endingIndex =
    startingIndex + ITEM_PER_PAGE >= count
      ? count
      : startingIndex + ITEM_PER_PAGE;

  memos = memos.slice(startingIndex, endingIndex);

  res.status(StatusCodes.OK).json({
    success: true,
    memos,
    count,
    numOfPages: numOfPages || 1,
  });
};

const getArchivedMemos = async (req, res) => {
  const user = req.user;
  const { keyword, page } = req.query;
  let queryObject = {};

  queryObject.user = user.userId;
  queryObject.isArchived = true;

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

  //filter
  let results = Memo.find(queryObject);
  //sorting
  results = results.sort('-updatedAt');

  let memos = await results;

  //TODO optimization
  //pagination
  const count = memos.length;
  const numOfPages = Math.ceil(memos.length / ITEM_PER_PAGE);
  let pageNum = Number(page) || 1;
  pageNum = pageNum > numOfPages ? numOfPages : pageNum;
  const startingIndex = (pageNum - 1) * ITEM_PER_PAGE;
  const endingIndex =
    startingIndex + ITEM_PER_PAGE >= count
      ? count
      : startingIndex + ITEM_PER_PAGE;

  memos = memos.slice(startingIndex, endingIndex);

  res.status(StatusCodes.OK).json({
    success: true,
    memos,
    count,
    numOfPages: numOfPages || 1,
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

  let memoToUpdate = req.body;
  let updateTimestamps = true;

  //prevent timestamps from updating if the memo has the preventUpdate flag
  //no change in updatedAt if the user pin or archive the memo
  if (memoToUpdate.preventUpdate) {
    updateTimestamps = false;
    //remove the preventUpdate flag
    delete memoToUpdate.preventUpdate;
  }

  const updatedMemo = await Memo.findOneAndUpdate(
    {
      _id: memoId,
    },
    memoToUpdate,
    {
      runValidators: true,
      new: true,
      timestamps: updateTimestamps,
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

module.exports = {
  getAllMemos,
  getArchivedMemos,
  getMemo,
  createMemo,
  updateMemo,
  deleteMemo,
};
