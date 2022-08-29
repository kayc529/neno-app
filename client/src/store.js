import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import memoReducer from './features/memo/memoSlice';
import messageReducer from './features/message/message-slice';

const store = configureStore({
  reducer: {
    user: userReducer,
    memos: memoReducer,
    messages: messageReducer,
  },
});

export default store;
