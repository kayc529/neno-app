import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllMemosThunk,
  getMemoThunk,
  createMemoThunk,
  updateMemoThunk,
} from './memoThunk';

const initialState = {
  memos: [],
  currentMemo: null,
  isLoading: false,
  searchOptions: {
    page: 1,
    keywords: '',
  }, //get from local storage
  sorting: null,
};

export const getAllMemos = createAsyncThunk(
  'memos/getAllMemos',
  async (searchOptions, thunkAPI) => {
    return getAllMemosThunk('/memos', searchOptions, thunkAPI);
  }
);

export const getMemo = createAsyncThunk(
  'memo/getMemo',
  async (memoId, thunkAPI) => {
    return getMemoThunk(`/memos/${memoId}`, thunkAPI);
  }
);

export const createMemo = createAsyncThunk(
  'memo/createMemo',
  async (_, thunkAPI) => {
    // create new memo
    const data = await createMemoThunk('/memos', thunkAPI);
    return data;
  }
);

export const toggleMemoPin = createAsyncThunk(
  'memo/toggleMemoPin',
  async (memo, thunkAPI) => {
    const data = await updateMemoThunk('/memos', memo, thunkAPI);
    thunkAPI.dispatch(getAllMemos());
    return data;
  }
);

const memoSlice = createSlice({
  name: 'memo',
  initialState,
  reducers: {
    removeCurrentMemo(state) {
      return { ...state, currentMemo: null };
    },
  },
  extraReducers: {
    [getAllMemos.pending]: (state) => {
      state.isLoading = true;
    },
    [getAllMemos.fulfilled]: (state, { payload }) => {
      const { memos } = payload;
      state.isLoading = false;
      state.memos = memos;
    },
    [getAllMemos.rejected]: (state, { payload }) => {
      state.isLoading = false;
      console.log(payload);
    },
    [getMemo.pending]: (state) => {
      state.isLoading = true;
      state.currentMemo = null;
    },
    [getMemo.fulfilled]: (state, { payload }) => {
      const { memo } = payload;
      state.isLoading = false;
      state.currentMemo = memo;
    },
    [getMemo.rejected]: (state, { payload }) => {
      state.isLoading = false;
      console.log(payload);
    },
    [createMemo.pending]: (state) => {
      state.isLoading = true;
      state.currentMemo = null;
    },
    [createMemo.fulfilled]: (state, { payload }) => {
      const { memo } = payload;
      state.isLoading = false;
      state.currentMemo = memo;
    },
    [createMemo.rejected]: (state, { payload }) => {
      state.isLoading = false;
      console.log(payload);
    },
    [toggleMemoPin.pending]: () => {},
    [toggleMemoPin.fulfilled]: () => {},
    [toggleMemoPin.rejected]: (state, { payload }) => {
      console.log(payload);
    },
  },
});

export const { removeCurrentMemo } = memoSlice.actions;

export default memoSlice.reducer;
