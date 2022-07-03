import Cookies from 'js-cookie';

const getUserFromCookies = () => {
  const cookie = Cookies.get('accessToken');
  try {
    if (!cookie) {
      return null;
    }
    const cookieObject = JSON.parse(cookie);
    return cookieObject.user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getAccessTokenFromCookies = () => {
  const cookie = Cookies.get('accessToken');
  try {
    if (!cookie) {
      return null;
    }
    const cookieObject = JSON.parse(cookie);
    return cookieObject.token;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const createDummyUserCookie = () => {
  const inOneDay = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
  const objectString = JSON.stringify({
    user: { name: 'John', email: 'john@gmail.com' },
    token: 'Some JWT',
  });
  Cookies.set('accessToken', objectString, { expires: inOneDay });
};

const removeDummyUserCookie = () => {
  Cookies.remove('accessToken');
};

export {
  getUserFromCookies,
  getAccessTokenFromCookies,
  createDummyUserCookie,
  removeDummyUserCookie,
};
