import React from 'react';
import styled from 'styled-components';
import Logo from './Logo';
import { useDispatch } from 'react-redux';
import { logoutUser, toggleSideBar } from '../features/user/userSlice';
import { FaBars } from 'react-icons/fa';

const NavBar = () => {
  const dispatch = useDispatch();

  const logout = () => {
    console.log('logout!!');
    dispatch(logoutUser());
  };

  const toggleSidebar = () => {
    dispatch(toggleSideBar());
  };

  return (
    <Wrapper>
      <div className='nav-container'>
        <div className='left'>
          <FaBars className='bar-icon' onClick={toggleSidebar} />
          <Logo />
        </div>
        <button className='secondary-btn btn' onClick={logout}>
          Logout
        </button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  width: 100%;
  background: white;

  .nav-container {
    margin: 0 auto;
    max-width: 1200px;
    width: 100%;
    padding: 36px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .left {
    display: flex;
    align-items: center;
  }

  .bar-icon {
    width: 30px;
    height: 30px;
    transition-duration: 0.3s;
    cursor: pointer;
    margin-right: 40px;
  }

  .bar-icon:hover {
    opacity: 0.5;
  }
`;

export default NavBar;
