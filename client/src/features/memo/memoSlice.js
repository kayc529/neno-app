import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllMemosThunk,
  getArchivedMemosThunk,
  getMemoThunk,
  createMemoThunk,
  updateMemoThunk,
  deleteMemoThunk,
} from './memoThunk';

const initialState = {
  memos: [],
  numOfPages: 1,
  currentMemo: null,
  isLoading: false,
  isSaving: false,
  canSave: false,
};

export const getAllMemos = createAsyncThunk(
  'memos/getAllMemos',
  async (searchQueryStr, thunkAPI) => {
    return getAllMemosThunk(`/memos${searchQueryStr}`, thunkAPI);
  }
);

export const getArchivedMemos = createAsyncThunk(
  'memos/getArchivedMemos',
  async (searchQueryStr, thunkAPI) => {
    return getArchivedMemosThunk(`/memos/archive${searchQueryStr}`, thunkAPI);
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

export const unarchiveOrTogglePin = createAsyncThunk(
  'memo/unarchiveOrTogglePin',
  async (memo, thunkAPI) => {
    return updateMemoThunk(
      `/memos/${memo._id}`,
      { ...memo, preventUpdate: true },
      thunkAPI
    );
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
      return { ...state, currentMemo: null, canSave: false };
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
      const { memos, numOfPages } = payload;
      state.isLoading = false;
      state.memos = memos;
      state.numOfPages = numOfPages;
    },
    [getAllMemos.rejected]: (state, { payload }) => {
      state.isLoading = false;
    },
    [getArchivedMemos.pending]: (state) => {
      state.isLoading = true;
    },
    [getArchivedMemos.fulfilled]: (state, { payload }) => {
      const { memos, numOfPages } = payload;
      state.isLoading = false;
      state.memos = memos;
      state.numOfPages = numOfPages;
    },
    [getArchivedMemos.rejected]: (state, { payload }) => {
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
    [unarchiveOrTogglePin.pending]: (state) => {},
    [unarchiveOrTogglePin.fulfilled]: (state, { payload }) => {},
    [unarchiveOrTogglePin.rejected]: (state, { payload }) => {
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
