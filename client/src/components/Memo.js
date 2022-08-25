import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai';
import {
  convertToLocaleDate,
  convertToLocaleDateWithTime,
} from '../utils/date';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';

const Memo = ({
  memo,
  inArchive = false,
  onPinned = null,
  onDeleted = null,
  onUnarchived = null,
}) => {
  const menuItems = ['Delete', 'Unarchive'];
  const { _id, title, content, isPinned, createdAt, updatedAt } = memo;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHover, setIsHover] = useState(false);
  const open = Boolean(anchorEl);

  const openMemo = () => {
    if (inArchive) {
      return;
    }
    navigate(`../memos/${_id}`, { replace: false, to: 'memo' });
  };

  const togglePin = async () => {
    if (onPinned) {
      onPinned(_id, isPinned);
    }
  };

  const handleMemoHover = () => {
    setIsHover(true);
  };

  const handleMemoUnhover = () => {
    setIsHover(false);
  };

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (menuItem) => {
    setIsHover(false);
    switch (menuItem) {
      case 'Delete': {
        if (onDeleted) {
          onDeleted(memo);
        }
        break;
      }
      case 'Unarchive': {
        if (onUnarchived) {
          onUnarchived(memo);
        }
        break;
      }
      default:
        break;
    }
    setAnchorEl(null);
  };

  return (
    <Wrapper>
      {/* CLICKABLE AREA AND MEMO CONTENT */}
      <div
        className='clickable'
        onClick={openMemo}
        onMouseEnter={handleMemoHover}
        onMouseLeave={handleMemoUnhover}
      >
        <div className={`content${isHover ? ' show' : ''}`}>
          <p className='content-text'>{content || 'This memo is empty'}</p>
        </div>
      </div>
      {/* TOP LEFT MENU ICON IN ARCHIVE PAGE*/}
      <div className='menu-icon'>
        {inArchive && (
          <>
            <IconButton
              aria-label='more'
              id='long-button'
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup='true'
              onClick={handleMenuClick}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              id='long-menu'
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  width: '120px',
                },
              }}
            >
              {/* MENU ITEMS */}
              {menuItems.map((item, index) => (
                <MenuItem key={item} onClick={() => handleMenuClose(item)}>
                  {item}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
        {/* TOP LEFT PIN ICON IN MEMOS PAGE */}
        {inArchive ||
          (isPinned ? (
            <AiFillPushpin className='pin' onClick={togglePin} />
          ) : (
            <AiOutlinePushpin className='pin' onClick={togglePin} />
          ))}
      </div>
      {/* MEMO INFO */}
      <div className={`memo-info-container${isHover ? ' hide' : ''}`}>
        <h3>{convertToLocaleDate(createdAt)}</h3>
        {inArchive || (
          <p className='last-updated-text'>
            Last updated on: {'\n'}
            {convertToLocaleDateWithTime(updatedAt)}
          </p>
        )}
        <h1 className='title'>{title}</h1>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 240px;
  height: 300px;
  box-shadow: var(--shadow-2);
  align-items: center;
  justify-content: center;
  opacity: 0.75;
  transition-duration: 0.8s;
  border-radius: 0.4rem;
  overflow: hidden;

  .memo-info-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition-duration: 0.5s;
    white-space: pre-wrap;
    text-align: center;
  }

  .memo-info-container.hide {
    /* display: none; */
    opacity: 0;
  }

  .pin {
    width: 30px;
    height: 30px;
    margin: 4px;
    z-index: 10;
    cursor: pointer;
  }

  .clickable {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
  }

  .menu-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
  }

  .content {
    width: 100%;
    height: 100%;
    background-color: var(--primary-50);
    padding: 50px 20px;
    opacity: 0;
    transition-duration: 0.8s;
    text-align: center;
    z-index: 1;
    word-wrap: break-word;
  }

  .content.show {
    opacity: 1;
  }

  .content-text {
    cursor: default;
  }

  .last-updated-text {
    font-size: 14px;
    color: var(--primary-700);
  }

  .title {
    margin-top: 12px;
  }
`;

export default Memo;
