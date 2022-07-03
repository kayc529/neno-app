import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Landing = () => {
  return (
    <Wrapper>
      <Link to='/login' className='primary-btn btn'>
        Get Started
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: flex;
  max-width: 1000px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

export default Landing;
