import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import memoReducer from './features/memo/memoSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    memos: memoReducer,
  },
});

export default store;
