import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Container, Memo, Loader, SearchBar } from '../../components';
import {
  createMemo,
  getAllMemos,
  unarchiveOrTogglePin,
} from '../../features/memo/memoSlice';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageTypes, toastMessage } from '../../utils/toast';
import { generateSearchQueryString } from '../../utils/searchQuery';
import { Pagination, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/AddCircleOutline';

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

  const togglePin = async (memoId, isPinned) => {
    try {
      const updatedMemo = { _id: memoId, isPinned: !isPinned };
      await dispatch(unarchiveOrTogglePin(updatedMemo));
      getMemos();
    } catch (error) {
      toastMessage('Failed to pin memo', MessageTypes.ERROR);
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

  //when memo array size is 0
  //determine if there is no search results or the archive is empty
  const getEmptyMessage = () => {
    const keyword = searchParams.get('keyword');
    const pinned = searchParams.get('pinned');
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (keyword || pinned || start || end) {
      return 'No results found';
    }

    return 'There are no memos';
  };

  return (
    <Wrapper>
      <Container>
        <SearchBar />
        <Button
          variant='outlined'
          startIcon={<AddIcon />}
          className='add-button'
          onClick={addMemo}
        >
          New Memo
        </Button>
        {isLoading ? (
          <Loader />
        ) : memos.length > 0 ? (
          <>
            <div className='memos'>
              {memos.map((memo, index) => {
                return <Memo key={memo._id} memo={memo} onPinned={togglePin} />;
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
        ) : (
          <p className='empty-message'>{getEmptyMessage()}</p>
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
    /* width: 40px; */
    height: 40px;
    margin: 20px 0;
    cursor: pointer;
    margin-right: 10%;
    align-self: flex-end;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 20px auto;
  }

  .empty-message {
    align-self: center;
    margin-top: 80px;
    font-size: 20px;
  }
`;

export default Memos;
