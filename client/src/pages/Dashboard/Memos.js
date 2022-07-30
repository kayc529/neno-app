import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Container, Memo, Loader } from '../../components';
import { createMemo, getAllMemos } from '../../features/memo/memoSlice';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { MessageTypes, toastMessage } from '../../utils/toast';

const Memos = () => {
  const { memos, currentMemo, isLoading } = useSelector((state) => state.memos);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getMemos();
  }, []);

  //navigate to edit memo page right after a new memo is created
  useEffect(() => {
    if (currentMemo) {
      navigate(`../memos/${currentMemo._id}`, { replace: false, to: 'memo' });
    }
  }, [currentMemo, navigate]);

  const getMemos = async () => {
    try {
      await dispatch(getAllMemos({}));
    } catch (error) {
      toastMessage('Failed to get memos', MessageTypes.ERROR);
    }
  };

  const addMemo = async () => {
    try {
      await dispatch(createMemo());
    } catch (error) {
      console.log(error);
      toastMessage('Failed to create new memo', MessageTypes.ERROR);
    }
  };

  return (
    <Wrapper>
      <Container>
        <div className='filters'>search bar and filter options</div>
        <AiOutlinePlusCircle className='add-button' onClick={addMemo} />
        {isLoading ? (
          <Loader />
        ) : (
          <div className='memos'>
            {memos.map((memo, index) => {
              return <Memo key={memo._id} {...memo} />;
            })}
          </div>
        )}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  .filters {
    align-self: center;
  }

  .memos {
    align-self: center;
    width: 1000px;
    display: grid;
    grid-template-columns: repeat(3, minmax(300px, 1fr));
    grid-row-gap: 20px;
    justify-items: center;
    /* grid-column-gap: 12px; */
  }

  .add-button {
    width: 40px;
    height: 40px;
    align-self: center;
    margin: 20px 0;
    cursor: pointer;
  }
`;

export default Memos;
