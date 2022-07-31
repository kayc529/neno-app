export const generateSearchQueryString = (query) => {
  const { keyword, pinned, sorting } = query;

  let queryStr = '';
  if (keyword) {
    queryStr += `?keyword=${keyword}`;
  }

  if (pinned) {
    queryStr += queryStr.length > 2 ? `&pinned=${pinned}` : `?pinned=${pinned}`;
  }

  if (sorting) {
    queryStr +=
      queryStr.length > 2 ? `&sorting=${sorting}` : `?sorting=${sorting}`;
  }

  return queryStr;
};
