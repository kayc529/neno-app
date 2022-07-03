import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createDummyUserCookie,
  getUserFromCookies,
  removeDummyUserCookie,
} from '../../utils/cookies';
import {
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
} from './userThunk';

const initialState = {
  isLoading: false,
  user: getUserFromCookies(),
  isSidebarOpen: false,
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (user, thunkAPI) => {
    return loginUserThunk('/auth/login', user, thunkAPI);
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user, thunkAPI) => {
    return registerUserThunk('/auth/register', user, thunkAPI);
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, thunkAPI) => {
    return logoutUserThunk('/auth/logout', thunkAPI);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
  extraReducers: {
    [loginUser.pending]: (state) => {
      state.isLoading = true;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      const { user } = payload;
      state.user = user;
      state.isLoading = false;
      console.log('yeah!!');
      //dev only
      // createDummyUserCookie();
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      console.log(payload);
    },
    [registerUser.pending]: (state) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      const { user } = payload;
      state.user = user;
      state.isLoading = false;
      //dev only
      // createDummyUserCookie();
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      console.log(payload);
    },
    [logoutUser.pending]: (state) => {
      state.isLoading = true;
    },
    [logoutUser.fulfilled]: (state) => {
      state.user = null;
      state.isLoading = false;
      //dev only
      removeDummyUserCookie();
    },
    [logoutUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      console.log(payload);
    },
  },
});

export const { toggleSideBar } = userSlice.actions;
export default userSlice.reducer;
