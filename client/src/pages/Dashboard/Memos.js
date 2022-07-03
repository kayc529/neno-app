import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Container, Memo } from '../../components';
import { getAllMemos } from '../../features/memo/memoSlice';

const Memos = () => {
  const { memos } = useSelector((state) => state.memos);
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getAllMemos({}));
  }, [dispatch]);

  return (
    <Wrapper>
      <Container>
        <div className='filters'>search bar and filter options</div>
        <div className='memos'>
          {memos.map((memo, index) => {
            return <Memo key={memo.id} {...memo} />;
          })}
        </div>
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
`;

export default Memos;
