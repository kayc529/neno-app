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
  updateProfileThunk,
  getSecurityQuestionThunk,
  verifySecurityAnswerThunk,
  verifyPasswordTokenThunk,
  resetPasswordThunk,
} from './userThunk';

const initialState = {
  isLoading: false,
  user: getUserFromLocalStorage(),
  isSidebarOpen: false,
  securityQuestion: '',
  passwordToken: '',
  isPasswordTokenValid: false,
  isResetPasswordSuccessful: false,
  isCurrentPasswordValid: false,
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

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (newProfile, thunkAPI) => {
    return updateProfileThunk('/auth/update-profile', newProfile, thunkAPI);
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
    },
    [loginUser.rejected]: (state, { payload }) => {
      console.log('loginUser: ', payload);
      state.isLoading = false;
    },
    [registerUser.pending]: (state) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      const { user } = payload;
      storeUserInLocalStorage(user);
      state.user = user;
      state.isLoading = false;
    },
    [registerUser.rejected]: (state, { payload }) => {
      console.log('registerUser: ', payload);
      state.isLoading = false;
    },
    [logoutUser.pending]: (state) => {
      state.isLoading = true;
    },
    [logoutUser.fulfilled]: (state) => {
      removeUserFromLocalStorage();
      state.user = null;
      state.isLoading = false;
    },
    [logoutUser.rejected]: (state, { payload }) => {
      console.log('logoutUser: ', payload);
      state.isLoading = false;
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
      console.log('getProfile :', payload);
      state.isLoading = false;
    },
    [updateProfile.pending]: (state) => {},
    [updateProfile.fulfilled]: (state, { payload }) => {
      const { user } = payload;
      storeUserInLocalStorage(user);
      state.user = user;
    },
    [updateProfile.rejected]: (state, { payload }) => {
      console.log('updateProfile: ', payload);
    },
    [getSecurityQuestion.pending]: (state) => {
      state.isLoading = true;
    },
    [getSecurityQuestion.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.securityQuestion = payload.securityQuestion;
    },
    [getSecurityQuestion.rejected]: (state, { payload }) => {
      console.log('getSecurityQuestion: ', payload);
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
      console.log('verifySecurityAnswer: ', payload);
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
      console.log('verifyPasswordToken: ', payload);
      state.isLoading = false;
      state.isPasswordTokenValid = false;
    },
    [resetPassword.pending]: (state) => {
      state.isResetPasswordSuccessful = false;
    },
    [resetPassword.fulfilled]: (state) => {
      state.isResetPasswordSuccessful = true;
      state.isPasswordTokenValid = false;
      state.passwordToken = null;
    },
    [resetPassword.rejected]: (state, { payload }) => {
      console.log('resetPassword: ', payload);
      state.isResetPasswordSuccessful = false;
    },
  },
});

export const { toggleSideBar, removeUser, toggleShowDialog } =
  userSlice.actions;
export default userSlice.reducer;
