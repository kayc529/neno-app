import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Container, Memo, Loader, SearchBar } from '../../components';
import { createMemo, getAllMemos } from '../../features/memo/memoSlice';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageTypes, toastMessage } from '../../utils/toast';
import { generateSearchQueryString } from '../../utils/searchQuery';
import { Pagination } from '@mui/material';

const Memos = () => {
  const { memos, currentMemo, isLoading, numOfPages } = useSelector(
    (state) => state.memos
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    getMemos();
  }, [searchParams]);

  //navigate to edit memo page right after a new memo is created
  useEffect(() => {
    if (currentMemo) {
      navigate(`../memos/${currentMemo._id}`, { replace: false, to: 'memo' });
    }
  }, [currentMemo, navigate]);

  const getMemos = async () => {
    try {
      const keyword = searchParams.get('keyword');
      const pinned = searchParams.get('pinned');
      const sorting = searchParams.get('sorting');
      const start = searchParams.get('start');
      const end = searchParams.get('end');
      const page = searchParams.get('page');

      const queryStr = generateSearchQueryString({
        keyword,
        pinned,
        sorting,
        start,
        end,
        page,
      });
      await dispatch(getAllMemos(queryStr));
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

  const handlePageChange = (e) => {
    const keyword = searchParams.get('keyword');
    const pinned = searchParams.get('pinned');
    const sorting = searchParams.get('sorting');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const page = e.target.outerText;
    const queryStr = generateSearchQueryString({
      keyword,
      pinned,
      sorting,
      start,
      end,
      page,
    });
    navigate(queryStr);
  };

  const getPageNumber = () => {
    let page = Number(searchParams.get('page')) || 1;
    if (page > numOfPages) {
      page = numOfPages;
    }
    return page;
  };

  return (
    <Wrapper>
      <Container>
        <SearchBar />
        <AiOutlinePlusCircle className='add-button' onClick={addMemo} />
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className='memos'>
              {memos.map((memo, index) => {
                return <Memo key={memo._id} memo={memo} />;
              })}
            </div>
            <div className='pagination-container'>
              <Pagination
                count={numOfPages}
                page={getPageNumber()}
                onChange={handlePageChange}
              />
            </div>
          </>
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

  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 20px auto;
  }
`;

export default Memos;
