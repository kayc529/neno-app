const FormRow = ({ type, name, value, onChange }) => {
  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <input type={type} name={name} onChange={onChange} value={value} />
    </div>
  );
};

export default FormRow;
