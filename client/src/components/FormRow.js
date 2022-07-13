const FormRow = ({ type, name, value, onChange, showLabel = true }) => {
  return (
    <div>
      {showLabel && <label htmlFor={name}>{name}</label>}
      <input type={type} name={name} onChange={onChange} value={value} />
    </div>
  );
};

export default FormRow;
