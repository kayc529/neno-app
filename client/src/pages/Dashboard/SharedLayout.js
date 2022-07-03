import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar, SideBar } from '../../components';

const SharedLayout = () => {
  return (
    <>
      <SideBar />
      <NavBar />
      <Outlet />
    </>
  );
};

export default SharedLayout;
