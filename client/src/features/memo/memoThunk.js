import customFetch from '../../utils/axios';

export const getAllMemosThunk = async (url, thunkAPI) => {
  try {
    const res = await customFetch.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const getMemoThunk = async (url, thunkAPI) => {
  try {
    console.log(url);
    const res = await customFetch.get(url);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const createMemoThunk = async (url, thunkAPI) => {
  try {
    const res = await customFetch.post(url, {});
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};
export const updateMemoThunk = async (url, memo, thunkAPI) => {
  try {
    const res = await customFetch.patch(url, memo);
    return res.data;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const deleteMemoThunk = async (url, thunkAPI) => {
  try {
    const res = await customFetch.delete(url);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};
