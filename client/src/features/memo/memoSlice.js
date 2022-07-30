import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllMemosThunk,
  getMemoThunk,
  createMemoThunk,
  updateMemoThunk,
  deleteMemoThunk,
} from './memoThunk';

const initialState = {
  memos: [],
  currentMemo: null,
  isLoading: false,
  isSaving: false,
  canSave: false,
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
    return createMemoThunk('/memos', thunkAPI);
  }
);

export const updateMemo = createAsyncThunk(
  'memo/updateMemo',
  async (memo, thunkAPI) => {
    return updateMemoThunk(`/memos/${memo._id}`, memo, thunkAPI);
  }
);

export const toggleMemoPin = createAsyncThunk(
  'memo/toggleMemoPin',
  async (memo, thunkAPI) => {
    const data = await updateMemoThunk(`/memos/${memo._id}`, memo, thunkAPI);
    thunkAPI.dispatch(getAllMemos());
    return data;
  }
);

export const deleteMemo = createAsyncThunk(
  'memo/deleteMemo',
  async (memo, thunkAPI) => {
    const data = await deleteMemoThunk(`/memos/${memo._id}`, thunkAPI);
    thunkAPI.dispatch(getAllMemos());
    return data;
  }
);

const memoSlice = createSlice({
  name: 'memo',
  initialState,
  reducers: {
    resetEditMemoStates(state) {
      return { ...state, currentMemo: null };
    },
    enableSave(state) {
      return { ...state, canSave: true };
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
    [updateMemo.pending]: (state) => {
      state.isSaving = true;
    },
    [updateMemo.fulfilled]: (state, { payload }) => {
      const { memo } = payload;
      state.isSaving = false;
      state.currentMemo = memo;
      state.canSave = false;
    },
    [updateMemo.rejected]: (state, { payload }) => {
      state.isSaving = false;
      console.log(payload);
    },
    [deleteMemo.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteMemo.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [deleteMemo.rejected]: (state) => {
      state.isLoading = false;
    },
    [toggleMemoPin.pending]: () => {},
    [toggleMemoPin.fulfilled]: () => {},
    [toggleMemoPin.rejected]: (state, { payload }) => {
      console.log(payload);
    },
  },
});

export const { resetEditMemoStates, enableSave } = memoSlice.actions;

export default memoSlice.reducer;
