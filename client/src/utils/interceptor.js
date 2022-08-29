import customFetch from './axios';
import { removeUser } from '../features/user/userSlice';
import { resetMessages } from '../features/message/message-slice';

export const interceptor = (store) => {
  //pre api call
  customFetch.interceptors.request.use(
    (request) => {
      //reset error message before api call
      store.dispatch(resetMessages());
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  //post api call
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
