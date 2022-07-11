import styled from 'styled-components';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useState } from 'react';

const MemoTag = ({ tagName, removeTag }) => {
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  return (
    <Wrapper
      onMouseOver={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
      <p>#{tagName}</p>
      <AiFillCloseCircle
        className={showDeleteButton ? 'delete-btn show' : 'delete-btn'}
        onClick={() => removeTag(tagName)}
      />
    </Wrapper>
  );
};

const Wrapper = styled.article`
  position: relative;
  border: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 8px;
  margin-right: 12px;

  &:hover {
    background-color: var(--primary-100);
  }

  .delete-btn {
    position: absolute;
    width: 24px;
    height: 24px;
    opacity: 0;
    top: -8px;
    right: -12px;
    z-index: 1;
    cursor: pointer;
  }

  .delete-btn.show {
    opacity: 0.7;
  }
`;

export default MemoTag;
