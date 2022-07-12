import styled from 'styled-components';

const Loader = () => {
  return <Wrapper></Wrapper>;
};

const Wrapper = styled.div`
  border: 10px solid var(--primary-100);
  border-top: 10px solid var(--primary-700);
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin-top: 36px;
  align-self: center;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loader;
