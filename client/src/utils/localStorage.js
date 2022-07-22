export const getUserFromLocalStorage = () => {
  try {
    //if refreshToken hasn't expired, return user
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  } catch (error) {
    console.log('cannot get user from local storage: ', error);
    return null;
  }
};

export const storeUserInLocalStorage = (user) => {
  console.log('store user in local storage');
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUserFromLocalStorage = () => {
  console.log('remove user from local storage');
  localStorage.removeItem('user');
};
