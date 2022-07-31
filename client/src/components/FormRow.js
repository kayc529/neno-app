import styled from 'styled-components';

const FormRow = ({
  type,
  name,
  value,
  onChange,
  showLabel = true,
  showLabelOnly = false,
  placeholder = '',
}) => {
  return (
    <Wrapper>
      {showLabel && <label>{name}</label>}
      {showLabelOnly || (
        <input
          type={type}
          name={name}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

export default FormRow;
