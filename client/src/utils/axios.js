import axios from 'axios';
import applyMockAdapter from './mockAdapter';

const getBaseUrl = () => {
  // return process.env.NODE_ENV === 'development'
  //   ? '/api/v1'
  //   : process.env.REACT_APP_PROD_BASE_URL;
  return '/api/v1';
};

const customFetch = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

applyMockAdapter(customFetch);

export default customFetch;
