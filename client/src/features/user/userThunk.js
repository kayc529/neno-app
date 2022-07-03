import customFetch from '../../utils/axios';

export const loginUserThunk = async (url, user, thunkAPI) => {
  try {
    // const res = await customFetch.post(url, user);
    const res = await customFetch.post(url, user);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const registerUserThunk = async (url, user, thunkAPI) => {
  try {
    const res = await customFetch.post(url, user);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const logoutUserThunk = async (url, thunkAPI) => {
  try {
    const res = await customFetch.get(url);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};
