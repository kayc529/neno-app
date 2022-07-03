import axios from 'axios';
import { getAccessTokenFromCookies } from '../utils/cookies';
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

customFetch.interceptors.request.use((config) => {
  const token = getAccessTokenFromCookies();
  if (token) {
    config.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default customFetch;
