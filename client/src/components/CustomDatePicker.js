import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({ selectedDate, onChange, locale = 'en-US' }) => {
  return (
    <DatePicker
      selected={new Date(selectedDate.setHours(0, 0, 0, 0))}
      onChange={onChange}
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode='select'
      disabledKeyboardNavigation
      locale={locale}
      maxDate={new Date()}
    />
  );
};

export default CustomDatePicker;
