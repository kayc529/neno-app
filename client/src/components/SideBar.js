import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AiOutlineClose } from 'react-icons/ai';
import { toggleSideBar } from '../features/user/userSlice';

const SideBar = () => {
  const { isSidebarOpen } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(toggleSideBar());
  };

  return (
    <Wrapper isSidebarOpen={isSidebarOpen}>
      <AiOutlineClose className='close-icon' onClick={closeSidebar} />
    </Wrapper>
  );
};

const Wrapper = styled.aside`
  /* display: none; */
  position: absolute;
  z-index: 10;
  top: 0;
  left: ${(props) => (props.isSidebarOpen ? '0' : '-400px')};
  width: 200px;
  height: 100%;
  padding: 30px 20px;
  background: white;
  /* opacity: 0.8; */
  transition-duration: 0.5s;
  box-shadow: var(--shadow-1);

  /* TODO shadow layer underneath the sidebar */
  /* div {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 300px;
    width: 3000px;
    height: 100%;
    background-color: var(--primary-900);
    opacity: 0.2;
    display: ${(props) => (props.isSidebarOpen ? 'flex' : 'none')};
  } */

  .close-icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
`;

export default SideBar;
