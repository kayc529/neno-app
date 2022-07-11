import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { toggleMemoPin } from '../features/memo/memoSlice';

const Memo = ({ _id, title, content, isPinned }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openMemo = () => {
    console.log('open memo with id: ', _id);
    navigate(`../memos/${_id}`, { replace: false, to: 'memo' });
  };

  const togglePin = () => {
    //patch request to update pin state
    dispatch(toggleMemoPin({ _id, isPinned: !isPinned }));
  };

  return (
    <Wrapper>
      <div className='clickable' onClick={openMemo}></div>
      {isPinned ? (
        <AiFillPushpin className='pin' onClick={togglePin} />
      ) : (
        <AiOutlinePushpin className='pin' onClick={togglePin} />
      )}
      <h1>{title}</h1>
      <p>{content}</p>
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
  background-color: var(--primary-300);
  align-items: center;
  justify-content: center;
  opacity: 0.75;
  transition-duration: 0.3s;
  border-radius: 0.35rem;
  overflow: hidden;

  .pin {
    width: 30px;
    height: 30px;
    z-index: 10;
  }

  &:hover {
    opacity: 1;
  }

  .clickable {
    position: absolute;
    width: 300px;
    min-width: 240px;
    height: 300px;
    z-index: 0;
  }
`;

export default Memo;
