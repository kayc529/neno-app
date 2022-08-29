import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  errorMsg: '',
  successMsg: '',
  neutralMsg: '',
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    updateErrorMessage: (state, { payload }) => {
      state.errorMsg = payload.msg || '';
    },
    updateSuccessMessage: (state, { payload }) => {
      state.successMsg = payload.msg || '';
    },
    updateNeutralMessage: (state, { payload }) => {
      state.neutralMsg = payload.msg || '';
    },
    resetMessages: (state) => {
      state.errorMsg = '';
      state.successMsg = '';
      state.neutralMsg = '';
    },
  },
});

export const {
  updateErrorMessage,
  updateSuccessMessage,
  updateNeutralMessage,
  resetMessages,
} = messageSlice.actions;
export default messageSlice.reducer;
