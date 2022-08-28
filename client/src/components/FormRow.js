import styled from 'styled-components';

const FormRow = ({
  type,
  name,
  displayName,
  value,
  onChange,
  showLabel = true,
  showLabelOnly = false,
  placeholder = '',
  disabled = false,
}) => {
  return (
    <Wrapper>
      {showLabel && <label>{displayName || name}</label>}
      {showLabelOnly || (
        <input
          type={type}
          name={name}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  label {
    text-transform: capitalize;
  }
`;

export default FormRow;
