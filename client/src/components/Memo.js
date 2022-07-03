import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { toggleMemoPin } from '../features/memo/memoSlice';

const Memo = ({ id, title, content, isPinned }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openMemo = () => {
    navigate(`../memo/${id}`, { replace: false, to: 'memo' });
  };

  const togglePin = () => {
    //patch request to update pin state
    dispatch(toggleMemoPin({ id, isPinned: !isPinned }));
  };

  return (
    <Wrapper>
      {isPinned ? (
        <AiFillPushpin className='pin' onClick={togglePin} />
      ) : (
        <AiOutlinePushpin className='pin' onClick={togglePin} />
      )}
      <h1 onClick={openMemo}>{title}</h1>
      <p>{content}</p>
    </Wrapper>
  );
};

const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 240px;
  height: 300px;
  background-color: var(--primary-300);
  align-items: center;
  justify-content: center;
  opacity: 0.75;
  transition-duration: 0.3s;
  border-radius: 0.35rem;

  .pin {
    width: 30px;
    height: 30px;
    z-index: 10;
  }

  &:hover {
    opacity: 1;
  }
`;

export default Memo;
