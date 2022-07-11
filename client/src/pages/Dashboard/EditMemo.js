import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Container, MemoTag } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMemo,
  removeCurrentMemo,
  updateMemo,
} from '../../features/memo/memoSlice';
import {
  AiOutlineArrowLeft,
  AiOutlineSave,
  AiOutlinePushpin,
  AiFillPushpin,
  AiOutlinePlusCircle,
} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const EditMemo = () => {
  const [memoId, setMemoId] = useState('');
  const [data, setData] = useState({});
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const { isLoading, currentMemo } = useSelector((state) => state.memos);
  const tagInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getMemoIdFromUrl = () => {
    const url = document.URL;
    const id = url.substring(url.lastIndexOf('/') + 1);
    if (id) {
      setMemoId(id);
    }
  };

  useEffect(() => {
    getMemoIdFromUrl();
  }, []);

  useEffect(() => {
    if (currentMemo) {
      setData(currentMemo);
      setTagsArr();
    }
  }, [currentMemo]);

  useEffect(() => {
    if (memoId) {
      dispatch(getMemo(memoId));
    }
  }, [memoId, dispatch]);

  //auto-focus add tag input field when it's opened
  useEffect(() => {
    if (showAddTag) {
      tagInputRef?.current?.focus();
    }
  }, [showAddTag]);

  const setTagsArr = () => {
    const temp = currentMemo.tags?.split('+') || [];
    console.log(temp);
    setTags(temp);
  };

  const handleDataChange = (e) => {
    //TODO
    //auto save after 10secs
    const name = e.target.name;
    const value = e.target.value;
    let temp = { ...data, [name]: value };
    setData(temp);
  };

  const togglePin = () => {
    let temp = { ...data, isPinned: !data.isPinned };
    setData(temp);
  };

  const removeTag = (tagName) => {
    let temp = tags.filter((tag) => tag !== tagName);
    setTags(temp);
  };

  const generateTags = () => {
    return (
      <>
        {tags.map((tag, index) => {
          return (
            <MemoTag
              key={`${tag}${index}`}
              tagName={tag}
              removeTag={removeTag}
            />
          );
        })}
      </>
    );
  };

  const toggleAddNewTagButton = () => {
    setShowAddTag((prev) => !prev);
    setNewTag('');
  };

  const handleTagInputChange = (e) => {
    setNewTag(e.target.value);
  };

  //check if the user pressed the enter key
  const handleTagInputKeyDown = (e) => {
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
    }
  };

  const goBackHome = () => {
    dispatch(removeCurrentMemo());
    navigate('../', { replace: false, to: '/' });
  };

  const saveMemo = () => {
    const tagsString = tags.join('+');
    let updatedMemo = { ...data, tags: tagsString };

    dispatch(updateMemo(updatedMemo));
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Container>isloading</Container>
      </Wrapper>
    );
  }

  if (!isLoading && !currentMemo) {
    return (
      <Wrapper>
        <Container>
          <h1>Not Found</h1>
          <AiOutlineArrowLeft className='icon-btn' onClick={goBackHome} />
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <div className='row top-bar'>
          <AiOutlineArrowLeft className='icon-btn' onClick={goBackHome} />
          <AiOutlineSave className='icon-btn' onClick={saveMemo} />
        </div>
        <div className='row'>
          {data?.isPinned ? (
            <AiFillPushpin className='icon-btn' onClick={togglePin} />
          ) : (
            <AiOutlinePushpin className='icon-btn' onClick={togglePin} />
          )}
          <input
            name='title'
            type='text'
            value={data.title}
            onChange={handleDataChange}
          />
        </div>
        <div className='tags row'>
          {generateTags()}
          <input
            className={showAddTag ? 'add-tag-input show' : 'add-tag-input'}
            ref={tagInputRef}
            type='text'
            placeholder='#add tag'
            value={newTag}
            onChange={handleTagInputChange}
            onKeyDown={handleTagInputKeyDown}
          />
          <AiOutlinePlusCircle
            className={
              showAddTag ? 'small-icon-btn close-tag-input' : 'small-icon-btn'
            }
            onClick={toggleAddNewTagButton}
          />
        </div>
        <textarea
          placeholder='Start writing...'
          value={data.content}
          name='content'
          onChange={handleDataChange}
        ></textarea>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  input {
    max-width: 500px;
    width: 80%;
    font-size: 30px;
    border: 0;
  }

  textarea {
    width: 80%;
    resize: none;
    border: none;
    /* background-color: red; */
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

  .top-bar {
    justify-content: space-between;
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
`;

export default EditMemo;
