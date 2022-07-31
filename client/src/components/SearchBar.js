import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { generateSearchQueryString } from '../utils/searchQuery';
import { sortingOptions } from '../constants';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [pinned, setPinned] = useState('');
  const [sorting, setSorting] = useState(0);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchOptions();
  }, [searchParams]);

  const setSearchOptions = () => {
    const keywordParma = searchParams.get('keyword');
    const pinnedParma = searchParams.get('pinned');
    const sortingParma = searchParams.get('sorting');
    if (keywordParma) {
      setKeyword(keywordParma);
    }
    if (pinnedParma) {
      setPinned(pinnedParma);
    }
    if (sortingParma) {
      let sortingIndex = 0;
      for (let i = 0; i < sortingOptions.length; i++) {
        if (sortingOptions[i].value === sortingParma) {
          sortingIndex = i;
        }
      }
      setSorting(sortingIndex);
    }
  };

  const handleKeywordChange = (e) => {
    let input = e.target.value;
    setKeyword(input);
  };

  const handleSortingOptionChange = (e) => {
    const input = e.target.value;
    setSorting(input);
  };

  const handlePinnedChange = (e) => {
    const input = e.target.value;
    setPinned(input);
  };

  const handleSearch = () => {
    let queryStr = generateSearchQueryString({
      keyword,
      pinned,
      sorting: sortingOptions[sorting].value,
    });
    navigate(queryStr);
  };

  return (
    <Wrapper>
      {/* keyword input */}
      <input
        className='keyword-input'
        type='text'
        placeholder='Search for title, content or tags'
        value={keyword}
        onChange={handleKeywordChange}
      />
      {/* search button */}
      <button className='btn primary-btn' onClick={handleSearch}>
        Search
      </button>
      {/* sorting select */}
      <select
        className='sorting'
        value={sorting}
        onChange={handleSortingOptionChange}
      >
        {sortingOptions.map((option, index) => {
          return (
            <option key={option.label} value={index}>
              {option.label}
            </option>
          );
        })}
      </select>
      {/* radio buttons */}
      <fieldset className='radio-btn-container'>
        <div className='row'>
          <label>Show Both</label>
          <input
            type='radio'
            value=''
            name='pinned'
            onChange={handlePinnedChange}
            checked={!pinned}
          />
        </div>
        <div>
          <label>Show pinned only</label>
          <input
            type='radio'
            value='true'
            name='pinned'
            onChange={handlePinnedChange}
            checked={pinned === 'true'}
          />
        </div>
        <div>
          <label>Show non-pinned only</label>
          <input
            type='radio'
            value='false'
            name='pinned'
            onChange={handlePinnedChange}
            checked={pinned === 'false'}
          />
        </div>
      </fieldset>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 80%;

  fieldset {
    border: 0;
  }

  .sorting {
    padding: 0 12px;
  }

  .keyword-input {
    width: 80%;
    height: 40px;
    padding: 0 12px;
  }

  .radio-btn-container {
    display: flex;
  }

  .row {
    margin-right: 12px;
  }
`;

export default SearchBar;
