import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Container, Loader, MemoTag } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMemo,
  resetEditMemoStates,
  updateMemo,
  deleteMemo,
  enableSave,
} from '../../features/memo/memoSlice';
import {
  AiOutlineArrowLeft,
  AiOutlineSave,
  AiOutlinePushpin,
  AiFillPushpin,
  AiOutlinePlusCircle,
  AiOutlineDelete,
} from 'react-icons/ai';
import { BiArchiveIn } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import Dialog from '../../components/Dialog';
import { toggleShowDialog } from '../../features/user/userSlice';
import { MessageTypes, toastMessage } from '../../utils/toast';
import { DialogTypes } from '../../constants';

const EditMemo = () => {
  const [data, setData] = useState({});
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const { isLoading, currentMemo, isSaving, canSave } = useSelector(
    (state) => state.memos
  );
  const { dialogType } = useSelector((state) => state.user);
  const tagInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentMemo();
  }, []);

  useEffect(() => {
    //if the memo if passed from the previous page
    if (currentMemo) {
      setData(currentMemo);
      setTagsArr();
    }
  }, [currentMemo]);

  //auto-focus add tag input field when it's opened
  useEffect(() => {
    if (showAddTag) {
      tagInputRef?.current?.focus();
    }
  }, [showAddTag]);

  const getMemoIdFromUrl = () => {
    const url = document.URL;
    const id = url.substring(url.lastIndexOf('/') + 1);
    return id;
  };

  const getCurrentMemo = async () => {
    try {
      const memoId = getMemoIdFromUrl();
      if (!memoId) {
        throw new Error();
      }
      await dispatch(getMemo(memoId));
    } catch (error) {
      toastMessage('Failed to get memo', MessageTypes.ERROR);
    }
  };

  const setTagsArr = () => {
    const temp = currentMemo.tags?.split('+') || [];
    setTags(temp);
  };

  const onDataChanged = (e) => {
    //TODO
    //auto save after 10secs
    const name = e.target.name;
    const value = e.target.value;
    let temp = { ...data, [name]: value };
    setData(temp);
    dispatch(enableSave());
  };

  const togglePin = () => {
    let temp = { ...data, isPinned: !data.isPinned };
    setData(temp);
    dispatch(enableSave());
  };

  const removeTag = (tagName) => {
    let temp = tags.filter((tag) => tag !== tagName);
    setTags(temp);
    dispatch(enableSave());
  };

  const toggleAddNewTagButton = () => {
    setShowAddTag((prev) => !prev);
    setNewTag('');
  };

  const onTagInputChanged = (e) => {
    setNewTag(e.target.value);
  };

  //check if the user pressed the enter key
  const onTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const tagName = newTag.trim();
      //will not add tag if already exists
      if (tags.includes(tagName)) {
        return;
      }

      //add new tag to tag list
      let temp = [...tags];
      temp.push(tagName);
      setTags(temp);
      setNewTag('');
      setShowAddTag(false);

      //enable user to save memo
      dispatch(enableSave());
    }
  };

  const onBack = () => {
    if (canSave) {
      //ask if user do not want to save the
      dispatch(
        toggleShowDialog({
          type: DialogTypes.MEMO_ALERT_UNSAVED,
          title: 'Memo unsaved',
          message: 'Do you wish to go back without saving?',
        })
      );
    } else {
      goBackHome();
    }
  };
  const goBackHome = async () => {
    await dispatch(resetEditMemoStates());
    // navigate('../', { replace: false, to: '/' });
    navigate(-1);
  };

  const onSaveMemo = async () => {
    //if no changes have been made, don't allow user to save
    if (!canSave) return;

    const tagsString = tags.join('+');
    let updatedMemo = { ...data, tags: tagsString };
    try {
      await dispatch(updateMemo(updatedMemo));
      toastMessage('Memo saved', MessageTypes.SUCCESS);
    } catch (error) {
      toastMessage('Failed to save memo', MessageTypes.ERROR);
    }
  };

  const onDeleteMemo = async () => {
    dispatch(
      toggleShowDialog({
        type: DialogTypes.MEMO_CONFIRM_DELETE,
        title: 'Delete Memo',
        message: 'Are you sure to delete this memo?',
      })
    );
  };

  const confirmDeleteMemo = async () => {
    //close dialog
    dispatch(toggleShowDialog());
    try {
      await dispatch(deleteMemo(data));
      toastMessage('Memo deleted', MessageTypes.SUCCESS);
      goBackHome();
    } catch (error) {
      toastMessage('Failed to delete memo', MessageTypes.ERROR);
    }
  };

  const onArchiveMemo = () => {
    dispatch(
      toggleShowDialog({
        type: DialogTypes.MEMO_CONFIRM_ARCHIVE,
        title: 'Archive Memo',
        message: 'Are you sure to archive this memo?',
      })
    );
  };

  const confirmArchiveMemo = async () => {
    //close dialog
    dispatch(toggleShowDialog());
    const updatedMemo = { ...data, isArchived: true };
    try {
      await dispatch(updateMemo(updatedMemo));
      toastMessage('Memo archived', MessageTypes.SUCCESS);
      goBackHome();
    } catch (error) {
      toastMessage(error, MessageTypes.ERROR);
    }
  };

  const onConfirm = () => {
    switch (dialogType) {
      case DialogTypes.MEMO_CONFIRM_ARCHIVE:
        confirmArchiveMemo();
        break;
      case DialogTypes.MEMO_CONFIRM_DELETE:
        confirmDeleteMemo();
        break;
      case DialogTypes.MEMO_ALERT_UNSAVED:
        dispatch(toggleShowDialog());
        goBackHome();
        break;
      default:
        //do nothing and close dialog by default
        dispatch(toggleShowDialog());
        break;
    }
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Container>
          <Loader />
        </Container>
      </Wrapper>
    );
  }

  //TODO
  //make it prettier
  if (!isLoading && !currentMemo) {
    return (
      <Wrapper>
        <Container>
          <div className='row top-bar'>
            <AiOutlineArrowLeft className='icon-btn' onClick={goBackHome} />
          </div>
          <h1>Not Found</h1>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Dialog confirmCallback={onConfirm} />
      <Container>
        <div className='row top-bar'>
          {/* BACK BUTTON */}
          <AiOutlineArrowLeft className='icon-btn' onClick={onBack} />
          <div className='save-button-container'>
            {/* SAVE MEMO BUTTON */}
            {isSaving ? (
              <p>Saving...</p>
            ) : (
              <AiOutlineSave
                className={
                  canSave
                    ? 'icon-btn icon-spacing'
                    : 'icon-btn icon-spacing disabled'
                }
                onClick={onSaveMemo}
              />
            )}
            {/* ARCHIVE MEMO BUTTON */}
            <BiArchiveIn
              className='icon-btn icon-spacing'
              onClick={onArchiveMemo}
            />
            {/* DELETE MEMO BUTTON */}
            <AiOutlineDelete className='icon-btn' onClick={onDeleteMemo} />
          </div>
        </div>
        <div className='row title'>
          {/* PIN BUTTON */}
          {data?.isPinned ? (
            <AiFillPushpin className='icon-btn' onClick={togglePin} />
          ) : (
            <AiOutlinePushpin className='icon-btn' onClick={togglePin} />
          )}
          {/* TITLE INPUT */}
          <input
            className='title-input'
            name='title'
            type='text'
            value={data.title}
            onChange={onDataChanged}
          />
        </div>
        <div className='tags row'>
          {/* TAGS */}
          {tags.map((tag, index) => {
            return (
              <MemoTag
                key={`${tag}${index}`}
                tagName={tag}
                removeTag={removeTag}
              />
            );
          })}
          {/* NEW TAG INPUT */}
          <input
            className={showAddTag ? 'add-tag-input show' : 'add-tag-input'}
            ref={tagInputRef}
            type='text'
            placeholder='#add tag'
            value={newTag}
            onChange={onTagInputChanged}
            onKeyDown={onTagInputKeyDown}
          />
          {/* ADD NEW TAG BUTTON */}
          <AiOutlinePlusCircle
            className={
              showAddTag ? 'small-icon-btn close-tag-input' : 'small-icon-btn'
            }
            onClick={toggleAddNewTagButton}
          />
        </div>
        {/* CONTENT TEXTAREA */}
        <textarea
          placeholder='Start writing...'
          value={data.content}
          name='content'
          onChange={onDataChanged}
        ></textarea>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  input {
    width: 80%;
    font-size: 30px;
    border: 0;
  }

  textarea {
    width: 80%;
    resize: none;
    border: none;
    margin-top: 24px;
  }

  input:focus,
  textarea:focus {
    outline: none;
  }

  .tags {
    display: flex;
  }

  .icon-btn {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }

  .small-icon-btn {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  .row {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .title {
    margin-top: 24px;
  }

  .top-bar {
    justify-content: space-between;
  }

  .save-button-container {
    display: flex;
    align-items: center;
  }

  .save-button-container p {
    opacity: 0.5;
    margin-right: 12px;
  }

  .tags {
    margin: 8px 0;
  }

  .add-tag-input {
    height: 30px;
    width: 150px;
    border-bottom: 1px solid black;
    font-size: 14px;
    display: none;
  }

  .show {
    display: flex;
  }

  .close-tag-input {
    transform: rotate(45deg);
  }

  .icon-spacing {
    margin-right: 8px;
  }

  .disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export default EditMemo;
