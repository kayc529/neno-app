import { formatDateToYYYYMMDD } from './date';

export const generateSearchQueryString = (query) => {
  const { keyword, pinned, sorting, start, end, page } = query;

  let queryStr = '';
  if (keyword) {
    queryStr += `?keyword=${keyword}`;
  }

  if (pinned) {
    queryStr += queryStr.length > 0 ? `&pinned=${pinned}` : `?pinned=${pinned}`;
  }

  if (sorting) {
    queryStr +=
      queryStr.length > 0 ? `&sorting=${sorting}` : `?sorting=${sorting}`;
  }

  if (start) {
    const startDate = new Date(start);
    queryStr +=
      queryStr.length > 0
        ? `&start=${formatDateToYYYYMMDD(startDate)}`
        : `?start=${formatDateToYYYYMMDD(startDate)}`;
  }

  if (end) {
    const endDate = new Date(end);
    queryStr +=
      queryStr.length > 0
        ? `&end=${formatDateToYYYYMMDD(endDate)}`
        : `?end=${formatDateToYYYYMMDD(endDate)}`;
  }

  if (page) {
    queryStr += queryStr.length > 0 ? `&page=${page}` : `?page=${page}`;
  }

  return queryStr;
};
