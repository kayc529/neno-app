export const convertToLocaleDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

export const convertToLocaleDateWithTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

export const formatDateToYYYYMMDD = (date) => {
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  let year = date.getFullYear();
  // if (month.length < 2) {
  //   month = '0' + month;
  // }
  // if (day.length < 2) {
  //   day = '0' + day;
  // }
  return [year, month, day].join('-');
};

export const getYearMonthDayFromDateStr = (dateStr) => {
  let [year, month, day] = dateStr.split('-');
  month = parseInt(month) - 1;
  return [year, month, day];
};
