import styled from 'styled-components';

const Select = ({ options, onChange, placeholder = '' }) => {
  return (
    <Wrapper>
      <select onChange={onChange}>
        <option value='' disabled selected>
          --{placeholder || 'Please choose an option'}--
        </option>
        {options.map((option, index) => {
          return (
            <option key={index} value={option.key}>
              {option.value}
            </option>
          );
        })}
      </select>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

export default Select;
