import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  errorMsg: '',
};

const errorHandlingSlice = createSlice({
  name: 'errorHandling',
  initialState,
  reducers: {
    updateErrorMessage: (state, { payload }) => {
      state.errorMsg = payload.msg || '';
    },
    resetErrorMessage: (state) => {
      state.errorMsg = '';
    },
  },
});

export const { updateErrorMessage, resetErrorMessage } =
  errorHandlingSlice.actions;
export default errorHandlingSlice.reducer;
