import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getMemo } from '../../features/memo/memoSlice';
import { Link } from 'react-router-dom';

const EditMemo = () => {
  const [memoId, setMemoId] = useState('');
  const [data, setData] = useState({});
  const { isLoading, currentMemo } = useSelector((state) => state.memos);
  const dispatch = useDispatch();

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
    }
  }, [currentMemo]);

  useEffect(() => {
    if (memoId) {
      dispatch(getMemo(memoId));
    }
  }, [memoId, dispatch]);

  const handleDataChange = (e) => {
    //TODO
    //auto save after 10secs
    const name = e.target.name;
    const value = e.target.value;
    let temp = { ...data, [name]: value };
    setData(temp);
  };

  const generateTags = () => {
    if (data.tags) {
      const tagsArray = data.tags.split('+');
      return (
        <div className='tags'>
          {tagsArray.map((tag, index) => (
            <p key={index}>{tag}</p>
          ))}
        </div>
      );
    }
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
          <Link to='/'>Go Back</Link>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <Link to='/' className='primary-btn btn'>
          Back
        </Link>
        <input
          name='title'
          type='text'
          value={data.title}
          onChange={handleDataChange}
        />
        {generateTags()}
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
`;

export default EditMemo;
