import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import memoReducer from './features/memo/memoSlice';
import errorHandlingReducer from './features/error-handling/error-handling-slice';

const store = configureStore({
  reducer: {
    user: userReducer,
    memos: memoReducer,
    errorHandling: errorHandlingReducer,
  },
});

export default store;
