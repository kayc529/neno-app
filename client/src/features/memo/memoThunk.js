import customFetch from '../../utils/axios';

export const getAllMemosThunk = async (url, searchOptions, thunkAPI) => {
  try {
    //put search options into query
    const urlWithQuery = url;
    const res = await customFetch.get(urlWithQuery);
    return res.data;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const getMemoThunk = async (url, memoId, thunkAPI) => {
  try {
    const res = await customFetch.get(url, { params: { memoId } });
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const updateMemoThunk = async (url, memo, thunkAPI) => {
  try {
    const res = await customFetch.patch(url, { ...memo });
    return res.data;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};
