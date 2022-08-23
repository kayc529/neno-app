import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { toggleSideBar } from '../features/user/userSlice';
import {
  Drawer,
  Box,
  List,
  ListSubheader,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
//icons
import MemosIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArchiveIcon from '@mui/icons-material/Inventory2Outlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';

const SideBar = () => {
  const listItems = ['Memos', 'Archive', 'Settings'];
  const { isSidebarOpen } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeSidebar = () => {
    dispatch(toggleSideBar());
  };

  const getListItemIcon = (text) => {
    switch (text) {
      case 'Memos':
        return <MemosIcon />;
      case 'Archive':
        return <ArchiveIcon />;
      case 'Settings':
        return <SettingsIcon />;
      default:
        return <></>;
    }
  };

  const handleListButtonClick = (listItem) => {
    switch (listItem) {
      case 'Memos':
        navigate('/', { replace: true });
        return;
      case 'Archive':
        navigate('/archive', { replace: true });
        return;
      case 'Settings':
        navigate('/settings', { replace: true });
        return;
      default:
        return;
    }
  };

  return (
    // <Wrapper isSidebarOpen={isSidebarOpen}>
    //   <AiOutlineClose className='close-icon' onClick={closeSidebar} />
    // </Wrapper>
    <Drawer anchor={'left'} open={isSidebarOpen} onClose={closeSidebar}>
      <Box
        sx={{ width: 250 }}
        role='presentation'
        onClick={closeSidebar}
        onKeyDown={closeSidebar}
      >
        <List subheader={<ListSubheader>Menu</ListSubheader>}>
          {listItems.map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleListButtonClick(text)}>
                <ListItemIcon>{getListItemIcon(text)}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
          {/* <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>{getListItemIcon('Settings')}</ListItemIcon>
              <ListItemText primary={'Settings'} />
            </ListItemButton>
          </ListItem> */}
        </List>
      </Box>
    </Drawer>
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
