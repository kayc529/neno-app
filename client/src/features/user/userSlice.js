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
  getProfileThunk,
  verifyCurrentPasswordThunk,
  getSecurityQuestionThunk,
  verifySecurityAnswerThunk,
  verifyPasswordTokenThunk,
  resetPasswordThunk,
} from './userThunk';
import { toastMessage, MessageTypes } from '../../utils/toast';

const initialState = {
  isLoading: false,
  user: getUserFromLocalStorage(),
  isSidebarOpen: false,
  securityQuestion: '',
  passwordToken: '',
  isPasswordTokenValid: false,
  isResetPasswordSuccessful: false,
  showDialog: false,
  dialogType: '',
  dialogTitle: '',
  dialogMessage: '',
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

export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, thunkAPI) => {
    return getProfileThunk('/auth/profile', thunkAPI);
  }
);

export const verifyCurrentPassword = createAsyncThunk(
  'user/verifyCurrentPassword',
  async (password, thunkAPI) => {
    return verifyCurrentPasswordThunk(
      '/auth/verify-current-password',
      password,
      thunkAPI
    );
  }
);

export const getSecurityQuestion = createAsyncThunk(
  'user/getSecurityQuestion',
  async (info, thunkAPI) => {
    return getSecurityQuestionThunk('/auth/get-security', info, thunkAPI);
  }
);

export const verifySecurityAnswer = createAsyncThunk(
  'user/verifySecurityAnswer',
  async (info, thunkAPI) => {
    return verifySecurityAnswerThunk('/auth/forgot-password', info, thunkAPI);
  }
);

export const verifyPasswordToken = createAsyncThunk(
  'user/verifyPasswordToken',
  async (passwordToken, thunkAPI) => {
    return verifyPasswordTokenThunk(`/auth/reset-password/${passwordToken}`);
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (info, thunkAPI) => {
    return resetPasswordThunk(
      `/auth/reset-password/${info.passwordToken}`,
      info.newPassword,
      thunkAPI
    );
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
    toggleShowDialog: (state, action) => {
      if (!state.showDialog) {
        //update title and message from action payload
        const { type, message, title } = action.payload;
        state.dialogType = type || '';
        state.dialogMessage = message || '';
        state.dialogTitle = title || '';
      } else {
        //reset title and message
        state.dialogType = '';
        state.dialogMessage = '';
        state.dialogTitle = '';
      }
      state.showDialog = !state.showDialog;
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
      console.error(payload);
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
    [getProfile.pending]: (state) => {
      state.isLoading = true;
    },
    [getProfile.fulfilled]: (state, { payload }) => {
      const { user } = payload;
      storeUserInLocalStorage(user);
      state.user = user;
      state.isLoading = false;
    },
    [getProfile.rejected]: (state, { payload }) => {
      state.isLoading = false;
      console.log(payload);
    },
    [verifyCurrentPassword.pending]: (state) => {},
    [verifyCurrentPassword.fulfilled]: (state, { payload }) => {},
    [verifyCurrentPassword.rejected]: (state, { payload }) => {
      console.log('verifyCurrentPassword: ', payload);
    },
    [getSecurityQuestion.pending]: (state) => {
      state.isLoading = true;
    },
    [getSecurityQuestion.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.securityQuestion = payload.securityQuestion;
    },
    [getSecurityQuestion.rejected]: (state, { payload }) => {
      console.log(payload);
      state.isLoading = false;
    },
    [verifySecurityAnswer.pending]: (state) => {
      state.isLoading = true;
    },
    [verifySecurityAnswer.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.passwordToken = payload.passwordToken;
    },
    [verifySecurityAnswer.rejected]: (state, { payload }) => {
      console.log(payload);
      state.isLoading = false;
    },
    [verifyPasswordToken.pending]: (state) => {
      state.isLoading = true;
      state.isPasswordTokenValid = false;
    },
    [verifyPasswordToken.fulfilled]: (state) => {
      state.isLoading = false;
      state.isPasswordTokenValid = true;
    },
    [verifyPasswordToken.rejected]: (state, { payload }) => {
      console.log(payload);
      state.isLoading = false;
      state.isPasswordTokenValid = false;
      toastMessage(payload, MessageTypes.ERROR);
    },
    [resetPassword.pending]: (state) => {
      state.isResetPasswordSuccessful = false;
    },
    [resetPassword.fulfilled]: (state) => {
      state.isResetPasswordSuccessful = true;
    },
    [resetPassword.rejected]: (state, { payload }) => {
      console.log(payload);
      state.isResetPasswordSuccessful = false;
      toastMessage(payload, MessageTypes.ERROR);
    },
  },
});

export const { toggleSideBar, removeUser, toggleShowDialog } =
  userSlice.actions;
export default userSlice.reducer;
