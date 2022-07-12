import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserFromLocalStorage,
  storeUserInLocalStorage,
  removeUserFromLocalStorage,
} from '../../utils/localStorage';
import {
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
} from './userThunk';
import { toastMessage, MessageTypes } from '../../utils/toast';

const initialState = {
  isLoading: false,
  user: getUserFromLocalStorage(),
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
    removeUser: (state) => {
      removeUserFromLocalStorage();
      state.user = null;
    },
  },
  extraReducers: {
    [loginUser.pending]: (state) => {
      state.isLoading = true;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      const { user } = payload;
      storeUserInLocalStorage(user);
      state.user = user;
      state.isLoading = false;
      toastMessage(`Welcome, ${user.username}!`);
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      console.log(payload);
      toastMessage('Login failed', MessageTypes.ERROR);
    },
    [registerUser.pending]: (state) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      const { user } = payload;
      storeUserInLocalStorage(user);
      state.user = user;
      state.isLoading = false;
      toastMessage(`Welcome, ${user.username}!`);
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      console.log(payload);
      toastMessage('Registration failed', MessageTypes.ERROR);
    },
    [logoutUser.pending]: (state) => {
      state.isLoading = true;
    },
    [logoutUser.fulfilled]: (state) => {
      removeUserFromLocalStorage();
      state.user = null;
      state.isLoading = false;
      toastMessage('Logged out', MessageTypes.SUCCESS);
    },
    [logoutUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      console.log(payload);
    },
  },
});

export const { toggleSideBar, removeUser } = userSlice.actions;
export default userSlice.reducer;
