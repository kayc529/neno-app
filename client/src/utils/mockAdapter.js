import MockAdapter from 'axios-mock-adapter';
import {
  mockLoginResponse,
  mockRegisterResponse,
  mockLogoutReponse,
} from '../mockData/user';
import {
  mockGetAllMemosResponse,
  mockGetMemoResponse,
  mockUpdateMemoResponse,
} from '../mockData/memos';

const applyMockAdapter = (axioInstance) => {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_USE_MOCK === 'true'
  ) {
    const mock = new MockAdapter(axioInstance);

    mock.onPost('/auth/login').reply(200, mockLoginResponse);
    mock.onPost('/auth/register').reply(200, mockRegisterResponse);
    mock.onGet('/auth/logout').reply(200, mockLogoutReponse);
    mock.onGet('/memos').reply((config) => {
      if (config.params?.memoId !== undefined) {
        const { memoId } = config.params;
        if (memoId === '1') {
          return [200, mockGetMemoResponse[0]];
        } else if (memoId === '2') {
          return [200, mockGetMemoResponse[1]];
        } else if (memoId === '3') {
          return [200, mockGetMemoResponse[2]];
        } else {
          return [404];
        }
      }
      return [200, mockGetAllMemosResponse];
    });
    mock.onPatch('/memos').reply(200, mockUpdateMemoResponse);
  }
};

export default applyMockAdapter;
