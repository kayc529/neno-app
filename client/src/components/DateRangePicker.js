import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  isClearable = false,
}) => {
  return (
    <DatePicker
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => onChange(update)}
      isClearable={isClearable}
    />
  );
};

export default DateRangePicker;
