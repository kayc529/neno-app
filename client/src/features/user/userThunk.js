import customFetch from '../../utils/axios';
import { updateErrorMessage } from '../error-handling/error-handling-slice';

export const loginUserThunk = async (url, user, thunkAPI) => {
  try {
    // const res = await customFetch.post(url, user);
    const res = await customFetch.post(url, user);
    return res.data;
  } catch (error) {
    thunkAPI.dispatch(updateErrorMessage({ msg: error.response.data.msg }));
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const registerUserThunk = async (url, user, thunkAPI) => {
  try {
    const res = await customFetch.post(url, user);
    return res.data;
  } catch (error) {
    thunkAPI.dispatch(updateErrorMessage({ msg: error.response.data.msg }));
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const logoutUserThunk = async (url, thunkAPI) => {
  try {
    const res = await customFetch.delete(url);
    return res.data;
  } catch (error) {
    thunkAPI.dispatch(updateErrorMessage({ msg: error.response.data.msg }));
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const getProfileThunk = async (url, thunkAPI) => {
  try {
    const res = await customFetch.get(url);
    return res.data;
  } catch (error) {
    thunkAPI.dispatch(updateErrorMessage({ msg: error.response.data.msg }));
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const verifyCurrentPasswordThunk = async (url, password, thunkAPI) => {
  try {
    const res = await customFetch.post(url, { currentPassword: password });
    return res.data;
  } catch (error) {
    thunkAPI.dispatch(updateErrorMessage({ msg: error.response.data.msg }));
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const getSecurityQuestionThunk = async (url, info, thunkAPI) => {
  try {
    const res = await customFetch.post(url, info);
    return res.data;
  } catch (error) {
    thunkAPI.dispatch(updateErrorMessage({ msg: error.response.data.msg }));
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const verifySecurityAnswerThunk = async (url, info, thunkAPI) => {
  try {
    const res = await customFetch.post(url, info);
    return res.data;
  } catch (error) {
    thunkAPI.dispatch(updateErrorMessage({ msg: error.response.data.msg }));
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const verifyPasswordTokenThunk = async (url, thunkAPI) => {
  try {
    const res = await customFetch.get(url);
    return res.data;
  } catch (error) {
    thunkAPI.dispatch(updateErrorMessage({ msg: error.response.data.msg }));
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const resetPasswordThunk = async (url, newPassword, thunkAPI) => {
  try {
    const res = await customFetch.post(url, { newPassword });
    return res.data;
  } catch (error) {
    thunkAPI.dispatch(updateErrorMessage({ msg: error.response.data.msg }));
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};
