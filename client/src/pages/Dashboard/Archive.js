import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Dialog, Loader, Memo } from '../../components';
import {
  deleteMemo,
  getArchivedMemos,
  unarchiveOrTogglePin,
} from '../../features/memo/memoSlice';
import { Pagination } from '@mui/material';
import { toggleShowDialog } from '../../features/user/userSlice';
import { DialogTypes } from '../../constants';
import { generateSearchQueryString } from '../../utils/searchQuery';
import { MessageTypes, toastMessage } from '../../utils/toast';

const Archive = () => {
  const { isLoading, memos, numOfPages } = useSelector((state) => state.memos);
  const { dialogType } = useSelector((state) => state.user);
  const [memoForAction, setMemoForAction] = useState(null);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page');
    const searchQuery = generateSearchQueryString({ keyword, page });
    dispatch(getArchivedMemos(searchQuery));
  }, [dispatch, searchParams]);

  const getMemos = () => {
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page');
    const searchQuery = generateSearchQueryString({ keyword, page });
    dispatch(getArchivedMemos(searchQuery));
  };

  const onMemoDeleted = (memo) => {
    setMemoForAction(memo);
    dispatch(
      toggleShowDialog({
        type: DialogTypes.MEMO_CONFIRM_DELETE,
        title: 'Delete Memo',
        message: 'Do you wish to delete this memo?',
      })
    );
  };

  const onMemoUnarchived = async (memo) => {
    let temp = { ...memo, isArchived: false };
    try {
      await dispatch(unarchiveOrTogglePin(temp));
      getMemos();
    } catch (err) {
      console.log(err);
      toastMessage('Failed to unarchive memo', MessageTypes.ERROR);
    }
  };

  const onDialogConfirm = async () => {
    if (dialogType === DialogTypes.MEMO_CONFIRM_DELETE) {
      console.log('confirm to delete this fucking memo ', memoForAction._id);
      try {
        await dispatch(deleteMemo(memoForAction));
        dispatch(toggleShowDialog());
        getMemos();
        toastMessage('Memo deleted', MessageTypes.SUCCESS);
      } catch (err) {
        console.log(err);
        dispatch(toggleShowDialog());
        toastMessage('Failed to delete memo', MessageTypes.ERROR);
      }
    }
    setMemoForAction(null);
  };

  const onDialogClose = () => {
    setMemoForAction(null);
  };

  const onSearch = () => {};

  return (
    <Wrapper>
      <Dialog confirmCallback={onDialogConfirm} closeCallback={onDialogClose} />
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className='memos'>
              {memos.map((memo, index) => {
                return (
                  <Memo
                    key={memo._id}
                    memo={memo}
                    inArchive={true}
                    onDeleted={onMemoDeleted}
                    onUnarchived={onMemoUnarchived}
                  />
                );
              })}
            </div>
            <div className='pagination-container'>
              <Pagination count={numOfPages} />
            </div>
          </>
        )}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  .memos {
    align-self: center;
    width: 1000px;
    display: grid;
    grid-template-columns: repeat(3, minmax(300px, 1fr));
    grid-row-gap: 20px;
    justify-items: center;
    /* grid-column-gap: 12px; */
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 20px auto;
  }
`;

export default Archive;
