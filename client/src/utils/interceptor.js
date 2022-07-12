import customFetch from './axios';
import { removeUser } from '../features/user/userSlice';

export const interceptor = (store) => {
  customFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      //if token is invalid
      if (
        error.response.status === 401 &&
        error.response.data.msg === 'INVALID_TOKEN'
      ) {
        //dispatch action to remove user
        store.dispatch(removeUser());
      }
      return Promise.reject(error);
    }
  );
};
